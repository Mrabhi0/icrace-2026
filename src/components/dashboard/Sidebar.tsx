"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, FileText, CreditCard, Award,
  Users, Settings, DollarSign, Calendar, QrCode, Megaphone,
  ClipboardList, Shield, ChevronLeft, ChevronRight, Bell,
  LogOut, Menu, X, Briefcase, BookOpen, ScrollText, FileCheck,
  Mail, BarChart3, Download
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

const navConfigs: Record<string, NavSection[]> = {
  PARTICIPANT: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard/participant", icon: LayoutDashboard },
        { label: "My Profile", href: "/dashboard/participant/profile", icon: User },
        { label: "Registration", href: "/dashboard/participant/registration", icon: CreditCard },
        { label: "My Submissions", href: "/dashboard/participant/submissions", icon: FileText },
        { label: "Certificates", href: "/dashboard/participant/certificates", icon: Award },
      ],
    },
    {
      title: "Info",
      items: [
        { label: "Announcements", href: "/dashboard/participant/announcements", icon: Megaphone },
        { label: "Notifications", href: "/dashboard/participant/notifications", icon: Bell },
      ],
    },
  ],
  REVIEWER: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard/reviewer", icon: LayoutDashboard },
        { label: "My Profile", href: "/dashboard/reviewer/profile", icon: User },
        { label: "Assigned Papers", href: "/dashboard/reviewer/assignments", icon: ClipboardList },
        { label: "Review History", href: "/dashboard/reviewer/history", icon: ScrollText },
      ],
    },
    {
      title: "Info",
      items: [
        { label: "Notifications", href: "/dashboard/reviewer/notifications", icon: Bell },
      ],
    },
  ],
  COMMITTEE_MEMBER: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard/committee", icon: LayoutDashboard },
        { label: "Submissions", href: "/dashboard/committee/submissions", icon: FileText },
        { label: "Screening", href: "/dashboard/committee/screening", icon: ClipboardList },
        { label: "Assignments", href: "/dashboard/committee/assignments", icon: BookOpen },
        { label: "Decisions", href: "/dashboard/committee/decisions", icon: FileCheck },
      ],
    },
    {
      title: "Info",
      items: [
        { label: "Notifications", href: "/dashboard/committee/notifications", icon: Bell },
      ],
    },
  ],
  FINANCE_MANAGER: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard/finance", icon: LayoutDashboard },
        { label: "Transactions", href: "/dashboard/finance/transactions", icon: DollarSign },
        { label: "Registrations", href: "/dashboard/finance/registrations", icon: CreditCard },
        { label: "Fee Engine", href: "/dashboard/finance/fees", icon: Settings },
        { label: "Refunds", href: "/dashboard/finance/refunds", icon: ScrollText },
        { label: "Reports", href: "/dashboard/finance/reports", icon: Download },
      ],
    },
  ],
  OPERATIONS_MANAGER: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard/operations", icon: LayoutDashboard },
        { label: "Programme", href: "/dashboard/operations/programme", icon: Calendar },
        { label: "Attendance", href: "/dashboard/operations/attendance", icon: QrCode },
        { label: "Speakers", href: "/dashboard/operations/speakers", icon: Briefcase },
        { label: "Volunteers", href: "/dashboard/operations/volunteers", icon: Users },
        { label: "Announcements", href: "/dashboard/operations/announcements", icon: Megaphone },
      ],
    },
  ],
  SUPER_ADMIN: [
    {
      title: "Main",
      items: [
        { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { label: "Users", href: "/dashboard/admin/users", icon: Users },
        { label: "Submissions", href: "/dashboard/admin/submissions", icon: FileText },
        { label: "Payments", href: "/dashboard/admin/payments", icon: DollarSign },
        { label: "Certificates", href: "/dashboard/admin/certificates", icon: Award },
      ],
    },
    {
      title: "Configuration",
      items: [
        { label: "Conference Settings", href: "/dashboard/admin/conference", icon: Settings },
        { label: "Fee Rules", href: "/dashboard/admin/fees", icon: CreditCard },
        { label: "Tracks", href: "/dashboard/admin/tracks", icon: BookOpen },
        { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
        { label: "Email Templates", href: "/dashboard/admin/email-templates", icon: Mail },
        { label: "Audit Logs", href: "/dashboard/admin/audit-logs", icon: Shield },
        { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
      ],
    },
  ],
};

function getRoleFromPath(pathname: string): string {
  if (pathname.includes("/dashboard/participant")) return "PARTICIPANT";
  if (pathname.includes("/dashboard/reviewer")) return "REVIEWER";
  if (pathname.includes("/dashboard/committee")) return "COMMITTEE_MEMBER";
  if (pathname.includes("/dashboard/finance")) return "FINANCE_MANAGER";
  if (pathname.includes("/dashboard/operations")) return "OPERATIONS_MANAGER";
  if (pathname.includes("/dashboard/admin")) return "SUPER_ADMIN";
  return "PARTICIPANT";
}

export function getDashboardPath(roles: string[]): string {
  if (roles.includes("SUPER_ADMIN")) return "/dashboard/admin";
  if (roles.includes("FINANCE_MANAGER")) return "/dashboard/finance";
  if (roles.includes("OPERATIONS_MANAGER")) return "/dashboard/operations";
  if (roles.includes("COMMITTEE_MEMBER")) return "/dashboard/committee";
  if (roles.includes("REVIEWER")) return "/dashboard/reviewer";
  if (roles.includes("PARTICIPANT")) return "/dashboard/participant";
  return "/login";
}

export function Sidebar({
  userRoles,
  userName,
  userEmail,
}: {
  userRoles: string[];
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleKey = getRoleFromPath(pathname);
  const navSections = navConfigs[roleKey] || navConfigs.PARTICIPANT;

  const dashboardBase = `/dashboard/${roleKey.toLowerCase().replace("_", "")}`;
  const actualBase = roleKey === "PARTICIPANT" ? "/dashboard/participant"
    : roleKey === "REVIEWER" ? "/dashboard/reviewer"
    : roleKey === "COMMITTEE_MEMBER" ? "/dashboard/committee"
    : roleKey === "FINANCE_MANAGER" ? "/dashboard/finance"
    : roleKey === "OPERATIONS_MANAGER" ? "/dashboard/operations"
    : "/dashboard/admin";

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 rounded-lg bg-navy-800 p-2 text-white shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen flex flex-col bg-navy-900 text-gray-300 transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 flex-shrink-0">
              <span className="text-sm font-bold text-white">IC</span>
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-bold text-white leading-tight">ICRACE 2026</p>
                <p className="text-xs text-gray-400 leading-tight">Portal</p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/20">
              <span className="text-sm font-bold text-teal-300">
                {userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navSections.map((section) => (
            <div key={section.title} className="mb-4">
              {!collapsed && (
                <p className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5 px-2">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== actualBase && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                        isActive
                          ? "bg-teal-500/20 text-teal-300"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      )}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Role badges + logout */}
        <div className="border-t border-white/10 p-3 space-y-2">
          {!collapsed && userRoles.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {userRoles.map((role) => (
                <span key={role} className="badge bg-white/10 text-gray-300 text-xs">
                  {role.replace("_", " ")}
                </span>
              ))}
            </div>
          )}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-400 w-full",
                collapsed && "justify-center"
              )}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
