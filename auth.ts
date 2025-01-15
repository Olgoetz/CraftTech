import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Resend from "next-auth/providers/resend";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Facebook,
    Resend({
      from: "no-reply@novotec-gruppe.de",
    }),
  ],
  //secret: config.env.auth.secret,
});
