import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { mockData } from "@/data/mockData";

interface AllocationMetricsPanelProps {
  allocation: string;
}

// Data for the panels, derived from the images and demo code
const panelData: {
  [key: string]: {
    bandAssignment: { text: string; colorKey: string };
    routingStrategy: { text: string; colorKey: string };
    overrideStatus: { text: string; colorKey: string };
    overrideBadge: string | null;
  };
} = {
  a: {
    bandAssignment: { text: "Expansion", colorKey: "blue" },
    routingStrategy: { text: "Dynamic", colorKey: "blue" },
    overrideStatus: { text: "Inactive", colorKey: "blue" },
    overrideBadge: null,
  },
  b: {
    bandAssignment: { text: "Expansion", colorKey: "green" },
    routingStrategy: { text: "Dynamic", colorKey: "green" },
    overrideStatus: { text: "Inactive", colorKey: "green" },
    overrideBadge: null,
  },
  c: {
    bandAssignment: { text: "Override", colorKey: "yellow" },
    routingStrategy: { text: "Override Driven", colorKey: "yellow" },
    overrideStatus: { text: "Active +1.25%", colorKey: "yellow" },
    overrideBadge: "Override Active",
  },
  d: {
    bandAssignment: { text: "Override", colorKey: "pink" },
    routingStrategy: { text: "Override Driven", colorKey: "pink" },
    overrideStatus: { text: "Active +1.25%", colorKey: "pink" },
    overrideBadge: "Override Active",
  },
};

// Tailwind CSS classes for different colors to be used in the panel
const colorStyles: { [key: string]: string } = {
  blue: "bg-blue-600/10 text-blue-600 outline-blue-600",
  green: "bg-green-600/10 text-green-600 outline-green-600",
  yellow: "bg-yellow-400/10 text-yellow-400 outline-yellow-400",
  pink: "bg-[#FF69B4]/10 text-[#FF69B4] outline-[#FF69B4]",
};

// A reusable card component for individual metrics
const MetricCard: React.FC<{
  title: string;
  value: string;
  colorKey: string;
}> = ({ title, value, colorKey }) => {
  return (
    <div className="flex-1 space-y-1.5 min-w-0">
      <p className="text-xs sm:text-sm text-foreground truncate">{title}</p>
      <div
        className={cn(
          "w-full p-2 sm:p-2.5 rounded-lg outline outline-offset-[-1px]",
          colorStyles[colorKey]
        )}
      >
        <p className="text-sm sm:text-base font-medium truncate">{value}</p>
      </div>
    </div>
  );
};

// A reusable card component for date information
const DateCard: React.FC<{ title: string; date: string }> = ({
  title,
  date,
}) => (
  <div className="flex-1 space-y-1.5 min-w-0">
    <p className="text-xs sm:text-sm text-foreground truncate">{title}</p>
    <div className="w-full p-2 sm:p-2.5 bg-(--input) rounded-lg outline outline-offset-[-1px] outline-neutral-700">
      <p className="text-sm sm:text-base font-normal text-foreground truncate">
        {date}
      </p>
    </div>
  </div>
);

export const AllocationMetricsPanel: React.FC<AllocationMetricsPanelProps> = ({
  allocation,
}) => {
  const [allocationDetails, setAllocationDetails] = useState({
    lastPayout: "",
    nextUnlock: "",
  });

  useEffect(() => {
    if (!allocation) return;

    const allocationData =
      mockData.allocations[
        allocation.toUpperCase() as keyof typeof mockData.allocations
      ];

    if (allocationData) {
      setAllocationDetails({
        lastPayout: allocationData.lastPayout as string,
        nextUnlock: allocationData.nextUnlock as string,
      });
    }
  }, [allocation]);

  const data = panelData[allocation as keyof typeof panelData];
  if (!data) return null;
  return (
    <div className="flex flex-col gap-4 sm:gap-5 text-foreground mt-4 w-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold truncate">
            Allocation Metrics Panel
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="truncate">$129,170.88</span>
            <div className="w-1 h-1 bg-zinc-400 rounded-full flex-shrink-0" />
            <span className="truncate">+0.39% today</span>
          </div>
        </div>
        {data.overrideBadge && (
          <div className="px-2 py-1 bg-yellow-400/20 rounded-[5px] flex-shrink-0 self-start">
            <p className="text-xs sm:text-base font-medium text-yellow-400 whitespace-nowrap">
              {data.overrideBadge}
            </p>
          </div>
        )}
      </div>

      {/* Panel Body */}
      <div className="space-y-4 sm:space-y-5">
        {/* Metrics Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          <MetricCard
            title="Band Assignment"
            value={data.bandAssignment.text}
            colorKey={data.bandAssignment.colorKey}
          />
          <MetricCard
            title="Routing Strategy"
            value={data.routingStrategy.text}
            colorKey={data.routingStrategy.colorKey}
          />
          <MetricCard
            title="Override status"
            value={data.overrideStatus.text}
            colorKey={data.overrideStatus.colorKey}
          />
        </div>

        {/* Date Cards Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5">
          <DateCard
            title="$ Last payout Event"
            date={
              allocationDetails.lastPayout
                ? new Date(allocationDetails.lastPayout).toLocaleString()
                : "N/A"
            }
          />
          <DateCard
            title="$ Next Unlock Epoch"
            date={
              allocationDetails.nextUnlock
                ? new Date(allocationDetails.nextUnlock).toLocaleString()
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
};
