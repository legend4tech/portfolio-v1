import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // 👇 Explicitly cast credentials to your expected structure
        const user = credentials as {
          id: string;
          email: string;
          name: string;
          role: string;
          username: string;
          avatar: string;
        };

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          username: user.username,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = (token.role as string) || "user";
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
        token.avatar = user.avatar;
      }
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
  trustHost: true,
});
