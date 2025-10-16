import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { getDb } from "@/lib/mongodb";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Login to access the admin dashboard",
};

/**
 * Admin Login Page
 * Handles authentication for admin users
 */
export default async function AdminLoginPage() {
  // Check if admin exists
  const db = await getDb();
  const adminExists = await db.collection("users").findOne({ role: "admin" });

  if (!adminExists) {
    // No admin exists, redirect to setup
    redirect("/admin/setup");
  }

  // Admin exists, show login form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20  to-blue-900/20 flex items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
