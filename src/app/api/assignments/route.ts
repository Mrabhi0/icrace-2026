export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Get reviewer assignments (reviewer's own or all for committee/admin)
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    if (all && user.roles.some(r => ["COMMITTEE_MEMBER", "SUPER_ADMIN"].includes(r))) {
      const assignments = await prisma.reviewerAssignment.findMany({
        include: { submission: { include: { track: true } }, user: true, review: true },
        orderBy: { assignedAt: "desc" },
      });
      return NextResponse.json(assignments);
    }

    // Reviewer's own assignments
    const assignments = await prisma.reviewerAssignment.findMany({
      where: { userId: user.id },
      include: { submission: { include: { track: true } }, review: true },
      orderBy: { assignedAt: "desc" },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("GET assignments error:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

// Assign reviewer (committee/admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["COMMITTEE_MEMBER", "SUPER_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { submissionId, userId, dueDate } = body;

    if (!submissionId || !userId) {
      return NextResponse.json({ error: "Submission ID and reviewer ID required" }, { status: 400 });
    }

    // Check for duplicate assignment
    const existing = await prisma.reviewerAssignment.findFirst({
      where: { submissionId, userId },
    });
    if (existing) {
      return NextResponse.json({ error: "Reviewer already assigned to this submission" }, { status: 409 });
    }

    const assignment = await prisma.reviewerAssignment.create({
      data: {
        submissionId,
        userId,
        status: "ASSIGNED",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: { submission: true, user: true },
    });

    // Update submission status to UNDER_REVIEW if not already
    await prisma.submission.updateMany({
      where: { id: submissionId, status: "SUBMITTED" },
      data: { status: "UNDER_REVIEW" },
    });

    // Notify reviewer
    await prisma.notification.create({
      data: {
        userId,
        title: "New Review Assignment",
        message: `You have been assigned to review '${assignment.submission.title}'.`,
        type: "INFO",
      },
    });

    // Log test email
    await prisma.emailLog.create({
      data: {
        to: assignment.user.email,
        subject: "New Review Assignment - ICRACE 2026",
        body: `Dear ${assignment.user.firstName},\n\nYou have been assigned to review '${assignment.submission.title}'.`,
        templateName: "REVIEWER_ASSIGNED",
        isTestMode: true,
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "REVIEWER_ASSIGNED", entity: "ReviewerAssignment", entityId: assignment.id, details: `Submission: ${submissionId}, Reviewer: ${userId}` },
    });

    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    console.error("POST assignment error:", error);
    return NextResponse.json({ error: "Failed to assign reviewer" }, { status: 500 });
  }
}

// Delete assignment (unassign reviewer)
export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["COMMITTEE_MEMBER", "SUPER_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Assignment ID required" }, { status: 400 });

    await prisma.reviewerAssignment.delete({ where: { id } });

    await prisma.auditLog.create({
      data: { userId: user.id, action: "REVIEWER_UNASSIGNED", entity: "ReviewerAssignment", entityId: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE assignment error:", error);
    return NextResponse.json({ error: "Failed to unassign reviewer" }, { status: 500 });
  }
}

