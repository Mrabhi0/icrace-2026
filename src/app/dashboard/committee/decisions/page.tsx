import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Decisions() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("COMMITTEE_MEMBER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const decisions = await prisma.editorialDecision.findMany({
    include: { submission: { include: { track: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Editorial Decisions</h1>
        <p className="text-gray-500 mt-1">All recorded editorial decisions with timestamps</p>
      </div>
      {decisions.length === 0 ? (
        <Card><CardBody className="text-center py-12"><p className="text-gray-500">No decisions recorded yet</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => (
            <Card key={d.id} hover><CardBody>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div><p className="font-medium text-navy-800">{d.submission?.title}</p><p className="text-sm text-gray-500">{d.submission?.track?.name}</p></div>
                <Badge status={d.decision}>{d.decision.replace(/_/g, " ")}</Badge>
              </div>
              {d.comments && <p className="text-sm text-gray-600">{d.comments}</p>}
              <p className="text-xs text-gray-400 mt-2">By: {d.decidedByName} · {formatDate(d.createdAt)}</p>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
