import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatDate } from "@/lib/utils";
import { FileText, ClipboardCheck, CheckCircle2, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CommitteeOverview() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("COMMITTEE_MEMBER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const [submissions, assignments, reviews, decisions] = await Promise.all([
    prisma.submission.findMany({ include: { track: true, authors: true, reviews: true, assignments: true } }),
    prisma.reviewerAssignment.findMany({ include: { submission: true, user: true } }),
    prisma.review.findMany({ include: { submission: true } }),
    prisma.editorialDecision.findMany({ include: { submission: true } }),
  ]);

  const byStatus = (s: string) => submissions.filter(sub => sub.status === s);
  const pendingReview = byStatus("UNDER_REVIEW").length;
  const pendingScreening = byStatus("SUBMITTED").length + byStatus("SCREENING").length;
  const accepted = byStatus("ACCEPTED").length;
  const revisionRequested = byStatus("REVISION_REQUESTED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Scientific Committee Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage submissions, reviews, and editorial decisions</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Submissions" value={submissions.length} icon={FileText} color="navy" />
        <StatCard label="Pending Screening" value={pendingScreening} icon={ClipboardCheck} color="amber" />
        <StatCard label="Under Review" value={pendingReview} icon={Users} color="royal" />
        <StatCard label="Accepted" value={accepted} icon={CheckCircle2} color="emerald" />
      </div>

      <Card>
        <CardHeader><CardTitle>Submission Status Breakdown</CardTitle></CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Submitted", count: byStatus("SUBMITTED").length, color: "bg-blue-50 text-blue-700" },
              { label: "Screening", count: byStatus("SCREENING").length, color: "bg-cyan-50 text-cyan-700" },
              { label: "Under Review", count: pendingReview, color: "bg-indigo-50 text-indigo-700" },
              { label: "Revision Requested", count: revisionRequested, color: "bg-orange-50 text-orange-700" },
              { label: "Accepted", count: accepted, color: "bg-emerald-50 text-emerald-700" },
              { label: "Rejected", count: byStatus("REJECTED").length, color: "bg-red-50 text-red-700" },
              { label: "Draft", count: byStatus("DRAFT").length, color: "bg-gray-50 text-gray-700" },
              { label: "Withdrawn", count: byStatus("WITHDRAWN").length, color: "bg-gray-100 text-gray-500" },
            ].map((s) => (
              <div key={s.label} className={`rounded-lg p-3 ${s.color}`}>
                <p className="text-2xl font-bold">{s.count}</p>
                <p className="text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Submissions</CardTitle></CardHeader>
        <CardBody>
          {submissions.length > 0 ? (
            <div className="space-y-3">
              {submissions.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-4 pb-3 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="font-medium text-navy-800 truncate">{s.title}</p>
                    <p className="text-sm text-gray-500">{s.track?.name} · {s.reviews.length} reviews</p>
                  </div>
                  <Badge status={s.status}>{s.status.replace(/_/g, " ")}</Badge>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-4">No submissions</p>}
        </CardBody>
      </Card>
    </div>
  );
}
