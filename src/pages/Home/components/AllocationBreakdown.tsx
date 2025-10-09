import type { TAllocation } from "@/types/allocation.type";
import AllocationPieChart from "./AllocationPieChart";
import { useState, useEffect } from "react";
import { useAllocations } from "@/queries/cryptoQueries";
import { allocationColors } from "@/pages/Allocations/allocationsColor";
import { Skeleton } from "@/components/ui/skeleton";

type ChartData = {
  name: string;
  value: number;
  fill: string;
};

export default function AllocationBreakdown() {
  const { data, isLoading } = useAllocations();
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (data?.data) {
      // Calculate total balance
      const totalBalance = data.data.reduce(
        (sum: number, item: TAllocation) => sum + item.currentBalance,
        0
      );

      // Format data for chart
      const formattedChartData = data.data.map((item: TAllocation): ChartData => ({
        name: item.key,
        value: Number(((item.currentBalance / totalBalance) * 100).toFixed(2)),
        fill: allocationColors[item.key.toLocaleLowerCase()],
      }));

      setChartData(formattedChartData);
    }
  }, [data]);

  return (
    <section className="section-container h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Allocation Breakdown</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col gap-4 mb-4 md:mb-0">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="w-4 h-4 rounded-full" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="w-[180px] h-[180px] rounded-full" />
        </div>
      ) : data?.data?.length > 0 ? (
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col gap-4 mb-4 md:mb-0">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <div className="font-bold">{item.name}</div>
                <div className="font-bold">{item.value}%</div>
              </div>
            ))}
          </div>
          <AllocationPieChart data={chartData} />
        </div>
      ) : (
        <div className="m-auto">No data available</div>
      )}
    </section>
  );
}
