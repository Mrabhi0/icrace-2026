export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.roles.some(r => ["FINANCE_MANAGER", "SUPER_ADMIN", "OPERATIONS_MANAGER"].includes(r))) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "registrations";

    let csv = "";
    const header = (cols: string[]) => cols.join(",");
    const row = (vals: any[]) => vals.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",");

    if (type === "registrations") {
      const regs = await prisma.registration.findMany({
        include: { user: true, participant: true, payments: true },
        orderBy: { createdAt: "desc" },
      });
      csv = header(["Registration ID", "Name", "Email", "Category", "Mode", "Amount", "Status", "Date"]) + "\n";
      csv += regs.map(r => row([r.registrationId, `${r.user?.firstName} ${r.user?.lastName}`, r.user?.email, r.category, r.attendanceMode, r.totalAmount, r.status, r.createdAt])).join("\n");
    } else if (type === "payments") {
      const payments = await prisma.payment.findMany({
        include: { registration: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
      });
      csv = header(["Transaction Ref", "Registration ID", "Name", "Email", "Amount", "Status", "Method", "Test Mode", "Date"]) + "\n";
      csv += payments.map(p => row([p.transactionRef, p.registration?.registrationId, `${p.registration?.user?.firstName} ${p.registration?.user?.lastName}`, p.registration?.user?.email, p.amount, p.status, p.method, p.isTestMode, p.createdAt])).join("\n");
    } else if (type === "submissions") {
      const subs = await prisma.submission.findMany({
        include: { track: true, participant: true, authors: true },
        orderBy: { createdAt: "desc" },
      });
      csv = header(["Title", "Track", "Status", "Keywords", "Submitted At"]) + "\n";
      csv += subs.map(s => row([s.title, s.track?.name, s.status, s.keywords, s.submittedAt])).join("\n");
    } else if (type === "decisions") {
      const decisions = await prisma.editorialDecision.findMany({
        include: { submission: true },
        orderBy: { createdAt: "desc" },
      });
      csv = header(["Submission Title", "Decision", "Decided By", "Comments", "Date"]) + "\n";
      csv += decisions.map(d => row([d.submission?.title, d.decision, d.decidedByName, d.comments, d.createdAt])).join("\n");
    } else if (type === "users") {
      const users = await prisma.user.findMany({
        include: { roles: { include: { role: true } }, participant: true },
        orderBy: { createdAt: "desc" },
      });
      csv = header(["Name", "Email", "Roles", "Institution", "Active", "Created"]) + "\n";
      csv += users.map(u => row([`${u.firstName} ${u.lastName}`, u.email, u.roles.map(r => r.role.name).join("; "), u.participant?.institution, u.isActive, u.createdAt])).join("\n");
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}_report.csv"`,
      },
    });
  } catch (error) {
    console.error("GET reports error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}

