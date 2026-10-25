import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import { DollarSign, CreditCard, CheckCircle2, AlertTriangle, TrendingUp, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function FinanceOverview() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("FINANCE_MANAGER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const [registrations, payments, refunds] = await Promise.all([
    prisma.registration.findMany({ include: { user: true, payments: true }, orderBy: { createdAt: "desc" } }),
    prisma.payment.findMany({ include: { registration: { include: { user: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.refund.findMany({ include: { registration: true } }),
  ]);

  const paid = registrations.filter(r => r.status === "PAID");
  const pending = registrations.filter(r => r.status === "PENDING");
  const failed = payments.filter(p => p.status === "FAILED");
  const confirmedRevenue = paid.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Finance Dashboard</h1>
          <p className="text-gray-500 mt-1">Registration payments, transactions, and revenue</p>
        </div>
        <Link href="/dashboard/finance/reports"><Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Reports</Button></Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Registrations" value={registrations.length} icon={CreditCard} color="navy" />
        <StatCard label="Paid" value={paid.length} icon={CheckCircle2} color="emerald" />
        <StatCard label="Pending Payment" value={pending.length} icon={AlertTriangle} color="amber" />
        <StatCard label="Confirmed Revenue" value={`₹${confirmedRevenue.toLocaleString()}`} icon={TrendingUp} color="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
          <CardBody>
            {payments.length > 0 ? (
              <div className="space-y-2">
                {payments.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 pb-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{p.registration?.user?.firstName} {p.registration?.user?.lastName}</p>
                      <p className="text-xs text-gray-400">{p.transactionRef} · {formatDateTime(p.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">₹{p.amount}</p>
                      <Badge status={p.status}>{p.status}</Badge>
                    </div>
                  </div>
                ))}
                <Link href="/dashboard/finance/transactions"><Button variant="outline" className="w-full mt-2">View All</Button></Link>
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-4">No transactions</p>}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Registration Status</CardTitle></CardHeader>
          <CardBody>
            <div className="space-y-3">
              {[
                { label: "Paid", count: paid.length, color: "bg-emerald-100 text-emerald-700" },
                { label: "Pending", count: pending.length, color: "bg-amber-100 text-amber-700" },
                { label: "Failed", count: registrations.filter(r => r.status === "FAILED").length, color: "bg-red-100 text-red-700" },
                { label: "Refunded", count: registrations.filter(r => r.status === "REFUNDED").length, color: "bg-purple-100 text-purple-700" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{s.label}</span>
                  <span className={`badge ${s.color}`}>{s.count}</span>
                </div>
              ))}
            </div>
            {failed.length > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
                <AlertTriangle className="h-4 w-4" /> {failed.length} failed payment(s) need attention
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
