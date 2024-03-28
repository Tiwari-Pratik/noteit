
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import { LoginFormSchema } from "@/lib/schema";
import { getUserByEmail } from "@/lib/userData";
import bcrypt from "bcryptjs"

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedCredentials = LoginFormSchema.safeParse(credentials);

        if (validatedCredentials.success) {
          const { email, password } = validatedCredentials.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) {
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user;
          } else {
            return null;
          }
        }
        return null;
      },
    }),
  ],
});
