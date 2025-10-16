import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for certificate cards
 * Displays placeholder content while certificates are being fetched
 */
export function CertificateSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Certificate image skeleton */}
      <Skeleton className="aspect-[4/3] w-full bg-purple-500/10" />

      <div className="p-6 space-y-2">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-4/5 bg-purple-500/10" />

        {/* Issuer and date skeleton */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20 bg-purple-500/10" />
          <Skeleton className="h-4 w-24 bg-purple-500/10" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of certificate skeletons
 * Shows multiple loading cards in the same layout as real certificates
 */
export function CertificatesGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CertificateSkeleton key={i} />
      ))}
    </div>
  );
}
