"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/utils";

export default function AdminSubmissions() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/submissions?all=true").then(r => r.json()).then(data => { setSubs(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const columns: Column<any>[] = [
    { key: "title", header: "Title", sortable: true, render: (s) => <span className="font-medium text-navy-800">{s.title}</span> },
    { key: "track", header: "Track", sortable: true, render: (s) => s.track?.name || "—" },
    { key: "status", header: "Status", sortable: true, render: (s) => <Badge status={s.status}>{s.status.replace(/_/g, " ")}</Badge> },
    { key: "submittedAt", header: "Submitted", sortable: true, render: (s) => s.submittedAt ? formatDate(s.submittedAt) : "—" },
  ];

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-navy-800">All Submissions</h1>
      <DataTable columns={columns} data={subs} searchKeys={["title"]} searchPlaceholder="Search submissions..." pageSize={10} />
    </div>
  );
}
