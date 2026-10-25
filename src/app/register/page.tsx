"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getDashboardPath } from "@/components/dashboard/Sidebar";
import { AlertCircle, GraduationCap, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    institution: "",
    department: "",
    category: "FACULTY",
    attendanceMode: "IN_PERSON",
  });

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone,
          institution: form.institution,
          department: form.department,
          category: form.category,
          attendanceMode: form.attendanceMode,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push(getDashboardPath(data.user.roles));
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-teal-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-lg font-bold text-navy-800">ICRACE 2026</p>
              <p className="text-xs text-gray-500">Conference Portal</p>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-navy-700" />
              <CardTitle>Create Your Account</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required id="firstName" />
                <Input label="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required id="lastName" />
              </div>
              <Input label="Email Address" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required id="email" placeholder="you@example.edu" />
              <Input label="Phone (Optional)" value={form.phone} onChange={(e) => update("phone", e.target.value)} id="phone" placeholder="+91 00000 00000" />
              <Input label="Institution / Organization" value={form.institution} onChange={(e) => update("institution", e.target.value)} id="institution" placeholder="Your university or company" />
              <Input label="Department" value={form.department} onChange={(e) => update("department", e.target.value)} id="department" placeholder="Department of ..." />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Participant Category" value={form.category} onChange={(e) => update("category", e.target.value)} id="category">
                  <option value="UNDERGRADUATE">Undergraduate Student</option>
                  <option value="POSTGRADUATE">Postgraduate / Research Scholar</option>
                  <option value="FACULTY">Faculty / Academician</option>
                  <option value="INDUSTRY">Industry Professional</option>
                  <option value="INTERNATIONAL">International Participant</option>
                  <option value="VIRTUAL">Virtual Participant</option>
                  <option value="INVITED_SPEAKER">Invited Speaker</option>
                </Select>
                <Select label="Attendance Mode" value={form.attendanceMode} onChange={(e) => update("attendanceMode", e.target.value)} id="attendanceMode">
                  <option value="IN_PERSON">In-Person</option>
                  <option value="VIRTUAL">Virtual</option>
                  <option value="HYBRID">Hybrid</option>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required id="password" hint="Min. 8 characters" />
                <Input label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required id="confirmPassword" />
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Create Account
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link href="/login" className="font-medium text-royal-600 hover:text-royal-700">
                Sign in here
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
