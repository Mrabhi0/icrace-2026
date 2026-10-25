import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

const PROTECTED_ROUTES = ["/dashboard"];
const PUBLIC_ROUTES = ["/", "/about", "/tracks", "/important-dates", "/registration", "/call-for-papers", "/programme", "/contact", "/login", "/register", "/forgot-password", "/reset-password", "/access-denied"];

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string; roles: string[] };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("conf_session")?.value;
  const session = token ? await verifyToken(token) : null;

  // Redirect logged-in users away from login/register
  if (session && (pathname === "/login" || pathname === "/register")) {
    const dashboard = getDashboardPath(session.roles);
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route protection
    const routeRole = getRouteRole(pathname);
    if (routeRole && !session.roles.includes(routeRole) && !session.roles.includes("SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  return NextResponse.next();
}

function getRouteRole(pathname: string): string | null {
  if (pathname.startsWith("/dashboard/participant")) return "PARTICIPANT";
  if (pathname.startsWith("/dashboard/reviewer")) return "REVIEWER";
  if (pathname.startsWith("/dashboard/committee")) return "COMMITTEE_MEMBER";
  if (pathname.startsWith("/dashboard/finance")) return "FINANCE_MANAGER";
  if (pathname.startsWith("/dashboard/operations")) return "OPERATIONS_MANAGER";
  if (pathname.startsWith("/dashboard/admin")) return "SUPER_ADMIN";
  return null;
}

function getDashboardPath(roles: string[]): string {
  if (roles.includes("SUPER_ADMIN")) return "/dashboard/admin";
  if (roles.includes("FINANCE_MANAGER")) return "/dashboard/finance";
  if (roles.includes("OPERATIONS_MANAGER")) return "/dashboard/operations";
  if (roles.includes("COMMITTEE_MEMBER")) return "/dashboard/committee";
  if (roles.includes("REVIEWER")) return "/dashboard/reviewer";
  if (roles.includes("PARTICIPANT")) return "/dashboard/participant";
  return "/login";
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon).*)"],
};
