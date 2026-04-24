import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const client = convexUrl ? new ConvexHttpClient(convexUrl) : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email || !client) {
        return true;
      }

      await client.mutation(api.users.upsertFromAuth, {
        email: user.email,
        name: user.name ?? user.email.split("@")[0],
        phone: "",
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user?.name) {
        token.name = user.name;
      }

      if (user?.email) {
        token.email = user.email;
      }

      if (token.email && client) {
        const appUser = await client.query(api.users.getByEmail, { email: token.email });
        token.role = appUser?.role ?? "customer";
        token.appUserId = appUser?._id;
      } else {
        token.role = token.role ?? "customer";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as "customer" | "staff" | "admin") ?? "customer";
        session.user.appUserId = (token.appUserId as string | undefined) ?? undefined;
      }

      return session;
    },
  },
  pages: {
    signIn: "/landing",
  },
});
