export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { generateRegistrationId } from "@/lib/utils";

// Get current user's registrations
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const regs = await prisma.registration.findMany({
      where: { userId: user.id },
      include: { payments: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(regs);
  } catch (error) {
    console.error("GET registrations error:", error);
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

// Create registration
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { category, attendanceMode, feeAmount, discountAmount = 0, taxAmount = 0 } = body;

    if (!category || !attendanceMode || feeAmount == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check for existing registration
    const existing = await prisma.registration.findFirst({
      where: { userId: user.id, status: { notIn: ["FAILED", "REFUNDED"] } },
    });
    if (existing) {
      return NextResponse.json({ error: "You already have an active registration" }, { status: 409 });
    }

    const registrationId = generateRegistrationId();
    const totalAmount = feeAmount - discountAmount + taxAmount;

    // Get participant record
    const participant = await prisma.participant.findUnique({ where: { userId: user.id } });

    const reg = await prisma.registration.create({
      data: {
        participantId: participant?.id || null,
        userId: user.id,
        registrationId,
        category,
        attendanceMode,
        feeAmount: parseFloat(feeAmount),
        discountAmount: parseFloat(discountAmount),
        taxAmount: parseFloat(taxAmount),
        totalAmount: parseFloat(totalAmount),
        status: "PENDING",
      },
    });

    // Update participant category
    if (participant) {
      await prisma.participant.update({
        where: { id: participant.id },
        data: { category, attendanceMode, registrationId },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: { userId: user.id, action: "REGISTRATION_CREATED", entity: "Registration", entityId: reg.id },
    });

    return NextResponse.json({ success: true, registration: reg });
  } catch (error) {
    console.error("POST registration error:", error);
    return NextResponse.json({ error: "Failed to create registration" }, { status: 500 });
  }
}

