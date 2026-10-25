export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["OPERATIONS_MANAGER", "SUPER_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const attendance = await prisma.attendance.findMany({
      include: { participant: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(attendance);
  } catch {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["OPERATIONS_MANAGER", "SUPER_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { registrationId, method = "MANUAL" } = body;

    // Find participant by registration ID
    const registration = await prisma.registration.findUnique({
      where: { registrationId },
      include: { participant: { include: { user: true } } },
    });

    if (!registration) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    if (registration.status !== "PAID") return NextResponse.json({ error: "Registration not paid" }, { status: 400 });
    if (!registration.participant) return NextResponse.json({ error: "Participant record not found" }, { status: 404 });

    // Check for duplicate check-in
    const existingCheckin = await prisma.attendance.findFirst({
      where: { participantId: registration.participant.id, status: "CHECKED_IN" },
    });
    if (existingCheckin) {
      return NextResponse.json({ error: "Already checked in", attendance: existingCheckin }, { status: 409 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        participantId: registration.participant.id,
        status: "CHECKED_IN",
        checkedInAt: new Date(),
        method,
        checkedInBy: user.id,
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "CHECK_IN", entity: "Attendance", entityId: attendance.id, details: `Registration: ${registrationId}, Method: ${method}` },
    });

    return NextResponse.json({ success: true, attendance, participantName: `${registration.participant.user?.firstName} ${registration.participant.user?.lastName}` });
  } catch (error) {
    console.error("POST attendance error:", error);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}

