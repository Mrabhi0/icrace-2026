import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, institution, department, category, attendanceMode } = body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Find PARTICIPANT role
    const participantRole = await prisma.role.findUnique({ where: { name: "PARTICIPANT" } });
    if (!participantRole) {
      return NextResponse.json({ error: "Registration not configured" }, { status: 500 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone: phone || null,
        roles: { create: [{ roleId: participantRole.id }] },
        participant: institution ? {
          create: {
            institution,
            department: department || null,
            category: category || "FACULTY",
            attendanceMode: attendanceMode || "IN_PERSON",
          },
        } : undefined,
      },
      include: { roles: { include: { role: true } }, participant: true },
    });

    const roles = user.roles.map((r) => r.role.name);

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles,
    });

    await setSessionCookie(token);

    // Welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to ICRACE 2026",
        message: `Hello ${firstName}, your account has been created. Complete your profile and register for the conference.`,
        type: "SUCCESS",
      },
    });

    // Log test email
    await prisma.emailLog.create({
      data: {
        to: user.email,
        subject: "Welcome to ICRACE 2026 - Account Created",
        body: `Dear ${firstName} ${lastName},\n\nYour account has been created successfully. Welcome to ICRACE 2026!\n\nPlease complete your profile and register for the conference.`,
        templateName: "ACCOUNT_REGISTRATION",
        isTestMode: true,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        entity: "User",
        entityId: user.id,
      },
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, firstName, lastName, roles } });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
  }
}
