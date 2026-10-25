export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
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
    const { title, content, isPublished } = body;

    const announcement = await prisma.announcement.create({
      data: { title, content, isPublished: !!isPublished, publishedAt: isPublished ? new Date() : null },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "ANNOUNCEMENT_CREATED", entity: "Announcement", entityId: announcement.id },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error) {
    console.error("POST announcement error:", error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["OPERATIONS_MANAGER", "SUPER_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, title, content, isPublished } = body;

    await prisma.announcement.update({
      where: { id },
      data: { title, content, isPublished: !!isPublished, publishedAt: isPublished ? new Date() : null },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update announcement" }, { status: 500 });
  }
}

