"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { ProjectsList } from "@/components/admin/ProjectsList";
import { useProjects } from "@/hooks/useProjects";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectListSkeleton } from "./loadingSkeleton/ProjectListSkeleton";

/**
 * Projects Management Client Component
 * Main page for managing portfolio projects
 * Displays loading states, error handling, and the projects list
 */
export function ProjectsManagementClient() {
  const { data: projects = [], isLoading, error } = useProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-blue-900/20">
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Button
              asChild
              variant="ghost"
              className="mb-4 text-white hover:text-purple-500  bg-purple-500 -ml-4"
            >
              <Link href="/admin" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Manage Projects
            </h1>
            <p className="text-gray-400">
              Add, edit, or delete your portfolio projects
            </p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-purple-500/20"
          >
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Project
            </Link>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && <ProjectListSkeleton />}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="glass-card border-0 border-red-500/20">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-400 mb-4 font-medium">
                {error instanceof Error
                  ? error.message
                  : "Failed to load projects"}
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/50"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Projects List */}
        {!isLoading && !error && <ProjectsList projects={projects} />}
      </div>
    </div>
  );
}
