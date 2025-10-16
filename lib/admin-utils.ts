import { getDb } from "@/lib/mongodb"

/**
 * Server-side utilities for admin operations
 * These functions run in Node.js runtime and can access MongoDB
 */

/**
 * Check if any admin user exists in the database
 * @returns Promise<boolean> - True if at least one admin exists
 */
export async function checkAdminExists(): Promise<boolean> {
  try {
    const db = await getDb()
    const adminExists = await db.collection("users").findOne({ role: "admin" })
    return !!adminExists
  } catch (error) {
    console.error("Error checking admin existence:", error)
    return false
  }
}

/**
 * Get admin user by email
 * @param email - Admin email address
 * @returns Promise<any> - Admin user object or null
 */
export async function getAdminByEmail(email: string) {
  try {
    const db = await getDb()
    return await db.collection("users").findOne({ email, role: "admin" })
  } catch (error) {
    console.error("Error fetching admin:", error)
    return null
  }
}
