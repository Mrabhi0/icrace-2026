"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { Save } from "lucide-react";

interface Fee {
  id: string;
  category: string;
  standardFee: number;
  earlyBirdFee: number;
  earlyBirdEndDate: string | null;
  standardEndDate: string | null;
  attendanceMode: string;
  isActive: boolean;
}

export default function FeeEngine() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/fees").then(r => r.json()).then(data => { setFees(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const update = (id: string, key: string, value: any) => {
    setFees(fees.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const save = async (fee: Fee) => {
    try {
      await fetch("/api/fees", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fee) });
      setMessage(`${fee.category} fee updated`);
    } catch { setMessage("Failed to update"); }
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Fee Engine</h1>
        <p className="text-gray-500 mt-1">Configure registration fees for each category</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-400"><span className="badge bg-amber-100 text-amber-800">SAMPLE AMOUNTS</span><span>Amounts are demo values — configure as needed</span></div>
      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>}
      <div className="space-y-3">
        {fees.map((fee) => (
          <Card key={fee.id}><CardBody>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-navy-800">{fee.category.replace(/_/g, " ")}</h3>
              <Badge status={fee.isActive ? "PAID" : "FAILED"}>{fee.isActive ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="grid sm:grid-cols-4 gap-3">
              <Input label="Standard Fee (₹)" type="number" value={fee.standardFee} onChange={(e) => update(fee.id, "standardFee", parseFloat(e.target.value))} />
              <Input label="Early Bird (₹)" type="number" value={fee.earlyBirdFee} onChange={(e) => update(fee.id, "earlyBirdFee", parseFloat(e.target.value))} />
              <Input label="Early Bird Ends" type="date" value={fee.earlyBirdEndDate?.split("T")[0] || ""} onChange={(e) => update(fee.id, "earlyBirdEndDate", e.target.value)} />
              <div className="flex items-end"><Button variant="secondary" className="gap-2 w-full" onClick={() => save(fee)}><Save className="h-4 w-4" /> Save</Button></div>
            </div>
          </CardBody></Card>
        ))}
      </div>
    </div>
  );
}
