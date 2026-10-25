"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Megaphone } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function ParticipantAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements").then(r => r.json()).then(data => { setAnnouncements(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-navy-800">Announcements</h1><p className="text-gray-500 mt-1">Latest updates from the organising committee</p></div>
      {announcements.length === 0 ? (
        <Card><CardBody className="text-center py-12"><Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No announcements yet</p></CardBody></Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <Card key={a.id} hover><CardBody>
              <h3 className="font-semibold text-navy-800 mb-1">{a.title}</h3>
              <p className="text-sm text-gray-600">{a.content}</p>
              <p className="text-xs text-gray-400 mt-2">{a.publishedAt ? formatDateTime(a.publishedAt) : "—"}</p>
            </CardBody></Card>
          ))}
        </div>
      )}
    </div>
  );
}
