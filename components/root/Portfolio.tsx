"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { DBTechStack } from "@/types/portfolioTypes";
import { useCertificates } from "@/hooks/useCertificates";
import { useProjects } from "@/hooks/useProjects";
import { useTechStack } from "@/hooks/useTechStack";
import { ProjectsGridSkeleton } from "@/components/root/loadingSkeletons/ProjectSkeleton";
import { CertificatesGridSkeleton } from "@/components/root/loadingSkeletons/CertificateSkeleton";
import { TechStackGridSkeleton } from "@/components/root/loadingSkeletons/TechstackSkeleton";
import { InlineErrorState } from "@/components/root/ErrorState";

/**
 * Tech stack category component
 * Groups tech items by category with expand/collapse functionality
 */
interface TechStackCategoryProps {
  category: string;
  items: DBTechStack[];
}

const TechStackCategory = ({ category, items }: TechStackCategoryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedItems = isExpanded ? items : items.slice(0, 6);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-semibold capitalize gradient-text">
        {category} Technologies
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {displayedItems.map((tech) => (
          <motion.div
            key={tech._id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -5 }}
            className="glass-card p-6 rounded-xl flex flex-col items-center gap-4"
          >
            <div className="relative w-12 h-12">
              <Image
                src={tech.icon || "/placeholder.svg"}
                alt={tech.name}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium text-center">{tech.name}</span>
          </motion.div>
        ))}
      </div>
      {items.length > 6 && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="w-full mt-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 hover:text-white"
        >
          {isExpanded ? "View Less" : "View More"}
          {isExpanded ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
};

export function Portfolio() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const {
    data: projects = [],
    isLoading: projectsLoading,
    error: projectsError,
    refetch: refetchProjects,
  } = useProjects();

  const {
    data: certificates = [],
    isLoading: certificatesLoading,
    error: certificatesError,
    refetch: refetchCertificates,
  } = useCertificates();

  const {
    data: techStackData = [],
    isLoading: techStackLoading,
    error: techStackError,
    refetch: refetchTechStack,
  } = useTechStack();

  const techStackByCategory = useMemo(() => {
    const grouped = techStackData.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, DBTechStack[]>,
    );

    // Sort items within each category by order
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [techStackData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const displayedProjects = showAllProjects ? projects : projects.slice(0, 4);
  const displayedCertificates = showAllCertificates
    ? certificates
    : certificates.slice(0, 4);

  return (
    <section id="portfolio" className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-purple-400">
            Portfolio Showcase
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore my journey through projects, certifications, and technical
            expertise. Each section represents a milestone in my continuous
            learning path.
          </p>
        </motion.div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-transparent">
            {["Projects", "Certificates", "Tech Stack"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase().replace(" ", "")}
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 hover:text-purple-400"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Projects Tab Content */}
          <TabsContent value="projects">
            {projectsLoading ? (
              <ProjectsGridSkeleton count={4} />
            ) : projectsError ? (
              <InlineErrorState
                message="Failed to load projects. Please try again."
                onRetry={() => refetchProjects()}
              />
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No projects available yet.</p>
              </div>
            ) : (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {displayedProjects.map((project) => (
                    <motion.div
                      key={project._id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="glass-card rounded-xl overflow-hidden"
                    >
                      <div className="relative aspect-video">
                        <Image
                          src={
                            project.image ||
                            "/placeholder.svg?height=400&width=600"
                          }
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/placeholder.svg?height=400&width=600";
                          }}
                        />
                      </div>
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl font-semibold">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <Link
                            href={project.demoUrl}
                            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live Demo <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/projects/${project._id}`}
                            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
                          >
                            Details <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                {!showAllProjects && projects.length > 4 && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => setShowAllProjects(true)}
                      variant="outline"
                      className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-purple-500/50 hover:text-purple-100"
                    >
                      View All Projects
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Certificates Tab Content */}
          <TabsContent value="certificates">
            {certificatesLoading ? (
              <CertificatesGridSkeleton count={4} />
            ) : certificatesError ? (
              <InlineErrorState
                message="Failed to load certificates. Please try again."
                onRetry={() => refetchCertificates()}
              />
            ) : certificates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No certificates available yet.</p>
              </div>
            ) : (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {displayedCertificates.map((cert) => (
                    <motion.div
                      key={cert._id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className="glass-card rounded-xl overflow-hidden"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={
                            cert.image ||
                            "/placeholder.svg?height=300&width=400"
                          }
                          alt={cert.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                              "/placeholder.svg?height=300&width=400";
                          }}
                        />
                      </div>
                      <div className="p-6 space-y-3">
                        <h3 className="text-lg font-semibold gradient-text line-clamp-2 min-h-[3.5rem]">
                          {cert.title}
                        </h3>
                        <div className="flex items-start justify-between gap-3 text-sm">
                          <Link
                            href={cert.href}
                            className="flex items-center gap-1.5 text-gray-400 hover:text-purple-300 transition-colors min-w-0 flex-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="truncate">{cert.issuer}</span>
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                          </Link>
                          <span className="text-gray-400 whitespace-nowrap flex-shrink-0">
                            {cert.date}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
                {!showAllCertificates && certificates.length > 4 && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => setShowAllCertificates(true)}
                      variant="outline"
                      className="bg-purple-500/10 hover:text-purple-400 hover:bg-purple-500/20 text-purple-400 border-purple-500/50"
                    >
                      View All Certificates
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Tech Stack Tab Content */}
          <TabsContent value="techstack">
            {techStackLoading ? (
              <div className="space-y-12">
                <TechStackGridSkeleton count={6} />
              </div>
            ) : techStackError ? (
              <InlineErrorState
                message="Failed to load tech stack. Please try again."
                onRetry={() => refetchTechStack()}
              />
            ) : Object.keys(techStackByCategory).length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">
                  No tech stack items available yet.
                </p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-12"
              >
                {Object.entries(techStackByCategory).map(
                  ([category, items]) => (
                    <TechStackCategory
                      key={category}
                      category={category}
                      items={items}
                    />
                  ),
                )}
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
