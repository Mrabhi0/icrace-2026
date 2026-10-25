import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-full bg-red-100">
          <ShieldX className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-navy-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          You do not have permission to access this page. Please contact the administrator if you believe this is an error.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
          <Link href="/login">
            <Button variant="primary">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
