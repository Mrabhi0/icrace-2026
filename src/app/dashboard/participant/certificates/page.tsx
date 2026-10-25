import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Award, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function Certificates() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("PARTICIPANT") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const certificates = await prisma.certificate.findMany({
    where: { participant: { userId: user.id } },
    include: { registration: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Certificates</h1>
        <p className="text-gray-500 mt-1">Your participation and presentation certificates</p>
      </div>

      {certificates.length === 0 ? (
        <Card><CardBody className="text-center py-12">
          <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No certificates available yet</p>
          <p className="text-sm text-gray-400 mt-1">Certificates are issued after the conference for eligible participants</p>
        </CardBody></Card>
      ) : (
        <div className="space-y-3">
          {certificates.map((c) => (
            <Card key={c.id} hover>
              <CardBody className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50"><Award className="h-5 w-5 text-teal-600" /></div>
                  <div>
                    <p className="font-medium text-navy-800">{c.type} Certificate</p>
                    <p className="text-sm text-gray-500">ID: {c.certificateId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={c.status}>{c.status}</Badge>
                  {c.status === "ISSUED" && <Button variant="outline" className="gap-2 text-xs"><Download className="h-4 w-4" /> Download</Button>}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
