import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { TechStackForm } from "@/components/admin/TechStackForm"
import { getTechStackById } from "@/app/actions/techstack"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit Tech Stack - Admin",
}

/**
 * Edit Tech Stack Page
 * Form to edit an existing technology in the stack
 */
export default async function EditTechStackPage({ params }: { params: { id: string } }) {
  const techStack = await getTechStackById(params.id)

  if (!techStack) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Button asChild variant="ghost" className="mb-8 text-white hover:text-purple-500  bg-purple-500 -ml-4">
          <Link href="/admin/techstack" className="inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Tech Stack
          </Link>
        </Button>

        <TechStackForm techStack={techStack} />
      </div>
    </div>
  )
}
