import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Refunds() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("FINANCE_MANAGER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const refunds = await prisma.refund.findMany({ include: { registration: { include: { user: true } }, payment: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Refund Requests</h1>
        <p className="text-gray-500 mt-1">Track and process refund requests</p>
      </div>
      {refunds.length === 0 ? (
        <Card><CardBody className="text-center py-12"><RotateCcw className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No refund requests</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {refunds.map((r) => (
            <Card key={r.id} hover><CardBody>
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-medium text-navy-800">{r.registration?.user?.firstName} {r.registration?.user?.lastName}</p><p className="text-sm text-gray-500">₹{r.amount} · {r.reason}</p><p className="text-xs text-gray-400">Requested: {formatDateTime(r.requestedAt)}</p></div>
                <Badge status={r.status}>{r.status}</Badge>
              </div>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
