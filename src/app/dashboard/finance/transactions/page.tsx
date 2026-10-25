"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDateTime, formatCurrency } from "@/lib/utils";

interface Payment {
  id: string;
  transactionRef: string;
  amount: number;
  status: string;
  method: string;
  isTestMode: boolean;
  createdAt: string;
  registration: { registrationId: string; user: { firstName: string; lastName: string; email: string } } | null;
}

export default function FinanceTransactions() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments?all=true").then(r => r.json()).then(data => {
      setPayments(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const columns: Column<Payment>[] = [
    { key: "transactionRef", header: "Transaction Ref", sortable: true, render: (p) => <span className="font-mono text-xs">{p.transactionRef}</span> },
    { key: "name", header: "Name", sortable: true, render: (p) => `${p.registration?.user?.firstName || ""} ${p.registration?.user?.lastName || ""}` },
    { key: "amount", header: "Amount", sortable: true, render: (p) => `₹${p.amount}` },
    { key: "status", header: "Status", sortable: true, render: (p) => <Badge status={p.status}>{p.status}</Badge> },
    { key: "method", header: "Method", render: (p) => p.method },
    { key: "createdAt", header: "Date", sortable: true, render: (p) => formatDateTime(p.createdAt) },
  ];

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">All Transactions</h1>
        <p className="text-gray-500 mt-1">Search and filter payment records</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
        <span className="badge bg-amber-100 text-amber-800">TEST MODE</span>
        <span>All transactions are simulated</span>
      </div>
      <DataTable columns={columns} data={payments} searchKeys={["transactionRef"]} searchPlaceholder="Search by transaction ref..." pageSize={10} />
    </div>
  );
}
