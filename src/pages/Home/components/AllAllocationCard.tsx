import { Link } from "react-router";
import Allocation from "./Allocation";
import { useEffect, useState } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import { useAllocations } from "@/queries/cryptoQueries";
import type { TAllocation } from "@/types";
import { allocationColors } from "@/pages/Allocations/allocationsColor";

type AllocationData = {
  label: string;
  chartConfig: ChartConfig;
  allocationKey: string;
  name: string;
};

export default function AllAllocationCard() {
  const { data } = useAllocations();
  const [allocationData, setAllocationData] = useState<AllocationData[]>([]);

  useEffect(() => {
    const formattedAllocationData = data?.data.map((item: TAllocation) => {
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
    });

    setAllocationData(formattedAllocationData);
  }, [data?.data]);

  return (
    <div>
      {allocationData?.length > 0 ? (
        <div
          className={`grid grid-cols-1 md:grid-cols-${allocationData?.length} gap-4`}
        >
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
          <div className="section-container border rounded-md hover:border hover:border-primaryflex items-center justify-center">
            No Allocation Available
          </div>
        </div>
      )}
    </div>
  );
}
