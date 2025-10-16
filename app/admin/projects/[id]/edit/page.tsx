import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProjectById } from "@/app/actions/projects";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Project - Admin",
};

/**
 * Edit Project Page
 * Form for updating an existing portfolio project
 */
export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Button
          asChild
          variant="ghost"
          className="mb-4 text-white hover:text-purple-500  bg-purple-500 -ml-4"
        >
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Edit Project
          </h1>
          <p className="text-gray-400">Update your project details</p>
        </div>

        <ProjectForm project={project} />
      </div>
    </div>
  );
}
