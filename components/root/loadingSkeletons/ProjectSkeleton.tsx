import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for project cards
 * Displays placeholder content while projects are being fetched
 */
export function ProjectSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full bg-purple-500/10" />

      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4 bg-purple-500/10" />

        {/* Description skeleton - 2 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-purple-500/10" />
          <Skeleton className="h-4 w-5/6 bg-purple-500/10" />
        </div>

        {/* Links skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20 bg-purple-500/10" />
          <Skeleton className="h-4 w-16 bg-purple-500/10" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of project skeletons
 * Shows multiple loading cards in the same layout as real projects
 */
export function ProjectsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectSkeleton key={i} />
      ))}
    </div>
  );
}
