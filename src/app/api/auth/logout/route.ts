import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (session) {
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "LOGOUT",
        entity: "User",
        entityId: session.userId,
      },
    });
  }
  await clearSessionCookie();
  return NextResponse.json({ success: true });
}
