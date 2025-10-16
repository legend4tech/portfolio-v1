"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CodeXml,
  ExternalLink,
  Github,
  Layers,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/root/ErrorState";

/**
 * Project not found fallback component
 */
function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-purple-400">
          Project Not Found
        </h1>
        <p className="text-gray-400">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="bg-purple-500 hover:bg-purple-600">
          <Link href="/#portfolio">Back to Portfolio</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for project details page
 */
function ProjectDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20">
      <div className="container mx-auto px-6 py-8">
        <Skeleton className="h-6 w-48 mb-8 bg-purple-500/10" />

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 bg-purple-500/10" />
              <Skeleton className="h-4 w-full bg-purple-500/10" />
              <Skeleton className="h-4 w-full bg-purple-500/10" />
              <Skeleton className="h-4 w-2/3 bg-purple-500/10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 bg-purple-500/10 rounded-xl" />
              <Skeleton className="h-24 bg-purple-500/10 rounded-xl" />
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-purple-500/10" />
              <Skeleton className="h-12 w-32 bg-purple-500/10" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Skeleton className="aspect-video w-full bg-purple-500/10 rounded-xl" />
            <Skeleton className="h-64 w-full bg-purple-500/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailsPage({ id }: { id: string }) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const router = useRouter();

  const { data: projects = [], isLoading, error, refetch } = useProjects();

  const project = projects.find((p) => p._id === id);

  if (isLoading) {
    return <ProjectDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20 flex items-center justify-center">
        <ErrorState
          title="Failed to Load Project"
          message="We couldn't load the project details. Please try again."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-gray-900 to-blue-900/20">
      <div className="container mx-auto px-6 py-8">
        {/* Navigation */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList className="text-sm text-gray-400">
            <span
              onClick={router.back}
              className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </span>

            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="hover:text-purple-400 transition-colors"
              >
                <Link href="/#portfolio">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-purple-400">
                {project.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Title and Description */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold gradient-text">
                {project.title}
              </h1>
              <p className="text-gray-400 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`glass-card p-4 rounded-xl space-y-1 hover:border-purple-400/50 hover:border flex flex-col xs:flex-row xs:gap-3 items-center`}
              >
                <div className="h-11 w-11 rounded-full flex items-center justify-center bg-[#202E55] text-blue-300">
                  <CodeXml size={30} />
                </div>
                <div className="text-2xl font-bold text-blue-400 text-center xs:text-left">
                  {project.technologies.length}{" "}
                  <p className="text-sm text-gray-400">Total Technology</p>
                </div>
              </div>

              <div
                className={cn(
                  `glass-card p-4 rounded-xl space-y-1 hover:border-purple-400/50 hover:border flex flex-col xs:flex-row xs:gap-3 items-center`,
                )}
              >
                <div className="h-11 w-11 rounded-full bg-[#372556] text-purple-300 flex items-center justify-center">
                  <Layers size={30} />
                </div>
                <div className="text-2xl font-bold text-purple-400 text-center xs:text-left">
                  {project.keyFeatures.length}
                  <p className="text-sm text-gray-400">Key Features</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                asChild
                className="bg-purple-500 hover:bg-purple-600 text-white p-6"
              >
                <Link
                  href={project.demoUrl}
                  className="inline-flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white/5 hover:bg-white/10 text-pink-200 hover:text-white p-6"
              >
                <Link
                  href={project.githubUrl}
                  className="inline-flex items-center gap-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  Github
                </Link>
              </Button>
            </div>

            {/* Technologies */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <div
                    key={`${tech}-${index}`}
                    className="bg-white/5 hover:bg-white/10 text-purple-400 border-purple-400/50 py-5 px-7 rounded-lg border flex gap-2 items-center"
                  >
                    <Package size={20} />
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Project Image */}
            <div className="relative aspect-video rounded-xl overflow-hidden glass-card p-1">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className={`w-full h-full object-cover rounded-lg hover:scale-110 ease-in-out transition-transform duration-300 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                width={1200}
                height={675}
                onLoad={() => setIsImageLoading(false)}
              />
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 border-4 border-purple-500/50 border-t-purple-500 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Key Features */}
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
                  <span className="text-yellow-500">★</span>
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {project.keyFeatures.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-3 text-gray-300 hover:bg-white/5 hover:backdrop-blur-md hover:border hover:border-white/10 p-3 rounded-md"
                    >
                      <span className="w-2 h-2 mt-2 rounded-full bg-purple-400" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
