import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton Card Component
 * Loading placeholder for project/certificate/tech stack cards
 */
export function ProjectListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="glass-card border-0">
          <div className="p-0">
            <Skeleton className="aspect-video rounded-t-xl bg-white/5" />
          </div>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4 bg-white/10" />
            <Skeleton className="h-4 w-full bg-white/5" />
            <Skeleton className="h-4 w-5/6 bg-white/5" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 bg-purple-500/10" />
              <Skeleton className="h-6 w-16 bg-purple-500/10" />
              <Skeleton className="h-6 w-16 bg-purple-500/10" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-9 flex-1 bg-purple-500/10" />
              <Skeleton className="h-9 w-9 bg-red-500/10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
