import { getDb } from "@/lib/mongodb"
import { redirect } from "next/navigation"
import { SetupForm } from "@/components/admin/SetupForm"

/**
 * Admin Setup Page
 * Creates the first admin user if none exists
 */
export default async function SetupPage() {
  // Check if admin already exists
  const db = await getDb()
  const adminExists = await db.collection("users").findOne({ role: "admin" })

  if (adminExists) {
    // Admin exists, redirect to login
    redirect("/admin/login")
  }

  // No admin exists, show setup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 flex items-center justify-center p-6">
      <SetupForm />
    </div>
  )
}
