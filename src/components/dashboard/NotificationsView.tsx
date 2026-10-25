"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle, Check } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/notifications").then(r => r.json()).then(data => {
      setNotifications(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markAllRead" }) });
    load();
  };

  const markRead = async (id: string) => {
    await fetch("/api/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "markRead", id }) });
    load();
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Notifications</h1>
          <p className="text-gray-500 mt-1">Your in-app notification center</p>
        </div>
        {notifications.some(n => !n.isRead) && <Button variant="outline" className="gap-2 text-sm" onClick={markAllRead}><Check className="h-4 w-4" /> Mark All Read</Button>}
      </div>

      {notifications.length === 0 ? (
        <Card><CardBody className="text-center py-12"><Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No notifications</p></CardBody></Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = n.type === "SUCCESS" ? CheckCircle2 : n.type === "ERROR" ? AlertCircle : n.type === "WARNING" ? AlertTriangle : Info;
            const color = n.type === "SUCCESS" ? "text-emerald-500" : n.type === "ERROR" ? "text-red-500" : n.type === "WARNING" ? "text-amber-500" : "text-blue-500";
            return (
              <Card key={n.id} className={n.isRead ? "" : "border-l-4 border-l-teal-500"}>
                <CardBody className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-navy-800 ${n.isRead ? "" : "font-bold"}`}>{n.title}</p>
                    <p className="text-sm text-gray-600">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <button onClick={() => markRead(n.id)} className="text-xs text-teal-600 hover:underline">Mark read</button>}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
