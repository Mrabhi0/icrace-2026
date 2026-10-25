"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { Plus, Megaphone } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", isPublished: true });
  const [submitting, setSubmitting] = useState(false);

  const load = () => { fetch("/api/announcements").then(r => r.json()).then(data => { setAnnouncements(Array.isArray(data) ? data : []); setLoading(false); }); };
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { setShowForm(false); setForm({ title: "", content: "", isPublished: true }); load(); }
    } catch {}
    setSubmitting(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-navy-800">Announcements</h1><p className="text-gray-500 mt-1">Manage conference announcements</p></div>
        <Button variant="secondary" className="gap-2" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> New</Button>
      </div>
      {announcements.length === 0 ? (
        <Card><CardBody className="text-center py-12"><Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No announcements</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id} hover><CardBody>
              <div className="flex items-start justify-between gap-4 mb-1"><h3 className="font-semibold text-navy-800">{a.title}</h3><Badge status={a.isPublished ? "PAID" : "FAILED"}>{a.isPublished ? "Published" : "Draft"}</Badge></div>
              <p className="text-sm text-gray-600">{a.content}</p>
              <p className="text-xs text-gray-400 mt-2">{a.publishedAt ? formatDateTime(a.publishedAt) : "—"}</p>
            </CardBody></Card>
          ))}
        </div>
      )}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Announcement" size="md">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea label="Content" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Publish immediately</label>
          <Button variant="secondary" className="w-full" loading={submitting} onClick={handleCreate}>Create</Button>
        </div>
      </Modal>
    </div>
  );
}
