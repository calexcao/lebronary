import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      status?: string | null;
      is_active?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    status?: string | null;
    role?: string;
    is_active?: boolean;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        user = await prisma.users.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          throw new Error("User not found");
        } else {
          if (user.role === "staff") {
            const passwordMatch = await bcrypt.compare(
              credentials.password as string,
              user.password
            );
            if (!passwordMatch) {
              throw new Error("Invalid password");
            }
          } else if (user.role === "member") {
            if (user.card != credentials.password) {
              throw new Error("Invalid password");
            }
          }
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.status = user.status;
        token.is_active = user.is_active;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.user.is_active = token.is_active as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  basePath: "/auth",
});
