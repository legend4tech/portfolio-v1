import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * Auth.js v5 Configuration
 * Handles authentication with Google OAuth and email/password
 * Stores sessions and users in MongoDB
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Email/Password Credentials Provider
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // Find user in database
        const db = await getDb();
        const user = await db.collection("users").findOne({ email });

        if (!user || !user.password) return null;

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return null;

        // Return user object with all custom fields
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
          username: user.username,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    // Add custom fields to session
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) || "user";
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
    // Add custom fields to token
    async jwt({ token, user, trigger, session }) {
      // On sign in, add user data to token
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.avatar = user.avatar;
      } else if (token.sub) {
        // Fetch latest user data from database
        const db = await getDb();
        const dbUser = await db
          .collection("users")
          .findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role || "user";
          token.username = dbUser.username;
          token.avatar = dbUser.avatar;
        }
      }

      // Handle session updates (for profile changes)
      if (trigger === "update" && session) {
        token.name = session.name;
        token.username = session.username;
        token.avatar = session.avatar;
      }

      return token;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
});
