import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function PageLoader() {
  return (
    <section className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="absolute top-0 left-0 h-16 w-16 rounded-full opacity-75" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </section>
  );
}

export function PageLoaderOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center",
        className
      )}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="absolute top-0 left-0 h-12 w-12 rounded-full animate-ping opacity-75" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
