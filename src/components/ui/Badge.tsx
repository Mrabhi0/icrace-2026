import { cn } from "@/lib/utils";
import { statusColor } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  status?: string;
  className?: string;
}

export function Badge({ children, status, className }: BadgeProps) {
  if (status) {
    return (
      <span className={cn("badge", statusColor(status), className)}>
        {children}
      </span>
    );
  }
  return (
    <span className={cn("badge bg-gray-100 text-gray-700", className)}>
      {children}
    </span>
  );
}
