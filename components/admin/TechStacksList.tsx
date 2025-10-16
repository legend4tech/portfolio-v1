"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash2, Sparkles } from "lucide-react";
import type { DBTechStack } from "@/types/portfolioTypes";
import { useDeleteTechStack } from "@/hooks/useDeleteTechStack";
import { useTechStack } from "@/hooks/useTechStack";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { TechStackListSkeleton } from "@/components/admin/loadingSkeleton/TechstackListSkeleton";
import { ErrorState } from "@/components/root/ErrorState";

/**
 * Tech Stacks List Component
 * Fetches and displays all tech stack items grouped by category with edit and delete actions
 * Uses React Query hook for data fetching with loading and error states
 */
export function TechStacksList() {
  const { data: techStacks = [], isLoading, error, refetch } = useTechStack();
  const deleteTechStack = useDeleteTechStack();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [techToDelete, setTechToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  if (isLoading) {
    return <TechStackListSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load tech stack"
        message="There was an error loading your tech stack. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  // Group tech stacks by category
  const groupedTechStacks = techStacks.reduce(
    (acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, DBTechStack[]>,
  );

  // Sort each category by order
  Object.keys(groupedTechStacks).forEach((category) => {
    groupedTechStacks[category].sort((a, b) => a.order - b.order);
  });

  const handleDelete = (id: string, name: string) => {
    setTechToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (techToDelete) {
      deleteTechStack.mutate(techToDelete.id);
      setDeleteDialogOpen(false);
      setTechToDelete(null);
    }
  };

  if (techStacks.length === 0) {
    return (
      <Card className="glass-card border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
        <CardContent className="py-20 text-center relative">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            No Tech Stack Yet
          </h3>
          <p className="text-gray-400 mb-8 max-w-md mx-auto text-lg">
            Start building your tech stack showcase by adding your first
            technology
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg shadow-purple-500/20"
          >
            <Link href="/admin/techstack/new">
              <Sparkles className="w-5 h-5 mr-2" />
              Add Your First Tech Stack
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-16">
        {Object.entries(groupedTechStacks).map(([category, items]) => (
          <div key={category} className="space-y-8">
            {/* Category Header */}
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <h3 className="text-3xl font-bold gradient-text tracking-tight px-6">
                {category}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {items.map((tech) => (
                <Card
                  key={tech._id}
                  className="glass-card border-0 group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-blue-500/10 transition-all duration-500" />

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                  </div>

                  <CardContent className="p-6 space-y-5 relative">
                    {/* Icon Container - No cramped container, more spacious */}
                    <div className="relative">
                      {/* Larger, bolder icon display */}
                      <div className="relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-sm border border-white/10 group-hover:border-purple-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                        <div className="relative w-full h-full">
                          <Image
                            src={tech.icon || "/placeholder.svg"}
                            alt={tech.name}
                            fill
                            className="object-contain drop-shadow-2xl"
                          />
                        </div>
                        {/* Subtle glow behind icon */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      </div>

                      {/* Order Badge - More prominent */}
                      <Badge
                        variant="outline"
                        className="absolute -top-3 -right-3 text-xs font-bold bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg shadow-purple-500/30 backdrop-blur-sm px-2.5 py-1"
                      >
                        #{tech.order}
                      </Badge>
                    </div>

                    {/* Name - More prominent */}
                    <div className="text-center pt-2">
                      <p className="text-base font-bold text-white leading-tight group-hover:text-purple-300 transition-colors">
                        {tech.name}
                      </p>
                    </div>

                    {/* Actions - Slide up on hover */}
                    <div className="flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 h-9 bg-gradient-to-br from-blue-500/30 to-blue-600/30 hover:from-blue-500/40 hover:to-blue-600/40 text-blue-200 border border-blue-400/30 hover:border-blue-300/50 backdrop-blur-sm shadow-lg shadow-blue-500/20"
                      >
                        <Link href={`/admin/techstack/${tech._id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(tech._id!, tech.name)}
                        disabled={deleteTechStack.isPending}
                        className="flex-1 h-9 bg-gradient-to-br from-red-500/30 to-red-600/30 hover:from-red-500/40 hover:to-red-600/40 text-red-200 border border-red-400/30 hover:border-red-300/50 backdrop-blur-sm shadow-lg shadow-red-500/20 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-0 bg-black/90 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/5 rounded-lg" />
          <AlertDialogHeader className="relative">
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Delete Tech Stack
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 text-base">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                &quot;{techToDelete?.name}&quot;
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="relative">
            <AlertDialogCancel className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 backdrop-blur-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg shadow-red-500/30"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
