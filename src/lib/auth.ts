import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const SESSION_COOKIE = "conf_session";
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-in-production"
);

export type SessionPayload = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      roles: { include: { role: true } },
      participant: true,
    },
  });

  if (!user || !user.isActive || user.isSuspended) return null;

  return {
    ...user,
    session,
    roles: user.roles.map((r) => r.role.name),
  };
}

export function hasRole(user: { roles: string[] } | null, ...roles: string[]): boolean {
  if (!user) return false;
  return roles.some((r) => user.roles.includes(r));
  }

export async function requireRole(
  ...roles: string[]
): Promise<NonNullable<Awaited<ReturnType<typeof getSessionUser>>>> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  if (!hasRole({ roles: user.roles }, ...roles)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
