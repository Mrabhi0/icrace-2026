"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { ClipboardList, Star, Send } from "lucide-react";

interface Assignment {
  id: string;
  status: string;
  dueDate: string | null;
  submission: { id: string; title: string; abstractText: string; keywords: string | null; track: { name: string } | null };
  review: any | null;
}

export default function ReviewerAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState({ relevance: 7, originality: 7, methodology: 7, clarity: 7, technicalQuality: 7, overallScore: 7, strengths: "", weaknesses: "", requiredRevisions: "", confidentialComments: "", commentsForAuthor: "", recommendation: "MINOR_REVISION" });

  const load = () => {
    fetch("/api/assignments").then(r => r.json()).then(data => {
      setAssignments(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSubmitReview = async () => {
    if (!selected) return;
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: selected.id, submissionId: selected.submission.id, ...review }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Review submitted successfully!");
        setShowReviewForm(false);
        setSelected(null);
        load();
      } else {
        setMessage(data.error || "Failed to submit review");
      }
    } catch {
      setMessage("Network error");
    }
    setSubmitting(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Assigned Submissions</h1>
        <p className="text-gray-500 mt-1">Review papers assigned to you</p>
      </div>

      {message && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>
      )}

      {assignments.length === 0 ? (
        <Card><CardBody className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No assignments yet</p>
        </CardBody></Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => (
            <Card key={a.id} hover>
              <CardBody>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-navy-800">{a.submission.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{a.submission.track?.name || "No track"}</p>
                  </div>
                  <Badge status={a.status}>{a.status.replace(/_/g, " ")}</Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{a.submission.abstractText}</p>
                {a.submission.keywords && <p className="text-xs text-gray-400 mb-3">Keywords: {a.submission.keywords}</p>}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {a.dueDate && <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>}
                  {a.status === "COMPLETED" && a.review && (
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-teal-500" /> Score: {a.review.overallScore}/10</span>
                  )}
                  {(a.status === "ASSIGNED" || a.status === "IN_PROGRESS") && (
                    <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => { setSelected(a); setShowReviewForm(true); }}>
                      <Send className="h-3 w-3 mr-1" /> Start Review
                    </Button>
                  )}
                  <Button variant="outline" className="text-xs px-3 py-1" onClick={() => setSelected(a)}>View Abstract</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Abstract View Modal */}
      <Modal isOpen={!!selected && !showReviewForm} onClose={() => setSelected(null)} title="Submission Abstract" size="lg">
        {selected && (
          <div className="space-y-4">
            <div><p className="text-sm font-medium text-gray-500">Title</p><p className="font-semibold text-navy-800">{selected.submission.title}</p></div>
            <div><p className="text-sm font-medium text-gray-500">Abstract</p><p className="text-sm text-gray-700 mt-1">{selected.submission.abstractText}</p></div>
            {selected.submission.keywords && <div><p className="text-sm font-medium text-gray-500">Keywords</p><p className="text-sm text-gray-700 mt-1">{selected.submission.keywords}</p></div>}
            {selected.review && (
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-500 mb-2">Your Review</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[["Relevance", selected.review.relevance], ["Originality", selected.review.originality], ["Methodology", selected.review.methodology], ["Clarity", selected.review.clarity], ["Technical", selected.review.technicalQuality], ["Overall", selected.review.overallScore]].map(([label, val]) => (
                    <div key={label as string} className="text-center"><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-bold text-navy-800">{val}/10</p></div>
                  ))}
                </div>
                <p className="text-xs"><Badge status={selected.review.recommendation}>{selected.review.recommendation?.replace(/_/g, " ")}</Badge></p>
              </div>
            )}
            {(selected.status === "ASSIGNED" || selected.status === "IN_PROGRESS") && (
              <Button variant="secondary" className="w-full" onClick={() => setShowReviewForm(true)}>Write Review</Button>
            )}
          </div>
        )}
      </Modal>

      {/* Review Form Modal */}
      <Modal isOpen={showReviewForm} onClose={() => setShowReviewForm(false)} title="Review Form" size="xl">
        {selected && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-semibold text-navy-800 text-sm">{selected.submission.title}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[["relevance", "Relevance"], ["originality", "Originality"], ["methodology", "Methodology"], ["clarity", "Clarity"], ["technicalQuality", "Technical Quality"], ["overallScore", "Overall Score"]].map(([key, label]) => (
                <div key={key}>
                  <label className="label">{label} (1-10)</label>
                  <input type="number" min={1} max={10} value={(review as any)[key]} onChange={(e) => setReview({ ...review, [key]: parseInt(e.target.value) })} className="input" />
                </div>
              ))}
            </div>
            <Textarea label="Strengths" rows={2} value={review.strengths} onChange={(e) => setReview({ ...review, strengths: e.target.value })} />
            <Textarea label="Weaknesses" rows={2} value={review.weaknesses} onChange={(e) => setReview({ ...review, weaknesses: e.target.value })} />
            <Textarea label="Required Revisions" rows={2} value={review.requiredRevisions} onChange={(e) => setReview({ ...review, requiredRevisions: e.target.value })} />
            <Textarea label="Comments for Author" rows={2} value={review.commentsForAuthor} onChange={(e) => setReview({ ...review, commentsForAuthor: e.target.value })} />
            <Textarea label="Confidential Comments (Committee Only)" rows={2} value={review.confidentialComments} onChange={(e) => setReview({ ...review, confidentialComments: e.target.value })} />
            <Select label="Recommendation" value={review.recommendation} onChange={(e) => setReview({ ...review, recommendation: e.target.value })}>
              <option value="ACCEPT">Accept</option>
              <option value="MINOR_REVISION">Minor Revision</option>
              <option value="MAJOR_REVISION">Major Revision</option>
              <option value="REJECT">Reject</option>
            </Select>
            <Button variant="secondary" className="w-full" loading={submitting} onClick={handleSubmitReview}>Submit Review</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
