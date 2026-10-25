"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Save } from "lucide-react";

export default function AdminFees() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/fees").then(r => r.json()).then(data => { setFees(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const update = (id: string, key: string, value: any) => setFees(fees.map(f => f.id === id ? { ...f, [key]: value } : f));

  const save = async (fee: any) => {
    try {
      await fetch("/api/fees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fee) });
      setMessage(`${fee.category} updated`);
    } catch { setMessage("Failed"); }
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-navy-800">Fee Rules</h1><p className="text-gray-500 mt-1">Configure registration fee categories</p></div>
      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>}
      <div className="space-y-3">
        {fees.map((fee) => (
          <Card key={fee.id}><CardBody>
            <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-navy-800">{fee.category.replace(/_/g, " ")}</h3><Badge status={fee.isActive ? "PAID" : "FAILED"}>{fee.isActive ? "Active" : "Inactive"}</Badge></div>
            <div className="grid sm:grid-cols-3 gap-3">
              <Input label="Standard Fee" type="number" value={fee.standardFee} onChange={(e) => update(fee.id, "standardFee", parseFloat(e.target.value))} />
              <Input label="Early Bird" type="number" value={fee.earlyBirdFee} onChange={(e) => update(fee.id, "earlyBirdFee", parseFloat(e.target.value))} />
              <Input label="Mode" value={fee.attendanceMode} onChange={(e) => update(fee.id, "attendanceMode", e.target.value)} />
            </div>
            <Button variant="secondary" className="gap-2 mt-3 text-sm" onClick={() => save(fee)}><Save className="h-4 w-4" /> Save</Button>
          </CardBody></Card>
        ))}
      </div>
    </div>
  );
}
