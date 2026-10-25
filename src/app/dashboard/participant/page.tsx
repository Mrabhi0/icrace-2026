import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard as CreditCardIcon, FileText as FileTextIcon, Award as AwardIcon, Bell as BellIcon, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function ParticipantOverview() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("PARTICIPANT") && !user.roles.includes("SUPER_ADMIN")) {
    redirect("/access-denied");
  }

  const [registrations, submissions, certificates, notifications] = await Promise.all([
    prisma.registration.findMany({
      where: { userId: user.id },
      include: { payments: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.findMany({
      where: { participant: { userId: user.id } },
      include: { track: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.certificate.findMany({
      where: { participant: { userId: user.id } },
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const registration = registrations[0];
  const registrationId = user.participant?.registrationId;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Welcome, {user.firstName}</h1>
        <p className="text-gray-500 mt-1">Your conference participation dashboard</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Registration" value={registration ? <Badge status={registration.status}>{registration.status}</Badge> : "Not registered"} icon={CreditCardIcon} color={registration?.status === "PAID" ? "emerald" : "amber"} />
        <StatCard label="Submissions" value={submissions.length} icon={FileTextIcon} color="royal" />
        <StatCard label="Certificates" value={certificates.length} icon={AwardIcon} color="navy" />
        <StatCard label="Notifications" value={notifications.filter(n => !n.isRead).length} icon={BellIcon} color="teal" />
      </div>

      {registrationId && (
        <Card>
          <CardBody className="flex items-center gap-3 bg-navy-50 rounded-xl">
            <CheckCircle2 className="h-5 w-5 text-teal-600" />
            <div>
              <p className="text-sm font-medium text-navy-800">Your Registration ID: <span className="font-mono text-teal-600">{registrationId}</span></p>
              <p className="text-xs text-gray-500">Use this ID for check-in and all correspondence</p>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Registration Status</CardTitle>
          </CardHeader>
          <CardBody>
            {registration ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Registration ID</span>
                  <span className="font-mono font-medium text-navy-800">{registration.registrationId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="text-navy-800">{registration.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Attendance Mode</span>
                  <span className="text-navy-800">{registration.attendanceMode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-medium text-navy-800">₹{registration.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <Badge status={registration.status}>{registration.status}</Badge>
                </div>
                {registration.status === "PENDING" && (
                  <Link href="/dashboard/participant/registration"><Button variant="secondary" className="w-full mt-2">Complete Payment</Button></Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">You haven&apos;t registered yet</p>
                <Link href="/dashboard/participant/registration"><Button variant="secondary">Register Now</Button></Link>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardBody>
            {submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-2 pb-3 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.track?.name || "No track assigned"}</p>
                    </div>
                    <Badge status={s.status}>{s.status.replace(/_/g, " ")}</Badge>
                  </div>
                ))}
                <Link href="/dashboard/participant/submissions"><Button variant="outline" className="w-full">View All Submissions</Button></Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <FileTextIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No submissions yet</p>
                <Link href="/dashboard/participant/submissions"><Button variant="secondary">Submit Abstract</Button></Link>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardBody>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <BellIcon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${n.type === "SUCCESS" ? "text-emerald-500" : n.type === "ERROR" ? "text-red-500" : n.type === "WARNING" ? "text-amber-500" : "text-blue-500"}`} />
                  <div>
                    <p className="text-sm font-medium text-navy-800">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">No notifications</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
