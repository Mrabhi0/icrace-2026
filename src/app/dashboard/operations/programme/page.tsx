import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Programme() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("OPERATIONS_MANAGER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const sessions = await prisma.session.findMany({ orderBy: { date: "asc" } });
  const days = [...new Set(sessions.map(s => s.day))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Programme Management</h1>
        <p className="text-gray-500 mt-1">Day-wise conference schedule</p>
      </div>
      {days.map(day => (
        <Card key={day}>
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 text-white text-xs font-bold">D{day}</div>
              <h2 className="text-lg font-bold text-navy-800">Day {day}</h2>
            </div>
            <div className="space-y-2">
              {sessions.filter(s => s.day === day).map(s => (
                <div key={s.id} className="flex items-center gap-3 pb-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm font-mono text-gray-600 w-28">{s.startTime}–{s.endTime}</span>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium text-navy-800 truncate">{s.title}</p></div>
                  <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="h-3 w-3" /> {s.location}</span>
                  <Badge className="bg-gray-100 text-gray-600 text-xs">{s.type}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
