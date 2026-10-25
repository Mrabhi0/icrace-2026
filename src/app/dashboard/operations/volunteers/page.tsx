import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Volunteers() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("OPERATIONS_MANAGER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Volunteer Management</h1>
        <p className="text-gray-500 mt-1">Conference volunteers and their assignments</p>
      </div>
      {volunteers.length === 0 ? (
        <Card><CardBody className="text-center py-12"><Users className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No volunteers registered</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {volunteers.map((v) => (
            <Card key={v.id} hover><CardBody className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold">{v.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
                <div><p className="font-medium text-navy-800">{v.name}</p><p className="text-sm text-gray-500">{v.email} · {v.phone || "No phone"}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-navy-50 text-navy-700">{v.role.replace(/_/g, " ")}</Badge>
                {v.assignedDay && <span className="text-xs text-gray-400">Day {v.assignedDay}</span>}
                <Badge status={v.isActive ? "PAID" : "FAILED"}>{v.isActive ? "Active" : "Inactive"}</Badge>
              </div>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
