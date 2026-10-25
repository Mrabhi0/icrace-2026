export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const fees = await prisma.feeRule.findMany({ orderBy: { category: "asc" } });
    return NextResponse.json(fees);
  } catch (error) {
    console.error("GET fees error:", error);
    return NextResponse.json({ error: "Failed to fetch fees" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["FINANCE_MANAGER", "SUPER_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, standardFee, earlyBirdFee, earlyBirdEndDate, standardEndDate, attendanceMode, isActive } = body;

    await prisma.feeRule.update({
      where: { id },
      data: {
        standardFee: parseFloat(standardFee),
        earlyBirdFee: parseFloat(earlyBirdFee),
        earlyBirdEndDate: earlyBirdEndDate ? new Date(earlyBirdEndDate) : null,
        standardEndDate: standardEndDate ? new Date(standardEndDate) : null,
        attendanceMode,
        isActive,
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "FEE_UPDATED", entity: "FeeRule", entityId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT fees error:", error);
    return NextResponse.json({ error: "Failed to update fees" }, { status: 500 });
  }
}

