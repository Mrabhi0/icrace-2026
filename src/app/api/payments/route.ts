export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { generateTransactionRef } from "@/lib/utils";

// Get payments for current user or all (for finance/admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all && (user.roles.includes("FINANCE_MANAGER") || user.roles.includes("SUPER_ADMIN"))) {
      const payments = await prisma.payment.findMany({
        include: { registration: { include: { user: true, participant: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(payments);
    }

    // Regular user - get their payments
    const payments = await prisma.payment.findMany({
      where: { registration: { userId: user.id } },
      include: { registration: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error("GET payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// Simulate payment (TEST MODE)
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { registrationId, result = "success" } = body;

    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { payments: true },
    });

    if (!reg) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    if (reg.userId !== user.id && !user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Idempotency: check for existing successful payment
    const existingSuccess = reg.payments.find((p) => p.status === "SUCCESS");
    if (existingSuccess && result === "success") {
      return NextResponse.json({ error: "Payment already completed", payment: existingSuccess }, { status: 409 });
    }

    const transactionRef = generateTransactionRef();

    if (result === "success") {
      // Create successful payment
      const payment = await prisma.payment.create({
        data: {
          registrationId: reg.id,
          transactionRef,
          amount: reg.totalAmount,
          status: "SUCCESS",
          method: "TEST_GATEWAY",
          isTestMode: true,
        },
      });

      // Update registration status
      await prisma.registration.update({
        where: { id: reg.id },
        data: { status: "PAID" },
      });

      // Log test email
      await prisma.emailLog.create({
        data: {
          to: user.email,
          subject: "Payment Successful - ICRACE 2026",
          body: `Dear ${user.firstName},\n\nYour payment of ₹${reg.totalAmount} has been successfully processed.\nTransaction Ref: ${transactionRef}\nRegistration ID: ${reg.registrationId}`,
          templateName: "PAYMENT_SUCCESS",
          isTestMode: true,
        },
      });

      // Notification
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Payment Successful",
          message: `Payment of ₹${reg.totalAmount} confirmed. Transaction: ${transactionRef}`,
          type: "SUCCESS",
        },
      });

      // Audit log
      await prisma.auditLog.create({
        data: { userId: user.id, action: "PAYMENT_SUCCESS", entity: "Payment", entityId: payment.id, details: `Amount: ${reg.totalAmount}` },
      });

      return NextResponse.json({ success: true, payment });
    } else if (result === "fail") {
      // Create failed payment
      const payment = await prisma.payment.create({
        data: {
          registrationId: reg.id,
          transactionRef,
          amount: reg.totalAmount,
          status: "FAILED",
          method: "TEST_GATEWAY",
          isTestMode: true,
          errorMessage: "Simulated payment failure (TEST MODE)",
        },
      });

      // Do NOT update registration to PAID
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: "Payment Failed",
          message: `Payment attempt failed. Please try again. Transaction: ${transactionRef}`,
          type: "ERROR",
        },
      });

      await prisma.auditLog.create({
        data: { userId: user.id, action: "PAYMENT_FAILED", entity: "Payment", entityId: payment.id },
      });

      return NextResponse.json({ success: false, payment, error: "Payment failed (TEST MODE)" }, { status: 400 });
    } else {
      // Pending
      const payment = await prisma.payment.create({
        data: {
          registrationId: reg.id,
          transactionRef,
          amount: reg.totalAmount,
          status: "PENDING",
          method: "TEST_GATEWAY",
          isTestMode: true,
        },
      });

      return NextResponse.json({ success: false, payment, message: "Payment is pending" });
    }
  } catch (error) {
    console.error("POST payment error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}

