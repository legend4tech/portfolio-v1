"use server";

import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { z } from "zod";

/**
 * Server Action for credential verification
 * This runs in Node.js runtime, NOT Edge Runtime
 * Safe to use MongoDB here
 */
export async function verifyCredentials(email: string, password: string) {
  try {
    // Validate input
    const parsedCredentials = z
      .object({ email: z.string().email(), password: z.string().min(6) })
      .safeParse({ email, password });

    if (!parsedCredentials.success) {
      return { success: false, error: "Invalid credentials format" };
    }

    // Find user in database
    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user || !user.password) {
      return { success: false, error: "Invalid credentials" };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials" };
    }

    // Return user data (without password)
    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
        username: user.username,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    console.error("[v0] Credential verification error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Get user data by email (for JWT callback)
 */
export async function getUserByEmail(email: string) {
  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "user",
      username: user.username,
      avatar: user.avatar,
    };
  } catch (error) {
    console.error("[v0] Get user error:", error);
    return null;
  }
}
