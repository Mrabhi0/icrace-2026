"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, FileText } from "lucide-react";

const reportTypes = [
  { type: "registrations", label: "Participant Registrations", desc: "All registration records" },
  { type: "payments", label: "Payment Reconciliation", desc: "All payment transactions" },
  { type: "submissions", label: "Submission Statuses", desc: "All paper submissions" },
  { type: "decisions", label: "Final Decisions", desc: "Editorial decisions log" },
  { type: "users", label: "User Accounts", desc: "All user accounts with roles" },
];

export default function AdminReports() {
  const handleExport = (type: string) => { window.open(`/api/reports?type=${type}`, "_blank"); };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-navy-800">Reports & Exports</h1><p className="text-gray-500 mt-1">Download CSV reports</p></div>
      <div className="grid sm:grid-cols-2 gap-4">
        {reportTypes.map((r) => (
          <Card key={r.type} hover><CardBody className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50"><FileText className="h-5 w-5 text-navy-700" /></div>
              <div><p className="font-medium text-navy-800">{r.label}</p><p className="text-sm text-gray-500">{r.desc}</p></div>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => handleExport(r.type)}><Download className="h-4 w-4" /> CSV</Button>
          </CardBody></Card>
        ))}
      </div>
    </div>
  );
}
