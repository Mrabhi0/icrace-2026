import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCertificates() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const certs = await prisma.certificate.findMany({ include: { participant: { include: { user: true } }, registration: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-navy-800">Certificate Management</h1><p className="text-gray-500 mt-1">View and manage all certificates</p></div>
      {certs.length === 0 ? (
        <Card><CardBody className="text-center py-12"><Award className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No certificates issued</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {certs.map((c) => (
            <Card key={c.id} hover><CardBody className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-teal-500" />
                <div><p className="font-medium text-navy-800">{c.participant?.user?.firstName} {c.participant?.user?.lastName}</p><p className="text-sm text-gray-500">{c.certificateId} · {c.type}</p></div>
              </div>
              <Badge status={c.status}>{c.status}</Badge>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
