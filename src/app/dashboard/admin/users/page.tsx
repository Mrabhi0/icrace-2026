"use client";

import { useState, useEffect } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { formatDate } from "@/lib/utils";
import { UserCog, Ban, CheckCircle2, Shield } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
  isSuspended: boolean;
  roles: string[];
  institution: string | null;
  category: string | null;
  createdAt: string;
}

const allRoles = ["PARTICIPANT", "REVIEWER", "COMMITTEE_MEMBER", "FINANCE_MANAGER", "OPERATIONS_MANAGER", "SUPER_ADMIN"];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/users").then(r => r.json()).then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (userId: string, action: string) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      if (res.ok) { setMessage(`User ${action}d`); load(); }
    } catch { setMessage("Network error"); }
  };

  const handleUpdateRoles = async () => {
    if (!selected) return;
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selected.id, action: "updateRoles", roles: editRoles }),
      });
      if (res.ok) { setMessage("Roles updated"); setShowRoles(false); load(); }
    } catch { setMessage("Network error"); }
  };

  const columns: Column<User>[] = [
    { key: "name", header: "Name", sortable: true, render: (u) => `${u.firstName} ${u.lastName}` },
    { key: "email", header: "Email", sortable: true },
    { key: "roles", header: "Roles", render: (u) => <div className="flex flex-wrap gap-1">{u.roles.map(r => <span key={r} className="badge bg-navy-50 text-navy-700 text-xs">{r.replace(/_/g, " ")}</span>)}</div> },
    { key: "institution", header: "Institution", render: (u) => u.institution || "—" },
    { key: "status", header: "Status", sortable: true, render: (u) => u.isSuspended ? <Badge status="FAILED">Suspended</Badge> : <Badge status="PAID">Active</Badge> },
    { key: "actions", header: "Actions", render: (u) => (
      <div className="flex gap-1">
        <Button variant="ghost" className="text-xs px-2 py-1" onClick={() => { setSelected(u); setEditRoles(u.roles); setShowRoles(true); }}><UserCog className="h-3 w-3" /></Button>
        {u.isSuspended ? <Button variant="ghost" className="text-xs px-2 py-1 text-emerald-600" onClick={() => handleAction(u.id, "reactivate")}><CheckCircle2 className="h-3 w-3" /></Button>
        : <Button variant="ghost" className="text-xs px-2 py-1 text-red-600" onClick={() => handleAction(u.id, "suspend")}><Ban className="h-3 w-3" /></Button>}
      </div>
    )},
  ];

  if (loading) return <div className="animate-pulse text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">User Management</h1>
        <p className="text-gray-500 mt-1">Manage user accounts, roles, and permissions</p>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-600">{message}</div>}

      <DataTable columns={columns} data={users} searchKeys={["email", "firstName", "lastName"]} searchPlaceholder="Search users..." pageSize={10} />

      <Modal isOpen={showRoles} onClose={() => setShowRoles(false)} title={`Edit Roles — ${selected?.firstName} ${selected?.lastName}`} size="md">
        <div className="space-y-4">
          <div className="space-y-2">
            {allRoles.map(role => (
              <label key={role} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editRoles.includes(role)} onChange={(e) => { if (e.target.checked) setEditRoles([...editRoles, role]); else setEditRoles(editRoles.filter(r => r !== role)); }} className="rounded" />
                <span className="text-sm">{role.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
          <Button variant="secondary" className="w-full" onClick={handleUpdateRoles}>Update Roles</Button>
        </div>
      </Modal>
    </div>
  );
}
