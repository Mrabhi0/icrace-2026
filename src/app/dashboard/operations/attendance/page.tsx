"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { QrCode, Search, CheckCircle2, AlertCircle, UserCheck } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function OperationsAttendance() {
  const [regId, setRegId] = useState("");
  const [checkinResult, setCheckinResult] = useState<{ success: boolean; message: string; name?: string } | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = () => {
    fetch("/api/attendance").then(r => r.json()).then(data => {
      setAttendance(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { loadAttendance(); }, []);

  const handleCheckIn = async () => {
    if (!regId) return;
    setCheckingIn(true);
    setCheckinResult(null);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: regId, method: "MANUAL" }),
      });
      const data = await res.json();
      if (res.ok) {
        setCheckinResult({ success: true, message: "Check-in successful!", name: data.participantName });
        setRegId("");
        loadAttendance();
      } else {
        setCheckinResult({ success: false, message: data.error || "Check-in failed" });
      }
    } catch {
      setCheckinResult({ success: false, message: "Network error" });
    }
    setCheckingIn(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Attendance & Check-in</h1>
        <p className="text-gray-500 mt-1">QR-based and manual check-in for participants</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Manual Registration ID Lookup</CardTitle></CardHeader>
        <CardBody>
          <div className="flex gap-2">
            <Input placeholder="Enter Registration ID (e.g., REG-2026-0001)" value={regId} onChange={(e) => setRegId(e.target.value)} className="flex-1" />
            <Button variant="secondary" loading={checkingIn} onClick={handleCheckIn} className="gap-2"><UserCheck className="h-4 w-4" /> Check In</Button>
          </div>
          {checkinResult && (
            <div className={`mt-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${checkinResult.success ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"}`}>
              {checkinResult.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <div>
                <p>{checkinResult.message}</p>
                {checkinResult.name && <p className="text-xs mt-0.5">Participant: {checkinResult.name}</p>}
              </div>
            </div>
          )}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <QrCode className="h-4 w-4" /> QR scanning can be added by scanning the participant's QR code which encodes their registration ID
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Attendance Log</CardTitle></CardHeader>
        <CardBody>
          {loading ? <p className="text-sm text-gray-400 text-center py-4">Loading...</p> :
           attendance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="table-header">Participant</th>
                    <th className="table-header">Method</th>
                    <th className="table-header">Check-in Time</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attendance.map((a) => (
                    <tr key={a.id}>
                      <td className="table-cell font-medium text-navy-800">{a.participant?.user?.firstName} {a.participant?.user?.lastName}</td>
                      <td className="table-cell">{a.method}</td>
                      <td className="table-cell">{a.checkedInAt ? formatDateTime(a.checkedInAt) : "—"}</td>
                      <td className="table-cell"><Badge status={a.status}>{a.status.replace(/_/g, " ")}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-4">No attendance records</p>}
        </CardBody>
      </Card>
    </div>
  );
}
