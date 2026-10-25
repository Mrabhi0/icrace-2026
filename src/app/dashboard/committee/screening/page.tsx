import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ClipboardCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Screening() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("COMMITTEE_MEMBER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const submissions = await prisma.submission.findMany({
    where: { status: { in: ["SUBMITTED", "SCREENING"] } },
    include: { track: true, authors: true },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Initial Screening</h1>
        <p className="text-gray-500 mt-1">Review submissions before assigning to reviewers</p>
      </div>
      {submissions.length === 0 ? (
        <Card><CardBody className="text-center py-12"><ClipboardCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No submissions pending screening</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <Card key={s.id} hover><CardBody>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div><p className="font-medium text-navy-800">{s.title}</p><p className="text-sm text-gray-500">{s.track?.name} · {s.authors.length} authors</p></div>
                <Badge status={s.status}>{s.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{s.abstractText}</p>
              <p className="text-xs text-gray-400 mt-2">Submitted: {s.submittedAt ? formatDate(s.submittedAt) : "—"}</p>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
