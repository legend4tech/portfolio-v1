import { Skeleton } from "@/components/ui/skeleton"

export function PRCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-6 space-y-4 border border-transparent">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Skeleton className="w-10 h-10 rounded-lg bg-purple-500/10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-1/2 bg-white/5" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded-full bg-green-500/10" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-white/5" />
        <Skeleton className="h-4 w-5/6 bg-white/5" />
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-16 rounded-md bg-purple-500/10" />
        <Skeleton className="h-6 w-20 rounded-md bg-blue-500/10" />
        <Skeleton className="h-6 w-14 rounded-md bg-green-500/10" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <Skeleton className="h-4 w-24 bg-white/5" />
        <Skeleton className="h-4 w-20 bg-purple-500/10" />
      </div>
    </div>
  )
}
