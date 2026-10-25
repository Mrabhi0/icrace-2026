import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewerProfile() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-800">Reviewer Profile</h1>
      <Card>
        <CardHeader><CardTitle>Expertise & Details</CardTitle></CardHeader>
        <CardBody>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-500">Name</p><p className="text-navy-800">{user.firstName} {user.lastName}</p></div>
            <div><p className="text-sm text-gray-500">Email</p><p className="text-navy-800">{user.email}</p></div>
            <div><p className="text-sm text-gray-500">Roles</p><div className="flex gap-1">{user.roles.map(r => <Badge key={r} className="bg-navy-50 text-navy-700">{r.replace(/_/g, " ")}</Badge>)}</div></div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
