import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/lib/types";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/landing");
  }

  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  const role = session.user.role ?? "customer";

  if (!allowedRoles.includes(role)) {
    redirect("/");
  }

  return session;
}
