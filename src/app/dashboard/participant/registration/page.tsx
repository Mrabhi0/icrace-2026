"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Input";
import { CreditCard, CheckCircle2, AlertCircle, Lock } from "lucide-react";

interface FeeRule {
  id: string;
  category: string;
  standardFee: number;
  earlyBirdFee: number;
}

interface Registration {
  id: string;
  registrationId: string;
  category: string;
  attendanceMode: string;
  feeAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
}

export default function ParticipantRegistration() {
  const [fees, setFees] = useState<FeeRule[]>([]);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("FACULTY");
  const [selectedMode, setSelectedMode] = useState("IN_PERSON");
  const [creating, setCreating] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/fees").then(r => r.json()),
      fetch("/api/registrations").then(r => r.json()),
    ]).then(([feeData, regData]) => {
      setFees(feeData);
      if (Array.isArray(regData) && regData.length > 0) setRegistration(regData[0]);
      setLoading(false);
    });
  }, []);

  const selectedFee = fees.find(f => f.category === selectedCategory);
  const isEarlyBird = new Date() < new Date("2026-01-15");
  const feeAmount = selectedFee ? (isEarlyBird ? selectedFee.earlyBirdFee : selectedFee.standardFee) : 0;
  const taxAmount = feeAmount * 0.18;
  const totalAmount = feeAmount + taxAmount;

  const handleRegister = async () => {
    setCreating(true);
    setMessage("");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory, attendanceMode: selectedMode, feeAmount, taxAmount }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegistration(data.registration);
        setMessage("Registration created! Proceed to payment.");
      } else {
        setMessage(data.error || "Failed to register");
      }
    } catch {
      setMessage("Network error");
    }
    setCreating(false);
  };

  const handlePayment = async (result: "success" | "fail") => {
    if (!registration) return;
    setPaying(true);
    setMessage("");
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: registration.id, result }),
      });
      const data = await res.json();
      if (res.ok && result === "success") {
        setRegistration({ ...registration, status: "PAID" });
        setMessage("Payment successful! Your registration is confirmed.");
      } else if (result === "fail") {
        setMessage("Payment failed (TEST MODE). Registration not confirmed.");
      } else {
        setMessage("Payment is pending.");
      }
    } catch {
      setMessage("Network error");
    }
    setPaying(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Registration & Payment</h1>
        <p className="text-gray-500 mt-1">Register for the conference and complete payment</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${message.includes("success") || message.includes("confirmed") ? "bg-emerald-50 border-emerald-200 text-emerald-600" : message.includes("fail") || message.includes("error") ? "bg-red-50 border-red-200 text-red-600" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
          {message.includes("success") || message.includes("confirmed") ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message}
        </div>
      )}

      {registration ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Registration</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Registration ID</span><span className="font-mono font-medium text-navy-800">{registration.registrationId}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Category</span><span className="text-navy-800">{registration.category}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Attendance</span><span className="text-navy-800">{registration.attendanceMode}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><Badge status={registration.status}>{registration.status}</Badge></div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Fee Amount</span><span>₹{registration.feeAmount}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tax (18%)</span><span>₹{registration.taxAmount}</span></div>
                <div className="flex justify-between text-sm font-medium"><span className="text-navy-800">Total</span><span className="text-navy-800">₹{registration.totalAmount}</span></div>
              </div>
            </div>

            {registration.status === "PENDING" && (
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge bg-amber-100 text-amber-800">TEST MODE</span>
                  <span className="text-sm text-gray-500">Simulated payment gateway — no real charges</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" loading={paying} onClick={() => handlePayment("success")} className="gap-2"><CheckCircle2 className="h-4 w-4" /> Test Successful Payment</Button>
                  <Button variant="outline" loading={paying} onClick={() => handlePayment("fail")} className="gap-2"><AlertCircle className="h-4 w-4" /> Test Failed Payment</Button>
                </div>
              </div>
            )}
            {registration.status === "PAID" && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">
                <CheckCircle2 className="h-4 w-4" /> Payment confirmed. Your registration is complete.
              </div>
            )}
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Register for Conference</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <Select label="Category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {fees.map(f => <option key={f.category} value={f.category}>{f.category.replace(/_/g, " ")}</option>)}
              </Select>
              <Select label="Attendance Mode" value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
                <option value="IN_PERSON">In-Person</option>
                <option value="VIRTUAL">Virtual</option>
                <option value="HYBRID">Hybrid</option>
              </Select>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Fee ({isEarlyBird ? "Early Bird" : "Standard"})</span><span>₹{feeAmount}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tax (18% GST)</span><span>₹{taxAmount.toFixed(0)}</span></div>
              <div className="flex justify-between font-medium border-t border-gray-200 pt-2"><span className="text-navy-800">Total</span><span className="text-navy-800">₹{totalAmount.toFixed(0)}</span></div>
            </div>

            <Button variant="secondary" className="w-full mt-4" loading={creating} onClick={handleRegister}>Create Registration</Button>
          </CardBody>
        </Card>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Lock className="h-3 w-3" />
        <span>All payments are simulated in TEST MODE. No real charges occur. Do not enter real card details.</span>
      </div>
    </div>
  );
}
