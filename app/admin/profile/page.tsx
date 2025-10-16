import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/admin/ProfileForm";

/**
 * Admin Profile Page
 * Allows admin to update their profile details
 */
export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 p-6">
      <div className="container mx-auto max-w-3xl">
        <ProfileForm user={session.user} />
      </div>
    </div>
  );
}
