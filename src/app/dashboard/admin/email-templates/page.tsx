import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardBody } from "@/components/ui/Card";
import { Mail, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmailTemplates() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!user.roles.includes("SUPER_ADMIN")) redirect("/access-denied");

  const templates = await prisma.emailTemplate.findMany({ orderBy: { name: "asc" } });
  const logs = await prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Email Templates & Log</h1>
        <p className="text-gray-500 mt-1">Configure email templates and view the test email log</p>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
        <AlertCircle className="h-4 w-4" /> Email service is in TEST MODE. Emails are logged but not sent. Configure a real email provider in production.
      </div>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-navy-800 mb-3 flex items-center gap-2"><Mail className="h-5 w-5 text-teal-500" /> Email Templates</h2>
          {templates.length === 0 ? (
            <p className="text-sm text-gray-400">No templates configured</p>
          ) : (
            <div className="space-y-3">
              {templates.map((t) => (
                <div key={t.id} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-navy-800 text-sm">{t.name.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-500 mt-1">Subject: {t.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">Variables: {t.variables || "None"}</p>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="font-semibold text-navy-800 mb-3">Test Email Log (Last 20)</h2>
          {logs.length === 0 ? (
            <p className="text-sm text-gray-400">No emails sent yet</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between gap-2 pb-2 border-b border-gray-50 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-800 truncate">{log.subject}</p>
                    <p className="text-xs text-gray-400">To: {log.to}</p>
                  </div>
                  <span className="badge bg-amber-100 text-amber-700 text-xs flex-shrink-0">TEST</span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
