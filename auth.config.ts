
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, apiChatPrefix, authRoutes, privateRoutes, publicRoutes } from "@/lib/myRoutes";
import { getUserById } from "@/lib/userData";
import type { NextAuthConfig } from "next-auth"
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    async authorized({ request: { nextUrl }, auth }) {

      const isLoggedIn = !!auth?.user;

      const isAPIAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
      const isAPIChatRoute = nextUrl.pathname.startsWith(apiChatPrefix)

      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);
      const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);

      if (isAPIAuthRoute) {
        return true;
      }

      if (isAPIChatRoute) {
        return true;
      }
      if (isAuthRoute) {
        if (isLoggedIn) {
          return NextResponse.redirect(
            new URL(DEFAULT_LOGIN_REDIRECT, nextUrl),
          );
        }
        return true;
      }

      if (isPublicRoute) {
        return true;
      }

      if (isPrivateRoute) {
        if (isLoggedIn) {
          return true;
        }
        // return NextResponse.redirect(new URL("/register", nextUrl));
        return false;
      }
    },

    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      if (!existingUser) {
        return false;
      }
      return true;
    },
    async jwt({ token, account }) {
      // if (!token.sub) return token;
      // const existingUser = await getUserById(token.sub);
      // if (!existingUser) return token;

      // token.userId = existingUser.id;
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
} satisfies NextAuthConfig
