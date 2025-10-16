import type { DefaultSession } from "next-auth";

/**
 * Extend Next-Auth types to include custom user properties
 */
declare module "next-auth" {
  interface User {
    role?: string;
    username?: string;
    avatar?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      username?: string;
      avatar?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    username?: string;
    avatar?: string;
  }
}
