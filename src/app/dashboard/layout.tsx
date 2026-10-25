import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        userRoles={user.roles}
        userName={fullName}
        userEmail={user.email}
      />
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="lg:ml-0 ml-12">
              <h1 className="text-sm font-semibold text-navy-800">
                ICRACE 2026 Conference Portal
              </h1>
              <p className="text-xs text-gray-500">
                {user.roles.join(" • ")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-gray-500">
                {fullName}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-sm font-bold text-navy-800">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
