import { Link } from "react-router";
import Allocation from "./Allocation";
import { useEffect, useState, useMemo } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import { useAllocations } from "@/queries/cryptoQueries";
import type { TAllocation } from "@/types";
import { allocationColors } from "@/pages/Allocations/allocationsColor";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/queries/userQueries";
import { useAuth } from "@/hooks/useAuth";

type AllocationData = {
  label: string;
  chartConfig: ChartConfig;
  allocationKey: string;
  name: string;
};

export default function AllAllocationCard() {
  const [allocationData, setAllocationData] = useState<AllocationData[]>([]);
  const currentUser = useAuth();

  const { data, isLoading } = useAllocations();
  const { data: userData } = useProfile();

  // Memoize allocations to prevent unnecessary re-renders
  const allocations = useMemo(() => {
    if (currentUser?.role === "ADMIN") {
      return (
        data?.data?.map((item: TAllocation) => ({
          name: item?.name,
          key: item?.key,
        })) || []
      );
    } else {
      return (
        userData?.data?.userAllocations?.map((item) => ({
          name: item?.allocation?.name,
          key: item?.allocation?.key,
        })) || []
      );
    }
  }, [currentUser?.role, data?.data, userData?.data?.userAllocations]);

  useEffect(() => {
    if (allocations && allocations.length > 0) {
      const formattedAllocationData = allocations.map(
        (item: { name: string; key: string }) => {
          return {
            label: item.key,
            allocationKey: item.key,
            chartConfig: {
              desktop: {
                label: "value",
                color:
                  allocationColors[
                    item.key.toLowerCase() as keyof typeof allocationColors
                  ],
              },
            },
            name: item?.name,
          };
        }
      );

      setAllocationData(formattedAllocationData);
    } else if (allocations && allocations.length === 0) {
      setAllocationData([]);
    }
  }, [allocations]);

  const gridColsClass = useMemo(() => {
    const length = allocationData?.length || 0;
    if (length <= 1) return "grid-cols-1";
    if (length === 2) return "md:grid-cols-2";
    if (length === 3) return "md:grid-cols-3";
    if (length === 4) return "md:grid-cols-4";
    return "md:grid-cols-3"; // fallback for more than 4
  }, [allocationData?.length]);

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="w-full border rounded-lg p-4 flex flex-col items-center bg-sidebar"
            >
              <Skeleton className="size-20 rounded-full mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : allocationData?.length > 0 ? (
        <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
          {allocationData.map((item: AllocationData) => (
            <Link
              to={`/dashboard/allocations/${item?.label.toLowerCase()}`}
              className="w-full"
              key={item?.allocationKey}
            >
              <Allocation
                label={item?.label}
                chartConfig={item?.chartConfig}
                allocationKey={item?.allocationKey}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full">
          <div className="section-container border rounded-md flex items-center justify-center">
            No Allocation Available
          </div>
        </div>
      )}
    </div>
  );
}
