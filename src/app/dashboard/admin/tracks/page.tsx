"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Plus, BookOpen } from "lucide-react";

export default function AdminTracks() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", topics: "", guidelines: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => { fetch("/api/tracks").then(r => r.json()).then(data => { setTracks(Array.isArray(data) ? data : []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/tracks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setMessage("Track created!"); setShowForm(false); setForm({ name: "", description: "", topics: "", guidelines: "" }); load(); }
    } catch { setMessage("Failed"); }
    setSubmitting(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-navy-800">Research Tracks</h1><p className="text-gray-500 mt-1">Manage conference tracks</p></div>
        <Button variant="secondary" className="gap-2" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> New Track</Button>
      </div>
      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>}
      <div className="grid sm:grid-cols-2 gap-4">
        {tracks.map((t) => (
          <Card key={t.id} hover><CardBody>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-teal-500" /><h3 className="font-semibold text-navy-800">{t.name}</h3></div>
              <Badge status={t.isActive ? "PAID" : "FAILED"}>{t.isActive ? "Active" : "Inactive"}</Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{t.description}</p>
            {t.topics && <p className="text-xs text-gray-400">Topics: {t.topics}</p>}
          </CardBody></Card>
        ))}
      </div>
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Track" size="md">
        <div className="space-y-4">
          <Input label="Track Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Textarea label="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Input label="Topics (comma-separated)" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} />
          <Textarea label="Guidelines" rows={2} value={form.guidelines} onChange={(e) => setForm({ ...form, guidelines: e.target.value })} />
          <Button variant="secondary" className="w-full" loading={submitting} onClick={handleCreate}>Create Track</Button>
        </div>
      </Modal>
    </div>
  );
}
