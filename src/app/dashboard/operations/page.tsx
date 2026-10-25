import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatDateTime, formatDate } from "@/lib/utils";
import { QrCode, Users, Calendar, Megaphone, CheckCircle2, ClipboardList } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OperationsOverview() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("OPERATIONS_MANAGER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const [sessions, attendance, volunteers, announcements] = await Promise.all([
    prisma.session.findMany({ orderBy: { date: "asc" } }),
    prisma.attendance.findMany({ include: { participant: { include: { user: true } } } }),
    prisma.volunteer.findMany(),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const checkedIn = attendance.filter(a => a.status === "CHECKED_IN");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Operations Dashboard</h1>
        <p className="text-gray-500 mt-1">Conference day operations, attendance, and logistics</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Sessions" value={sessions.length} icon={Calendar} color="navy" />
        <StatCard label="Checked In" value={checkedIn.length} icon={CheckCircle2} color="emerald" />
        <StatCard label="Volunteers" value={volunteers.length} icon={Users} color="royal" />
        <StatCard label="Announcements" value={announcements.filter(a => a.isPublished).length} icon={Megaphone} color="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Day-wise Programme</CardTitle></CardHeader>
          <CardBody>
            {sessions.length > 0 ? (
              <div className="space-y-2">
                {sessions.slice(0, 6).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 pb-2 border-b border-gray-50 last:border-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-100 text-xs font-bold text-navy-700">D{s.day}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.startTime}–{s.endTime} · {s.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-4">No sessions</p>}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Check-ins</CardTitle></CardHeader>
          <CardBody>
            {checkedIn.length > 0 ? (
              <div className="space-y-2">
                {checkedIn.slice(0, 6).map((a) => (
                  <div key={a.id} className="flex items-center justify-between gap-2 pb-2 border-b border-gray-50 last:border-0">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{a.participant?.user?.firstName} {a.participant?.user?.lastName}</p>
                      <p className="text-xs text-gray-400">{a.method} check-in · {a.checkedInAt ? formatDateTime(a.checkedInAt) : "—"}</p>
                    </div>
                    <span className="badge bg-emerald-100 text-emerald-700 text-xs">Checked In</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-400 text-center py-4">No check-ins yet</p>}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
