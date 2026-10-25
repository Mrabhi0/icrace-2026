import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditLogs() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const logs = await prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-navy-800">Audit Logs</h1><p className="text-gray-500 mt-1">System activity log (last 100 entries)</p></div>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr><th className="table-header">Action</th><th className="table-header">User</th><th className="table-header">Entity</th><th className="table-header">Details</th><th className="table-header">Timestamp</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="table-cell"><Badge className="bg-navy-50 text-navy-700">{log.action.replace(/_/g, " ")}</Badge></td>
                  <td className="table-cell">{log.user?.firstName} {log.user?.lastName}</td>
                  <td className="table-cell text-gray-500">{log.entity || "—"}</td>
                  <td className="table-cell text-gray-500 text-xs">{log.details || "—"}</td>
                  <td className="table-cell text-gray-400 text-xs">{formatDateTime(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
