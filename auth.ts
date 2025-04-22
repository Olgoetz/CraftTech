import NextAuth from "next-auth";

import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "./database/schema";
import { db } from "./database/drizzle";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: User;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      profile(profile) {
        return { role: profile.role ?? "user", ...profile };
      },
    }),
    Facebook,
    Resend({
      from: "no-reply@novotec-gruppe.de",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role;
      return session;
    },
  },

  //secret: config.env.auth.secret,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  trustHost: true,
});
