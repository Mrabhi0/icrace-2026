export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.conferenceSetting.findMany();
    const result = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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
    for (const [key, value] of Object.entries(body)) {
      await prisma.conferenceSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    await prisma.auditLog.create({
      data: { userId: user.id, action: "SETTINGS_UPDATED", entity: "ConferenceSetting", details: JSON.stringify(Object.keys(body)) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

