import { cn } from "@/lib/utils";
import AllocationAreaChart from "./AllocationAreaChart";
import { type ChartConfig } from "@/components/ui/chart";
import { useAllocationByKey } from "@/queries/cryptoQueries";
import type { TAllocationHistory } from "@/types";

type AllocationProps = {
  label: string;
  chartConfig: ChartConfig;
  allocationKey: string;
};

export default function Allocation({
  label,
  chartConfig,
  allocationKey,
}: AllocationProps) {
  const { data } = useAllocationByKey(allocationKey);

  const formattedData =
    data?.data?.history &&
    data?.data?.history.map((d: TAllocationHistory) => ({
      day: d.createdAt,
      time: new Date(d?.createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: Math.abs(d.ending_balance - d.starting_balance),
    }));

  // Calculate gainPercent
  let gainPercent = 0;
  if (data?.data?.history && data.data.history.length > 0) {
    const sortedHistory = [...data.data.history].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const earliest = sortedHistory[0];
    const latest = sortedHistory[sortedHistory.length - 1];
    const startingBalance = earliest.starting_balance;
    const endingBalance = latest.ending_balance;
    if (startingBalance !== 0) {
      gainPercent = ((endingBalance - startingBalance) / startingBalance) * 100;
    }
  }

  // Use ending_balance of the earliest record and starting_balance of the latest for display
  const startingBalance =
    (data?.data?.history &&
      data?.data?.history[data?.data?.history.length - 1]?.ending_balance) ||
    0;
  const endingBalance =
    (data?.data?.history && data?.data?.history[0]?.starting_balance) || 0;

  return (
    <section className="section-container-no-padding border rounded-md hover:border hover:border-primary w-full">
      <div className="flex items-start justify-between px-6 pt-6">
        <h3 className="font-bold">
          {data?.data?.name ? data.data.name : label}
        </h3>
        <div className="text-right">
          <p className="font-semibold">
            $
            {endingBalance.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
            M
          </p>
          <div
            className={cn(
              "text-[10px]",
              gainPercent >= 0 ? "text-[#12BE73]" : "text-[#FF3F31]"
            )}
          >
            {gainPercent >= 0 ? "▲" : "▼"} {gainPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 px-6 py-2">
        <div>
          <p className="text-foreground/70 text-xs">Starting</p>
          <p className="font-semibold text-sm">
            $
            {startingBalance.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-foreground/70 text-xs">Ending</p>
          <p className="font-semibold text-sm">
            $
            {endingBalance.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      <AllocationAreaChart
        chartData={formattedData || []}
        chartConfig={chartConfig}
        idSuffix={label}
      />
    </section>
  );
}
