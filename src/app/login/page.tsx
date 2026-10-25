"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { getDashboardPath } from "@/components/dashboard/Sidebar";
import { Eye, EyeOff, AlertCircle, GraduationCap } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (redirect) {
        router.push(redirect);
      } else {
        router.push(getDashboardPath(data.user.roles));
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo@1234");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-50 via-white to-teal-50 p-4">
      <div className="w-full max-w-md">
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
            <CardTitle>Sign In to Your Account</CardTitle>
          </CardHeader>
          <CardBody>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.edu"
                required
                id="email"
              />
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  id="password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Sign In
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-gray-500">Don&apos;t have an account? </span>
              <Link href="/register" className="font-medium text-royal-600 hover:text-royal-700">
                Register here
              </Link>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-500 mb-2 text-center">Quick Demo Login (Password: Demo@1234)</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { email: "admin@icrace2026.edu", label: "Admin" },
                  { email: "finance@icrace2026.edu", label: "Finance" },
                  { email: "reviewer@icrace2026.edu", label: "Reviewer" },
                  { email: "committee@icrace2026.edu", label: "Committee" },
                  { email: "operations@icrace2026.edu", label: "Operations" },
                  { email: "participant@icrace2026.edu", label: "Participant" },
                ].map((demo) => (
                  <button
                    key={demo.email}
                    onClick={() => fillDemo(demo.email)}
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-600 hover:border-royal-300 hover:bg-royal-50 transition"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        <p className="mt-4 text-center text-xs text-gray-400">
          Prototype Demo — All data is sample content
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
