export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Get reviews (reviewer's own or all for committee/admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get("submissionId");
    const all = searchParams.get("all") === "true";

    if (all && user.roles.some(r => ["COMMITTEE_MEMBER", "SUPER_ADMIN"].includes(r))) {
      const reviews = await prisma.review.findMany({
        include: { submission: true, user: true, assignment: true },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(reviews);
    }

    if (submissionId && user.roles.some(r => ["COMMITTEE_MEMBER", "SUPER_ADMIN", "REVIEWER"].includes(r))) {
      const reviews = await prisma.review.findMany({
        where: { submissionId },
        include: { user: true },
      });
      return NextResponse.json(reviews);
    }

    // Reviewer's own reviews
    const reviews = await prisma.review.findMany({
      where: { userId: user.id },
      include: { submission: { include: { track: true } }, assignment: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("GET reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// Submit review
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.includes("REVIEWER") && !user.roles.includes("SUPER_ADMIN")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { assignmentId, submissionId, relevance, originality, methodology, clarity, technicalQuality, overallScore, strengths, weaknesses, requiredRevisions, confidentialComments, commentsForAuthor, recommendation } = body;

    // Verify assignment belongs to this reviewer
    const assignment = await prisma.reviewerAssignment.findUnique({
      where: { id: assignmentId },
    });
    if (!assignment || assignment.userId !== user.id) {
      return NextResponse.json({ error: "Assignment not found or not authorized" }, { status: 403 });
    }

    // Check if review already exists
    const existing = await prisma.review.findUnique({ where: { assignmentId } });
    if (existing) {
      return NextResponse.json({ error: "Review already submitted for this assignment" }, { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        assignmentId,
        submissionId,
        userId: user.id,
        relevance, originality, methodology, clarity, technicalQuality, overallScore,
        strengths, weaknesses, requiredRevisions, confidentialComments, commentsForAuthor,
        recommendation,
        submittedAt: new Date(),
      },
    });

    // Update assignment status
    await prisma.reviewerAssignment.update({
      where: { id: assignmentId },
      data: { status: "COMPLETED" },
    });

    // Audit log
    await prisma.auditLog.create({
      data: { userId: user.id, action: "REVIEW_SUBMITTED", entity: "Review", entityId: review.id, details: `Recommendation: ${recommendation}` },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

