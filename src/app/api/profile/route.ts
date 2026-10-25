export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { firstName, lastName, phone, institution, department, designation, city, country, bio } = body;

    await prisma.user.update({
      where: { id: user.id },
      data: { firstName, lastName, phone },
    });

    // Update or create participant record
    const existing = await prisma.participant.findUnique({ where: { userId: user.id } });
    if (existing) {
      await prisma.participant.update({
        where: { userId: user.id },
        data: { institution, department, designation, city, country, bio },
      });
    } else {
      await prisma.participant.create({
        data: { userId: user.id, institution, department, designation, city, country, bio },
      });
    }

    await prisma.auditLog.create({
      data: { userId: user.id, action: "PROFILE_UPDATED", entity: "User", entityId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

