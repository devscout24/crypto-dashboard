import { Skeleton } from "@/components/ui/skeleton";

export default function DailyReportCardSkeleton({ limit }: { limit: number }) {
  return (
    <section className="flex flex-col gap-4">
      {Array.from({ length: limit }).map((_, index) => (
        <div key={index} className="rounded-lg border shadow-sm">
          <div className="bg-card text-card-foreground flex flex-col md:flex-row md:items-center justify-between rounded-lg px-5 py-[18px] shadow-sm w-full">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-6" />
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-32 mt-1" />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-30 max-md:mt-8">
              <div className="max-md:flex max-md:justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
              <div className="max-md:flex max-md:justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
              <div className="max-md:flex max-md:justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
