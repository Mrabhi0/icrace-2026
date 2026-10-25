import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CommitteeAssignments() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("COMMITTEE_MEMBER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const assignments = await prisma.reviewerAssignment.findMany({
    include: { submission: { include: { track: true } }, user: true, review: true },
    orderBy: { assignedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Reviewer Assignments</h1>
        <p className="text-gray-500 mt-1">Track reviewer workload and assignment status</p>
      </div>
      <div className="space-y-3">
        {assignments.map((a) => (
          <Card key={a.id} hover><CardBody>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-navy-800 truncate">{a.submission.title}</p>
                <p className="text-sm text-gray-500">Reviewer: {a.user.firstName} {a.user.lastName} · Due: {a.dueDate ? formatDate(a.dueDate) : "—"}</p>
              </div>
              <Badge status={a.status}>{a.status.replace(/_/g, " ")}</Badge>
            </div>
          </CardBody></Card>
        ))}
      </div>
    </div>
  );
}
