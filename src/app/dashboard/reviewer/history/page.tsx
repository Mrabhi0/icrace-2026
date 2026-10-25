"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ScrollText, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ReviewHistory() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews").then(r => r.json()).then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Review History</h1>
        <p className="text-gray-500 mt-1">All reviews you have submitted</p>
      </div>
      {reviews.length === 0 ? (
        <Card><CardBody className="text-center py-12"><ScrollText className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No reviews submitted yet</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id} hover>
              <CardBody>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div><p className="font-medium text-navy-800">{r.submission?.title}</p><p className="text-sm text-gray-500">{r.submission?.track?.name}</p></div>
                  <Badge status={r.recommendation}>{r.recommendation?.replace(/_/g, " ")}</Badge>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-teal-500" /> Overall: {r.overallScore}/10</span>
                  <span>Submitted: {r.submittedAt ? formatDate(r.submittedAt) : "—"}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
