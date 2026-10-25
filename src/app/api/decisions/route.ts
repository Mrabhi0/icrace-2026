export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Get editorial decisions
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get("submissionId");

    const where = submissionId ? { submissionId } : {};
    const decisions = await prisma.editorialDecision.findMany({
      where,
      include: { submission: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(decisions);
  } catch (error) {
    console.error("GET decisions error:", error);
    return NextResponse.json({ error: "Failed to fetch decisions" }, { status: 500 });
  }
}

// Make editorial decision (committee/admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["COMMITTEE_MEMBER", "SUPER_ADMIN"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const body = await request.json();
    const { submissionId, decision, comments } = body;

    if (!submissionId || !decision) {
      return NextResponse.json({ error: "Submission ID and decision required" }, { status: 400 });
    }

    const validDecisions = ["ACCEPT", "REJECT", "REVISION_REQUESTED"];
    if (!validDecisions.includes(decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const decidedBy = user.id;
    const decidedByName = `${user.firstName} ${user.lastName}`;

    // Create decision record
    const editorialDecision = await prisma.editorialDecision.create({
      data: { submissionId, decision, decidedBy, decidedByName, comments },
    });

    // Update submission status
    const statusMap: Record<string, string> = {
      ACCEPT: "ACCEPTED",
      REJECT: "REJECTED",
      REVISION_REQUESTED: "REVISION_REQUESTED",
    };
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: statusMap[decision] },
    });

    // Notify the submitter
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { participant: true },
    });

    if (submission?.participant) {
      const participantUser = await prisma.participant.findUnique({
        where: { id: submission.participant.id },
        include: { user: true },
      });

      if (participantUser?.user) {
        const titleMap: Record<string, string> = {
          ACCEPT: "Paper Accepted",
          REJECT: "Paper Not Accepted",
          REVISION_REQUESTED: "Revision Requested",
        };
        const msgMap: Record<string, string> = {
          ACCEPT: `Congratulations! Your paper '${submission.title}' has been accepted.`,
          REJECT: `Your paper '${submission.title}' was not accepted. Please see reviewer comments.`,
          REVISION_REQUESTED: `Your paper '${submission.title}' requires revisions. Please check reviewer feedback.`,
        };

        await prisma.notification.create({
          data: {
            userId: participantUser.user.id,
            title: titleMap[decision],
            message: msgMap[decision],
            type: decision === "ACCEPT" ? "SUCCESS" : decision === "REJECT" ? "ERROR" : "WARNING",
          },
        });

        // Log test email
        await prisma.emailLog.create({
          data: {
            to: participantUser.user.email,
            subject: `${titleMap[decision]} - ICRACE 2026`,
            body: `Dear ${participantUser.user.firstName},\n\n${msgMap[decision]}`,
            templateName: decision === "ACCEPT" ? "ACCEPTANCE_NOTIFICATION" : "REJECTION_NOTIFICATION",
            isTestMode: true,
          },
        });
      }
    }

    // Audit log
    await prisma.auditLog.create({
      data: { userId: user.id, action: "EDITORIAL_DECISION", entity: "Submission", entityId: submissionId, details: `Decision: ${decision}, by: ${decidedByName}` },
    });

    return NextResponse.json({ success: true, decision: editorialDecision });
  } catch (error) {
    console.error("POST decision error:", error);
    return NextResponse.json({ error: "Failed to make decision" }, { status: 500 });
  }
}

