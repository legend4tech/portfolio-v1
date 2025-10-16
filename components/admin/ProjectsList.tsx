"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import type { DBProject } from "@/types/portfolioTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, ExternalLink, Github } from "lucide-react"
import { useDeleteProject } from "@/hooks/useDeleteProject"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProjectsListProps {
  projects: DBProject[]
}

/**
 * Projects List Component
 * Displays all projects in a responsive grid with edit/delete actions
 */
export function ProjectsList({ projects }: ProjectsListProps) {
  const { mutate: deleteProject, isPending } = useDeleteProject()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeletingId(id)
    deleteProject(id, {
      onSettled: () => setDeletingId(null),
    })
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <Card className="glass-card border-0">
        <CardContent className="py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Get started by adding your first project to your portfolio</p>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Link href="/admin/projects/new">Add Your First Project</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="glass-card border-0 hover:border-purple-400/50 transition-all duration-300 h-full flex flex-col group">
            {/* Project Image */}
            <CardHeader className="p-0">
              <div className="relative aspect-video rounded-t-xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                <Image
                  src={project.image || "/placeholder.svg?height=400&width=600"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardHeader>

            <CardContent className="p-6 flex-1 flex flex-col">
              {/* Project Title & Description */}
              <CardTitle className="text-white mb-2 line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="text-gray-400 line-clamp-2 mb-4 flex-1">
                {project.description}
              </CardDescription>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 font-medium"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="text-xs px-2.5 py-1 text-gray-500 font-medium">
                    +{project.technologies.length - 3} more
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Link href={`/admin/projects/${project._id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={isPending && deletingId === project._id}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Delete Project</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-white">"{project.title}"</span>? This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(project._id!)}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* External Links */}
              <div className="flex gap-2 pt-3 border-t border-white/10">
                <Button asChild size="sm" variant="ghost" className="flex-1 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 hover:text-purple-300">
                  <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Demo
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="flex-1 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 hover:text-purple-300">
                  <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="w-3 h-3 mr-1" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
