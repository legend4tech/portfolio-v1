import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import { z } from "zod"

/**
 * Auth.js v5 Configuration
 * Handles authentication with Google OAuth and email/password
 * Stores sessions and users in MongoDB
 *
 * IMPORTANT: This file must be in the root directory for Auth.js v5
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Google OAuth Provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
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
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        // Find user in database
        const db = await getDb()
        const user = await db.collection("users").findOne({ email })

        if (!user || !user.password) return null

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) return null

        // Return user object with all custom fields
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
          username: user.username,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        // For JWT strategy (credentials provider)
        if (token) {
          session.user.id = token.sub as string
          session.user.role = (token.role as string) || "user"
          session.user.username = token.username as string
          session.user.avatar = token.avatar as string
        }
        // For database strategy (OAuth providers)
        if (user) {
          session.user.id = user.id
          session.user.role = (user as any).role || "user"
          session.user.username = (user as any).username
          session.user.avatar = (user as any).avatar
        }
      }
      return session
    },
    async jwt({ token, user, trigger, session, account }) {
      // On sign in, add user data to token
      if (user) {
        token.role = user.role
        token.username = user.username
        token.avatar = user.avatar
      }
      // For subsequent requests, fetch latest user data
      else if (token.sub && token.email) {
        try {
          const db = await getDb()
          const dbUser = await db.collection("users").findOne({ email: token.email })
          if (dbUser) {
            token.role = dbUser.role || "user"
            token.username = dbUser.username
            token.avatar = dbUser.avatar
          }
        } catch (error) {
          console.error("[Auth] Error fetching user data:", error)
          // Continue with existing token data if DB fetch fails
        }
      }

      // Handle session updates (for profile changes)
      if (trigger === "update" && session) {
        token.name = session.name
        token.username = session.username
        token.avatar = session.avatar
      }

      return token
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdminPage = nextUrl.pathname.startsWith("/admin")
      const isOnLoginPage = nextUrl.pathname === "/admin/login"
      const isOnSetupPage = nextUrl.pathname === "/admin/setup"

      if (isOnAdminPage && !isOnLoginPage && !isOnSetupPage) {
        if (!isLoggedIn) return false // Redirect to login
        if (auth.user.role !== "admin") return false // Not authorized
      }

      return true
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Added error page redirect
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
})
