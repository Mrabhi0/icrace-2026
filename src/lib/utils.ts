import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateRegistrationId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `REG-${year}-${random}`;
}

export function generateTransactionRef(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `TXN-${timestamp}-${random}`.toUpperCase();
}

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `CERT-${year}-${random}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    PAID: "bg-emerald-100 text-emerald-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-purple-100 text-purple-800",
    EXEMPT: "bg-teal-100 text-teal-800",
    DRAFT: "bg-gray-100 text-gray-700",
    SUBMITTED: "bg-blue-100 text-blue-800",
    SCREENING: "bg-cyan-100 text-cyan-800",
    UNDER_REVIEW: "bg-indigo-100 text-indigo-800",
    REVISION_REQUESTED: "bg-orange-100 text-orange-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAWN: "bg-gray-200 text-gray-600",
    SUCCESS: "bg-emerald-100 text-emerald-800",
    REQUESTED: "bg-amber-100 text-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED_REFUND: "bg-red-100 text-red-800",
    PROCESSED: "bg-teal-100 text-teal-800",
    ASSIGNED: "bg-blue-100 text-blue-800",
    ACCEPTED_REVIEW: "bg-emerald-100 text-emerald-800",
    DECLINED: "bg-red-100 text-red-800",
    IN_PROGRESS: "bg-amber-100 text-amber-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    NOT_CHECKED_IN: "bg-gray-100 text-gray-700",
    CHECKED_IN: "bg-emerald-100 text-emerald-800",
    CHECKED_OUT: "bg-amber-100 text-amber-800",
    ELIGIBLE: "bg-emerald-100 text-emerald-800",
    ISSUED: "bg-teal-100 text-teal-800",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export function getDaysUntil(targetDate: string | Date): number {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
