import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: "customer" | "staff" | "admin";
      appUserId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "customer" | "staff" | "admin";
    appUserId?: string;
  }
}
