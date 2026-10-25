import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatDate } from "@/lib/utils";
import { ClipboardList, CheckCircle2, Clock, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewerOverview() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("REVIEWER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const assignments = await prisma.reviewerAssignment.findMany({
    where: { userId: user.id },
    include: { submission: { include: { track: true } }, review: true },
    orderBy: { assignedAt: "desc" },
  });

  const pending = assignments.filter(a => a.status === "ASSIGNED" || a.status === "IN_PROGRESS");
  const completed = assignments.filter(a => a.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Reviewer Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome, {user.firstName}. Your review assignments overview.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Assignments" value={assignments.length} icon={ClipboardList} color="navy" />
        <StatCard label="Pending Reviews" value={pending.length} icon={Clock} color="amber" />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle2} color="emerald" />
        <StatCard label="Submissions Reviewed" value={completed.length} icon={FileText} color="teal" />
      </div>

      <Card>
        <CardHeader><CardTitle>Pending Review Assignments</CardTitle></CardHeader>
        <CardBody>
          {pending.length > 0 ? (
            <div className="space-y-3">
              {pending.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-4 pb-3 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="font-medium text-navy-800 truncate">{a.submission.title}</p>
                    <p className="text-sm text-gray-500">{a.submission.track?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Due: {a.dueDate ? formatDate(a.dueDate) : "No deadline set"}</p>
                  </div>
                  <Badge status={a.status}>{a.status.replace(/_/g, " ")}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No pending reviews. All caught up!</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Completed Reviews</CardTitle></CardHeader>
        <CardBody>
          {completed.length > 0 ? (
            <div className="space-y-3">
              {completed.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-4 pb-3 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="font-medium text-navy-800 truncate">{a.submission.title}</p>
                    <p className="text-sm text-gray-500">Score: {a.review?.overallScore}/10 · {a.review?.recommendation?.replace(/_/g, " ")}</p>
                  </div>
                  <Badge status="COMPLETED">Completed</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No completed reviews yet.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
