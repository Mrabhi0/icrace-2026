"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";

export default function ParticipantProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", institution: "", department: "", designation: "", city: "", country: "", bio: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(data => {
      setProfile(data);
      setForm({
        firstName: data.firstName || "", lastName: data.lastName || "", phone: data.phone || "",
        institution: data.participant?.institution || "", department: data.participant?.department || "",
        designation: data.participant?.designation || "", city: data.participant?.city || "",
        country: data.participant?.country || "", bio: data.participant?.bio || "",
      });
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setMessage("Profile updated!"); setEditing(false); }
    } catch { setMessage("Network error"); }
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">My Profile</h1>
        <p className="text-gray-500 mt-1">Your personal and institutional information</p>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button variant="outline" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
          </div>
        </CardHeader>
        <CardBody>
          {editing ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
                <Input label="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
                <Input label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                <Input label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
              </div>
              <Textarea label="Bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
              <Button variant="secondary" onClick={handleSave}>Save Changes</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div><p className="text-sm text-gray-500">Name</p><p className="text-navy-800">{profile?.firstName} {profile?.lastName}</p></div>
                <div><p className="text-sm text-gray-500">Email</p><p className="text-navy-800">{profile?.email}</p></div>
                <div><p className="text-sm text-gray-500">Phone</p><p className="text-navy-800">{profile?.phone || "—"}</p></div>
                <div><p className="text-sm text-gray-500">Institution</p><p className="text-navy-800">{profile?.participant?.institution || "—"}</p></div>
                <div><p className="text-sm text-gray-500">Department</p><p className="text-navy-800">{profile?.participant?.department || "—"}</p></div>
                <div><p className="text-sm text-gray-500">Designation</p><p className="text-navy-800">{profile?.participant?.designation || "—"}</p></div>
                <div><p className="text-sm text-gray-500">City</p><p className="text-navy-800">{profile?.participant?.city || "—"}</p></div>
                <div><p className="text-sm text-gray-500">Country</p><p className="text-navy-800">{profile?.participant?.country || "—"}</p></div>
              </div>
              <div className="flex gap-2 pt-2">
                {profile?.roles?.map((r: string) => <Badge key={r} className="bg-navy-50 text-navy-700">{r.replace(/_/g, " ")}</Badge>)}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
