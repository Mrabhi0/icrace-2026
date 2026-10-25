"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Select, Textarea } from "@/components/ui/Input";
import { formatDate } from "@/lib/utils";
import { FileText, Gavel, Users, Send, Star } from "lucide-react";

interface Submission {
  id: string;
  title: string;
  abstractText: string;
  keywords: string | null;
  status: string;
  track: { name: string } | null;
  submittedAt: string | null;
  authors: any[];
  assignments: any[];
  reviews: any[];
  decisions: any[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function CommitteeSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviewers, setReviewers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [assignReviewerId, setAssignReviewerId] = useState("");
  const [decision, setDecision] = useState({ decision: "ACCEPT", comments: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    Promise.all([
      fetch("/api/submissions?all=true").then(r => r.json()),
      fetch("/api/users").then(r => r.json()).catch(() => []),
    ]).then(([subData, userData]) => {
      setSubmissions(Array.isArray(subData) ? subData : []);
      setReviewers(Array.isArray(userData) ? userData.filter((u: any) => u.roles?.includes("REVIEWER")) : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleAssign = async () => {
    if (!selected || !assignReviewerId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: selected.id, userId: assignReviewerId, dueDate: "2026-02-28" }),
      });
      if (res.ok) { setMessage("Reviewer assigned!"); setShowAssign(false); load(); }
      else { const d = await res.json(); setMessage(d.error || "Failed"); }
    } catch { setMessage("Network error"); }
    setSubmitting(false);
  };

  const handleDecision = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: selected.id, ...decision }),
      });
      if (res.ok) { setMessage("Decision recorded!"); setShowDecision(false); load(); }
      else { const d = await res.json(); setMessage(d.error || "Failed"); }
    } catch { setMessage("Network error"); }
    setSubmitting(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">All Submissions</h1>
        <p className="text-gray-500 mt-1">Screen submissions, assign reviewers, and make editorial decisions</p>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>}

      <div className="space-y-3">
        {submissions.map((s) => (
          <Card key={s.id} hover>
            <CardBody>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-navy-800">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.track?.name} · Submitted: {s.submittedAt ? formatDate(s.submittedAt) : "—"}</p>
                </div>
                <Badge status={s.status}>{s.status.replace(/_/g, " ")}</Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{s.abstractText}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.assignments?.length || 0} reviewers</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {s.reviews?.length || 0} reviews</span>
                <Button variant="outline" className="text-xs px-2 py-1" onClick={() => setSelected(s)}>View Details</Button>
                {(s.status === "SUBMITTED" || s.status === "SCREENING") && <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => { setSelected(s); setShowAssign(true); }}>Assign Reviewer</Button>}
                {(s.status === "UNDER_REVIEW" || s.status === "REVISION_REQUESTED") && <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => { setSelected(s); setShowDecision(true); }}>Make Decision</Button>}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Submission Details Modal */}
      <Modal isOpen={!!selected && !showAssign && !showDecision} onClose={() => setSelected(null)} title="Submission Details" size="xl">
        {selected && (
          <div className="space-y-4">
            <div><p className="text-sm font-medium text-gray-500">Title</p><p className="font-semibold text-navy-800">{selected.title}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Status</p><Badge status={selected.status}>{selected.status.replace(/_/g, " ")}</Badge></div>
            <div><p className="text-sm font-medium text-gray-500">Abstract</p><p className="text-sm text-gray-700 mt-1">{selected.abstractText}</p></div>
            {selected.keywords && <div><p className="text-sm font-medium text-gray-500">Keywords</p><p className="text-sm text-gray-700 mt-1">{selected.keywords}</p></div>}
            <div><p className="text-sm font-medium text-gray-500">Authors</p>{selected.authors?.map((a: any, i: number) => <p key={i} className="text-sm text-gray-700">{a.name} ({a.affiliation || "No affiliation"})</p>)}</div>
            {selected.reviews && selected.reviews.length > 0 && (
              <div><p className="text-sm font-medium text-gray-500 mb-2">Reviews</p>
                {selected.reviews.map((r: any, i: number) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3 mb-2">
                    <div className="flex justify-between mb-1"><span className="text-xs font-medium">Score: {r.overallScore}/10</span><Badge status={r.recommendation}>{r.recommendation?.replace(/_/g, " ")}</Badge></div>
                    {r.commentsForAuthor && <p className="text-sm text-gray-600">{r.commentsForAuthor}</p>}
                    {r.confidentialComments && <p className="text-xs text-gray-400 mt-1">Confidential: {r.confidentialComments}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Assign Reviewer Modal */}
      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title="Assign Reviewer" size="md">
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Submission: <span className="font-medium text-navy-800">{selected.title}</span></p>
            <Select label="Select Reviewer" value={assignReviewerId} onChange={(e) => setAssignReviewerId(e.target.value)}>
              <option value="">Choose a reviewer...</option>
              {reviewers.map(r => <option key={r.id} value={r.id}>{r.firstName} {r.lastName} ({r.email})</option>)}
            </Select>
            <Button variant="secondary" className="w-full" loading={submitting} onClick={handleAssign}>Assign Reviewer</Button>
          </div>
        )}
      </Modal>

      {/* Decision Modal */}
      <Modal isOpen={showDecision} onClose={() => setShowDecision(false)} title="Editorial Decision" size="md">
        {selected && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Submission: <span className="font-medium text-navy-800">{selected.title}</span></p>
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">Reviewer recommendations do not automatically determine the final decision. The committee makes the final call.</div>
            <Select label="Decision" value={decision.decision} onChange={(e) => setDecision({ ...decision, decision: e.target.value })}>
              <option value="ACCEPT">Accept</option>
              <option value="REVISION_REQUESTED">Revision Requested</option>
              <option value="REJECT">Reject</option>
            </Select>
            <Textarea label="Comments" rows={3} value={decision.comments} onChange={(e) => setDecision({ ...decision, comments: e.target.value })} />
            <Button variant="secondary" className="w-full" loading={submitting} onClick={handleDecision}>Record Decision</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
