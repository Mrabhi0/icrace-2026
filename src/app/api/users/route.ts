export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: { roles: { include: { role: true } }, participant: true },
      orderBy: { createdAt: "desc" },
    });

    const result = users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      isActive: u.isActive,
      isSuspended: u.isSuspended,
      roles: u.roles.map((r) => r.role.name),
      institution: u.participant?.institution,
      category: u.participant?.category,
      createdAt: u.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, action, roles } = body;

    if (action === "suspend") {
      await prisma.user.update({ where: { id: userId }, data: { isSuspended: true, isActive: false } });
    } else if (action === "reactivate") {
      await prisma.user.update({ where: { id: userId }, data: { isSuspended: false, isActive: true } });
    } else if (action === "updateRoles") {
      // Remove existing roles
      await prisma.userRole.deleteMany({ where: { userId } });
      // Add new roles
      if (roles && roles.length > 0) {
        const roleRecords = await prisma.role.findMany({ where: { name: { in: roles } } });
        await prisma.userRole.createMany({
          data: roleRecords.map((r) => ({ userId, roleId: r.id })),
        });
      }
    }

    await prisma.auditLog.create({
      data: { userId: user.id, action: `USER_${action?.toUpperCase()}`, entity: "User", entityId: userId, details: `Action: ${action}` },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT users error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

