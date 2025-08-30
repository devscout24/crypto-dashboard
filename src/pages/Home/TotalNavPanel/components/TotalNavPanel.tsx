import SelectInput, { type SelectOption } from "@/components/SelectInput";
import TotalNavChart from "./TotalNavChart";
import { useEffect, useState } from "react";
import type { TNavChartData } from "@/types";
import { cn } from "@/lib/utils";
import { useCryptoChartData } from "@/pages/hooks";

const monthOptions: SelectOption[] = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
];

export default function TotalNavPanel() {
  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const [selected, setSelected] = useState<string>(currentMonth.toLowerCase());

  const {
    data: navChartData,
    // loading: navLoading,
    error: navError,
    isConnected,
    emit,
  } = useCryptoChartData();
  // console.log({ navChartData });

  const activeMonth = selected || currentMonth;

  // Request data when month changes or component mounts
  useEffect(() => {
    if (isConnected) {
      const requestData = {
        month: activeMonth,
        year: new Date().getFullYear(),
      };

      console.log("Requesting chart data for:", requestData);
      emit("request_chart_data", requestData);
    }
  }, [activeMonth, isConnected, emit]);

  const totalNav =
    navChartData &&
    navChartData.reduce((total: number, item: TNavChartData) => {
      return total + item?.nav;
    }, 0);

  const lastTwo = navChartData && navChartData?.slice(-2);

  const lastTwoNavDiff =
    lastTwo &&
    lastTwo.reduce((total: number, item: TNavChartData) => {
      return item?.nav - total;
    }, 0);

  const growthPercent = lastTwoNavDiff
    ? ((lastTwoNavDiff / lastTwo[0]?.nav) * 100).toFixed(4)
    : 0;

  const isUp = Number(growthPercent) > 0 ? true : false;

  const handleMonthChange = (value: string) => {
    setSelected(value);
  };

  return (
    <section className="section-container p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6">
        <h3>
          Total NAV
          <p className="text-foreground text-[16px] font-bold ml-1">
            {totalNav?.toFixed(2) || 1400000}
          </p>
        </h3>

        <div className="flex flex-wrap items-center gap-4 md:gap-5">
          <div className="flex flex-col items-center gap-1">
            <p
              className={cn("text-xs", {
                "text-green-500": isUp,
                "text-red-500": !isUp,
              })}
            >
              {isUp ? "+" : ""}
              {growthPercent || 0}%
            </p>
            <p className="text-foreground/70 text-[10px]">Total growth</p>
          </div>

          <SelectInput
            options={monthOptions}
            placeholder="Select a month"
            label="Month"
            value={selected}
            onValueChange={handleMonthChange}
          />
        </div>
      </div>

      {/* Optional: Error display */}
      {navError && (
        <div className="px-6 pb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <span className="block sm:inline">{navError}</span>
            <button
              onClick={() => {
                // You could add reconnect logic here if needed
                console.log("Reconnecting...");
              }}
              className="float-right font-bold text-red-500 hover:text-red-800"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="pr-6">
        <TotalNavChart
          selectedMonth={selected}
          onMonthChange={handleMonthChange}
        />
      </div>
    </section>
  );
}
