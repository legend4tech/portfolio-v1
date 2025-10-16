import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { TechStacksList } from "@/components/admin/TechStacksList"

export const metadata: Metadata = {
  title: "Manage Tech Stack - Admin",
}

/**
 * Tech Stack Management Page
 * Displays all tech stack items with options to add, edit, and delete
 */
export default async function TechStackManagementPage() {
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20  to-blue-900/20">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Button asChild variant="ghost" className="mb-4 text-white hover:text-purple-500  bg-purple-500 -ml-4">
              <Link href="/admin" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-4xl font-bold gradient-text mb-2">Manage Tech Stack</h1>
            <p className="text-gray-400">Add, edit, or delete technologies in your stack</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-purple-500/20"
          >
            <Link href="/admin/techstack/new" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add New Tech Stack
            </Link>
          </Button>
        </div>

        {/* Tech Stacks List */}
        <TechStacksList />
      </div>
    </div>
  )
}
