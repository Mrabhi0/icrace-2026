import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Users, FileText, DollarSign, CheckCircle2, ClipboardList, Award, BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const [users, registrations, payments, submissions, attendance, certificates, auditLogs] = await Promise.all([
    prisma.user.findMany(),
    prisma.registration.findMany(),
    prisma.payment.findMany(),
    prisma.submission.findMany(),
    prisma.attendance.findMany(),
    prisma.certificate.findMany(),
    prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const paidRegs = registrations.filter(r => r.status === "PAID");
  const revenue = paidRegs.reduce((sum, r) => sum + r.totalAmount, 0);
  const accepted = submissions.filter(s => s.status === "ACCEPTED").length;
  const underReview = submissions.filter(s => s.status === "UNDER_REVIEW" || s.status === "SCREENING").length;
  const checkedIn = attendance.filter(a => a.status === "CHECKED_IN").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Super Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Complete conference management overview</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={users.length} icon={Users} color="navy" />
        <StatCard label="Registrations" value={registrations.length} icon={FileText} color="royal" />
        <StatCard label="Confirmed Revenue" value={`₹${revenue.toLocaleString()}`} icon={DollarSign} color="emerald" />
        <StatCard label="Submissions" value={submissions.length} icon={ClipboardList} color="teal" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Under Review" value={underReview} icon={ClipboardList} color="amber" />
        <StatCard label="Accepted Papers" value={accepted} icon={CheckCircle2} color="emerald" />
        <StatCard label="Checked In" value={checkedIn} icon={Users} color="royal" />
        <StatCard label="Certificates" value={certificates.length} icon={Award} color="navy" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Audit Log</CardTitle></CardHeader>
          <CardBody>
            {auditLogs.length > 0 ? (
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between gap-2 pb-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-800">{log.action.replace(/_/g, " ")}</p>
                      <p className="text-xs text-gray-400">{log.user?.firstName} {log.user?.lastName} · {formatDate(log.createdAt)}</p>
                    </div>
                    {log.entity && <span className="badge bg-gray-100 text-gray-600 text-xs">{log.entity}</span>}
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-4">No audit logs</p>}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>System Status</CardTitle></CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="badge bg-emerald-100 text-emerald-700">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Gateway</span>
                <span className="badge bg-amber-100 text-amber-700">TEST MODE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Service</span>
                <span className="badge bg-amber-100 text-amber-700">TEST MODE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">QR Check-in</span>
                <span className="badge bg-emerald-100 text-emerald-700">Active</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
