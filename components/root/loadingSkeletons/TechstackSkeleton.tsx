import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading skeleton for tech stack items
 * Displays placeholder content while tech stack is being fetched
 */
export function TechStackItemSkeleton() {
  return (
    <div className="glass-card p-6 rounded-xl flex flex-col items-center gap-4">
      {/* Icon skeleton */}
      <Skeleton className="w-12 h-12 rounded-full bg-purple-500/10" />

      {/* Name skeleton */}
      <Skeleton className="h-4 w-16 bg-purple-500/10" />
    </div>
  )
}

/**
 * Grid of tech stack skeletons
 * Shows multiple loading items in the same layout as real tech stack
 */
export function TechStackGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <TechStackItemSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Loading skeleton for entire tech stack category
 * Includes category title and grid of items
 */
export function TechStackCategorySkeleton() {
  return (
    <div className="space-y-6">
      {/* Category title skeleton */}
      <Skeleton className="h-8 w-48 bg-purple-500/10" />

      {/* Tech items grid */}
      <TechStackGridSkeleton count={6} />
    </div>
  )
}
