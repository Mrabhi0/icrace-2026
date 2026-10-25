export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const tracks = await prisma.track.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(tracks);
  } catch {
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, topics, guidelines } = body;

    const track = await prisma.track.create({ data: { name, description, topics, guidelines } });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "TRACK_CREATED", entity: "Track", entityId: track.id },
    });

    return NextResponse.json({ success: true, track });
  } catch (error) {
    console.error("POST track error:", error);
    return NextResponse.json({ error: "Failed to create track" }, { status: 500 });
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
    const { id, name, description, topics, guidelines, isActive } = body;

    await prisma.track.update({
      where: { id },
      data: { name, description, topics, guidelines, isActive },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update track" }, { status: 500 });
  }
}

