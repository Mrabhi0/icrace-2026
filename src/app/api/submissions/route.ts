export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Get submissions (user's own or all for committee/admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const canViewAll = user.roles.some(r => ["COMMITTEE_MEMBER", "SUPER_ADMIN"].includes(r));

    if (all && canViewAll) {
      const submissions = await prisma.submission.findMany({
        include: {
          track: true,
          authors: true,
          assignments: { include: { user: true } },
          reviews: true,
          decisions: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(submissions);
    }

    // Participant: get their submissions
    const participant = await prisma.participant.findUnique({ where: { userId: user.id } });

    const submissions = await prisma.submission.findMany({
      where: participant ? { participantId: participant.id } : { id: "none" },
      include: { track: true, authors: true, reviews: true, assignments: true, decisions: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("GET submissions error:", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}

// Create submission
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { title, abstractText, keywords, trackId, authors = [] } = body;

    if (!title || !abstractText) {
      return NextResponse.json({ error: "Title and abstract are required" }, { status: 400 });
    }

    const participant = await prisma.participant.findUnique({ where: { userId: user.id } });

    const submission = await prisma.submission.create({
      data: {
        title,
        abstractText,
        keywords,
        trackId: trackId || null,
        participantId: participant?.id || null,
        status: "SUBMITTED",
        submittedAt: new Date(),
        authors: {
          create: authors.length > 0 ? authors.map((a: any, i: number) => ({
            name: a.name,
            email: a.email,
            affiliation: a.affiliation || null,
            isCorresponding: a.isCorresponding || i === 0,
            order: i,
            participantId: a.isCorresponding ? participant?.id : null,
          })) : [{
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            isCorresponding: true,
            order: 0,
            participantId: participant?.id || null,
          }],
        },
      },
      include: { authors: true, track: true },
    });

    // Log test email
    await prisma.emailLog.create({
      data: {
        to: user.email,
        subject: "Abstract Submitted - ICRACE 2026",
        body: `Dear ${user.firstName},\n\nYour abstract titled '${title}' has been submitted.\nSubmission ID: ${submission.id}\nStatus: Under Screening`,
        templateName: "ABSTRACT_SUBMITTED",
        isTestMode: true,
      },
    });

    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Abstract Submitted",
        message: `Your submission '${title}' has been received and is under screening.`,
        type: "SUCCESS",
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "SUBMISSION_CREATED", entity: "Submission", entityId: submission.id },
    });

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error("POST submission error:", error);
    return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
  }
}

