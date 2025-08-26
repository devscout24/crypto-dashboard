import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { useEffect, useState, Suspense } from "react";
import Loader from "@/components/Loader";
import type { TNavChartData } from "@/types";
import CustomTooltipContent from "./CustomTooltipContent";
import CustomTooltipCursor from "./CustomTooltipCursor";
import { useChartData } from "../useChartData";
import { Button } from "@/components/ui/button";

const chartConfig = {
  total_nav: {
    label: "Total Nav",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

interface TotalNavChartProps {
  selectedMonth?: string;
  onMonthChange?: (month: string) => void;
}

type TFormattedNavChartData = {
  date: string;
  total_nav: number;
  time: string;
  day: number;
};

// Suspense fallback component
function ChartSuspenseFallback() {
  return (
    <div className="h-[230px] flex items-center justify-center">
      <div className="text-center">
        <Loader />
        <p className="text-sm text-gray-500 mt-2">Loading chart data...</p>
      </div>
    </div>
  );
}

// Main chart component
function ChartContent({ activeMonth }: { activeMonth: string }) {
  const [chartData, setChartData] = useState<TFormattedNavChartData[]>([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1000);
  const [dynamicTicks, setDynamicTicks] = useState<number[]>([]);

  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();

  const {
    data: dataToUse,
    isLoading,
    isSocketActive,
    emit,
    refetchApiData,
  } = useChartData(activeMonth, currentMonth);

  // Process chart data
  useEffect(() => {
    if (Array.isArray(dataToUse) && dataToUse.length > 0) {
      const formattedData = dataToUse
        .map((d: TNavChartData) => {
          const dateField = d.datetime;
          const navField = d.nav;

          if (!dateField || navField === undefined || navField === null) {
            console.warn("Invalid data item:", d);
            return null;
          }

          return {
            date: dateField,
            total_nav: navField,
            time: new Date(dateField).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            day: new Date(dateField).getDate(),
          };
        })
        .filter((item) => item !== null) as TFormattedNavChartData[];

      if (formattedData.length === 0) {
        console.warn("No valid data after formatting");
        setChartData([]);
        return;
      }

      setChartData(formattedData);

      // Calculate min/max values
      const values = formattedData.map(
        (d: TFormattedNavChartData) => d.total_nav
      );
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);

      // Add padding to the range
      const range = dataMax - dataMin;
      const padding = range > 0 ? range * 0.1 : dataMin * 0.1;

      const newMinValue = Math.floor(dataMin - padding);
      const newMaxValue = Math.ceil(dataMax + padding);

      const finalMinValue = newMinValue;
      const finalMaxValue =
        newMaxValue > newMinValue ? newMaxValue : newMinValue + 100;

      setMinValue(finalMinValue);
      setMaxValue(finalMaxValue);

      // Generate dynamic ticks
      const tickCount = 5;
      const tickStep = (finalMaxValue - finalMinValue) / (tickCount - 1);
      const newDynamicTicks = Array.from({ length: tickCount }, (_, i) =>
        Math.round(finalMinValue + tickStep * i)
      );

      setDynamicTicks(newDynamicTicks);
    } else {
      console.log("No valid chart data available");
      setChartData([]);
    }
  }, [dataToUse]);

  const formatXAxisTick = (value: string) => {
    const date = new Date(value);
    if (chartData.length <= 31) {
      return date.getDate().toString();
    }
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return <ChartSuspenseFallback />;
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center p-4 h-[230px] flex items-center justify-center">
        <div>
          <p>
            No data available for{" "}
            {activeMonth.charAt(0).toUpperCase() + activeMonth.slice(1)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Try selecting a different month
          </p>
          {isSocketActive ? (
            <button
              onClick={() =>
                emit("request_chart_data", {
                  month: activeMonth,
                  year: new Date().getFullYear(),
                })
              }
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Retry Again
            </button>
          ) : (
            <Button
              variant={"outline"}
              onClick={() => refetchApiData()}
              className="mt-2"
            >
              Reload
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[230px] w-full"
        style={{ pointerEvents: "all" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="fillTotalNav" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.3}
            />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              height={40}
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxisTick}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[minValue, maxValue]}
              ticks={dynamicTicks}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={8}
              width={80}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />

            <ChartTooltip
              content={<CustomTooltipContent />}
              cursor={
                <CustomTooltipCursor minValue={minValue} maxValue={maxValue} />
              }
            />

            <Area
              dataKey="total_nav"
              type="monotone"
              fill="url(#fillTotalNav)"
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

// Main exported component with Suspense wrapper
export default function TotalNavChart({ selectedMonth }: TotalNavChartProps) {
  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();
  const activeMonth = selectedMonth || currentMonth;

  return (
    <Suspense fallback={<ChartSuspenseFallback />}>
      <ChartContent activeMonth={activeMonth} />
    </Suspense>
  );
}
