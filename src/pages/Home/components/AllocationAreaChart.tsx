import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function AllocationAreaChart({
  chartData,
  chartConfig,
  idSuffix,
}: {
  chartData: { day: string; value: number }[];
  chartConfig: ChartConfig;
  idSuffix: string;
}) {
  const gradientId = `fillAllocation${idSuffix}`;

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(1000);
  const [dynamicTicks, setDynamicTicks] = useState<number[]>([]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const values = chartData.map((d) => d.value);
      const dataMin = Math.min(...values);
      const dataMax = Math.max(...values);

      const padding = (dataMax - dataMin) * 0.1;
      const newMinValue = Math.floor(dataMin);
      const newMaxValue = Math.ceil(dataMax + padding);
      setMinValue(newMinValue);
      setMaxValue(newMaxValue);

      const tickCount = 5;
      const tickStep = (newMaxValue - newMinValue) / (tickCount - 1);
      const newDynamicTicks = Array.from({ length: tickCount }, (_, i) =>
        Math.round(newMinValue + tickStep * i)
      );
      setDynamicTicks(newDynamicTicks);
    }
  }, [chartData]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-[200px]">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor={chartConfig.desktop.color}
              stopOpacity={0.4}
            />
            <stop
              offset="95%"
              stopColor={chartConfig.desktop.color}
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <CartesianGrid vertical={false} horizontal={false} />
        <YAxis
          ticks={dynamicTicks}
          domain={[minValue, maxValue]}
          tickFormatter={(value) => `$${value.toFixed(1)}`}
          hide
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={chartConfig.desktop.color}
          fill={`url(#${gradientId})`}
          fillOpacity={0.4}
          activeDot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
