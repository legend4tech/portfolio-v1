import type { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin/AdminDashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard",
}

/**
 * Admin Dashboard Page
 * Protected route - requires authentication and admin role
 */
export default async function AdminPage() {
  const session = await auth()

  // Redirect if not authenticated or not admin
  if (!session || session.user?.role !== "admin") {
    redirect("/admin/login")
  }

  return <AdminDashboard user={session.user} />
}
