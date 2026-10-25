"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { FileText, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

interface Submission {
  id: string;
  title: string;
  abstractText: string;
  keywords: string | null;
  status: string;
  track: { name: string } | null;
  submittedAt: string | null;
  reviews: any[];
  decisions: any[];
}

export default function ParticipantSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [tracks, setTracks] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [form, setForm] = useState({ title: "", abstractText: "", keywords: "", trackId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const loadData = () => {
    Promise.all([
      fetch("/api/submissions").then(r => r.json()),
      fetch("/api/tracks").then(r => r.json()),
    ]).then(([subData, trackData]) => {
      setSubmissions(Array.isArray(subData) ? subData : []);
      setTracks(trackData);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setShowForm(false);
        setForm({ title: "", abstractText: "", keywords: "", trackId: "" });
        setMessage("Abstract submitted successfully!");
        loadData();
      } else {
        setMessage(data.error || "Failed to submit");
      }
    } catch {
      setMessage("Network error");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">My Submissions</h1>
          <p className="text-gray-500 mt-1">Submit and track your abstracts</p>
        </div>
        <Button variant="secondary" onClick={() => setShowForm(true)} className="gap-2"><Plus className="h-4 w-4" /> New Submission</Button>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${message.includes("success") ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-red-50 border-red-200 text-red-600"}`}>
          {message.includes("success") ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {message}
        </div>
      )}

      {submissions.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No submissions yet</p>
            <Button variant="secondary" onClick={() => setShowForm(true)}>Submit Your First Abstract</Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <Card key={s.id} hover>
              <CardBody>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy-800">{s.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{s.track?.name || "No track assigned"}</p>
                  </div>
                  <Badge status={s.status}>{s.status.replace(/_/g, " ")}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{s.abstractText}</p>
                {s.keywords && <p className="text-xs text-gray-400 mb-3">Keywords: {s.keywords}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>Submitted: {s.submittedAt ? new Date(s.submittedAt).toLocaleDateString() : "—"}</span>
                  <span>Reviews: {s.reviews?.length || 0}</span>
                  <Button variant="outline" className="text-xs px-2 py-1" onClick={() => setSelected(s)}>View Details</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* New Submission Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Submit Abstract" size="lg">
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Paper title" />
          <Select label="Track" value={form.trackId} onChange={(e) => setForm({ ...form, trackId: e.target.value })}>
            <option value="">Select a track</option>
            {tracks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
          <Textarea label="Abstract" rows={6} value={form.abstractText} onChange={(e) => setForm({ ...form, abstractText: e.target.value })} placeholder="Abstract (max 250 words)" />
          <Input label="Keywords" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="Comma-separated keywords" />
          <Button variant="secondary" className="w-full" loading={submitting} onClick={handleSubmit}>Submit Abstract</Button>
        </div>
      </Modal>

      {/* Submission Details Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Submission Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Title</p>
              <p className="font-semibold text-navy-800">{selected.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Badge status={selected.status}>{selected.status.replace(/_/g, " ")}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Abstract</p>
              <p className="text-sm text-gray-700 mt-1">{selected.abstractText}</p>
            </div>
            {selected.keywords && (
              <div>
                <p className="text-sm font-medium text-gray-500">Keywords</p>
                <p className="text-sm text-gray-700 mt-1">{selected.keywords}</p>
              </div>
            )}
            {selected.reviews && selected.reviews.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Reviewer Feedback</p>
                {selected.reviews.map((r: any, i: number) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3 mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-navy-700">Overall Score: {r.overallScore}/10</span>
                      <Badge status={r.recommendation}>{r.recommendation?.replace(/_/g, " ")}</Badge>
                    </div>
                    {r.commentsForAuthor && <p className="text-sm text-gray-600">{r.commentsForAuthor}</p>}
                    {r.requiredRevisions && <p className="text-xs text-gray-500 mt-1">Required revisions: {r.requiredRevisions}</p>}
                  </div>
                ))}
              </div>
            )}
            {selected.decisions && selected.decisions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Editorial Decision</p>
                {selected.decisions.map((d: any, i: number) => (
                  <div key={i} className="rounded-lg bg-navy-50 p-3">
                    <div className="flex justify-between mb-1">
                      <Badge status={d.decision}>{d.decision.replace(/_/g, " ")}</Badge>
                      <span className="text-xs text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{d.comments || "No additional comments"}</p>
                    <p className="text-xs text-gray-400 mt-1">By: {d.decidedByName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
