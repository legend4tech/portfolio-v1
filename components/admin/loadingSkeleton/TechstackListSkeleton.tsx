import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Loading skeleton for tech stack list
 * Matches the original glassmorphic design with category grouping
 */
export function TechStackListSkeleton() {
  return (
    <div className="space-y-16">
      {[1, 2, 3].map((category) => (
        <div key={category} className="space-y-8">
          {/* Category Header - Matching original gradient divider design */}
          <div className="flex items-center gap-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" />
            <div className="h-8 w-32 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded animate-pulse" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse" />
          </div>

          {/* Tech Stack Grid - Matching original 6-column layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="glass-card border-0 relative overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-purple-500/0 to-blue-500/5 animate-pulse" />

                {/* Glow effect lines */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent animate-pulse" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse" />

                <CardContent className="p-6 space-y-5 relative">
                  {/* Icon Container Skeleton */}
                  <div className="relative">
                    {/* Large icon display skeleton */}
                    <div className="relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 animate-pulse">
                      <div className="absolute inset-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg animate-pulse" />
                    </div>

                    {/* Order Badge Skeleton */}
                    <Badge
                      variant="outline"
                      className="absolute -top-3 -right-3 text-xs bg-gradient-to-br from-purple-500/50 to-purple-600/50 border-0 backdrop-blur-sm px-2.5 py-1 animate-pulse"
                    >
                      <span className="opacity-0">#0</span>
                    </Badge>
                  </div>

                  {/* Name Skeleton */}
                  <div className="text-center pt-2">
                    <div className="h-4 w-20 bg-white/10 rounded mx-auto animate-pulse" />
                  </div>

                  {/* Actions Skeleton - Hidden by default like original */}
                  <div className="flex gap-2 opacity-0">
                    <div className="flex-1 h-9 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded border border-blue-400/20 animate-pulse" />
                    <div className="flex-1 h-9 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded border border-red-400/20 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
