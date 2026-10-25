"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDateTime } from "@/lib/utils";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments?all=true").then(r => r.json()).then(data => { setPayments(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const columns: Column<any>[] = [
    { key: "transactionRef", header: "Txn Ref", sortable: true, render: (p) => <span className="font-mono text-xs">{p.transactionRef}</span> },
    { key: "name", header: "Name", render: (p) => `${p.registration?.user?.firstName || ""} ${p.registration?.user?.lastName || ""}` },
    { key: "amount", header: "Amount", sortable: true, render: (p) => `₹${p.amount}` },
    { key: "status", header: "Status", sortable: true, render: (p) => <Badge status={p.status}>{p.status}</Badge> },
    { key: "createdAt", header: "Date", sortable: true, render: (p) => formatDateTime(p.createdAt) },
  ];

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-800">Payment Records</h1>
      <DataTable columns={columns} data={payments} searchKeys={["transactionRef"]} searchPlaceholder="Search transactions..." pageSize={10} />
    </div>
  );
}
