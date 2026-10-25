import { cn } from "@/lib/utils";
import { Card, CardBody } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: typeof import("lucide-react").Users;
  color?: "navy" | "teal" | "royal" | "amber" | "emerald" | "red";
}

const colorClasses = {
  navy: "bg-navy-50 text-navy-700",
  teal: "bg-teal-50 text-teal-700",
  royal: "bg-royal-50 text-royal-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
};

export function StatCard({ label, value, icon: Icon, color = "navy" }: StatCardProps) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-2xl font-bold text-navy-800">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardBody>
    </Card>
  );
}
