"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/utils";

interface Reg {
  id: string;
  registrationId: string;
  category: string;
  attendanceMode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  participant: { institution: string | null } | null;
}

export default function FinanceRegistrations() {
  const [regs, setRegs] = useState<Reg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/registrations").then(r => r.json()).then(data => { setRegs(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const columns: Column<Reg>[] = [
    { key: "registrationId", header: "Reg ID", sortable: true, render: (r) => <span className="font-mono text-xs">{r.registrationId}</span> },
    { key: "name", header: "Name", sortable: true, render: (r) => `${r.user?.firstName || ""} ${r.user?.lastName || ""}` },
    { key: "category", header: "Category", sortable: true },
    { key: "totalAmount", header: "Amount", sortable: true, render: (r) => `₹${r.totalAmount}` },
    { key: "status", header: "Status", sortable: true, render: (r) => <Badge status={r.status}>{r.status}</Badge> },
    { key: "createdAt", header: "Date", sortable: true, render: (r) => formatDate(r.createdAt) },
  ];

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-800">All Registrations</h1>
      <DataTable columns={columns} data={regs} searchKeys={["registrationId"]} searchPlaceholder="Search by Reg ID..." pageSize={10} />
    </div>
  );
}
