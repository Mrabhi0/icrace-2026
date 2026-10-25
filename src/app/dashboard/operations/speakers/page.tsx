import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Mic, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Speakers() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("OPERATIONS_MANAGER") && !user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const sessions = await prisma.session.findMany({
    where: { type: "KEYNOTE" },
    orderBy: { date: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Speaker Management</h1>
        <p className="text-gray-500 mt-1">Keynote speakers and session chairs</p>
      </div>
      {sessions.length === 0 ? (
        <Card><CardBody className="text-center py-12"><Mic className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No keynote sessions</p></CardBody></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <Card key={s.id} hover><CardBody className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 text-navy-700 font-bold">
                {s.chairName?.split(" ").map(n => n[0]).join("").slice(0, 2) || "KS"}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-navy-800">{s.chairName || "TBA"}</p>
                <p className="text-sm text-gray-500 truncate">{s.title}</p>
                <p className="text-xs text-gray-400">{s.date ? new Date(s.date).toLocaleDateString() : ""} · {s.location}</p>
              </div>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
