"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Settings, Save } from "lucide-react";

export default function ConferenceSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/conference-settings").then(r => r.json()).then(data => { setSettings(data || {}); setLoading(false); });
  }, []);

  const update = (key: string, value: string) => setSettings({ ...settings, [key]: value });

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/conference-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      setMessage("Settings saved!");
    } catch { setMessage("Failed"); }
    setSaving(false);
  };

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-navy-800">Conference Configuration</h1><p className="text-gray-500 mt-1">Edit conference name, branding, dates, and venue</p></div>
      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>}
      <Card>
        <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Input label="Conference Name" value={settings["conference.name"] || ""} onChange={(e) => update("conference.name", e.target.value)} />
            <Input label="Full Name" value={settings["conference.fullName"] || ""} onChange={(e) => update("conference.fullName", e.target.value)} />
            <Input label="Theme" value={settings["conference.theme"] || ""} onChange={(e) => update("conference.theme", e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Start Date" type="date" value={settings["conference.startDate"] || ""} onChange={(e) => update("conference.startDate", e.target.value)} />
              <Input label="End Date" type="date" value={settings["conference.endDate"] || ""} onChange={(e) => update("conference.endDate", e.target.value)} />
            </div>
            <Input label="Venue" value={settings["conference.venue"] || ""} onChange={(e) => update("conference.venue", e.target.value)} />
            <Input label="Organiser" value={settings["conference.organiser"] || ""} onChange={(e) => update("conference.organiser", e.target.value)} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Contact Email" value={settings["conference.contactEmail"] || ""} onChange={(e) => update("conference.contactEmail", e.target.value)} />
              <Input label="Contact Phone" value={settings["conference.contactPhone"] || ""} onChange={(e) => update("conference.contactPhone", e.target.value)} />
            </div>
            <Input label="Currency" value={settings["conference.currency"] || ""} onChange={(e) => update("conference.currency", e.target.value)} />
            <Button variant="secondary" className="gap-2" loading={saving} onClick={save}><Save className="h-4 w-4" /> Save Settings</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
