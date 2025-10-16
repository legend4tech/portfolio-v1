import { Card, CardContent, CardHeader } from "@/components/ui/card"

/**
 * Loading skeleton for certificates list
 * Displays placeholder cards while data is being fetched
 */
export function CertificatesListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Card key={item} className="glass-card border-0 h-full flex flex-col">
          {/* Image Skeleton */}
          <CardHeader className="p-0">
            <div className="relative aspect-[4/3] rounded-t-xl overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 animate-pulse" />
          </CardHeader>

          <CardContent className="p-6 flex-1 flex flex-col">
            {/* Title Skeleton */}
            <div className="h-6 bg-white/10 rounded animate-pulse mb-2 w-3/4" />

            {/* Issuer and Date Skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-blue-400/20 rounded animate-pulse w-1/3" />
              <div className="h-4 bg-white/5 rounded animate-pulse w-1/4" />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action Buttons Skeleton */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 h-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded animate-pulse" />
              <div className="w-8 h-8 bg-red-500/10 rounded animate-pulse" />
            </div>

            {/* External Link Skeleton */}
            <div className="pt-3 border-t border-white/10">
              <div className="h-8 bg-purple-500/10 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
