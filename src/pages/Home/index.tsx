import SearchInput from "@/components/SearchInput";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import TotalNavPanel from "./TotalNavPanel/components/TotalNavPanel";
import AllocationBreakdown from "./components/AllocationBreakdown";
import AssetPerformancePanel from "./components/AssetPerformancePanel";
import DailyReport from "./components/DailyReport";
import SystemStatus from "./components/SystemStatus";
import AllAllocationCard from "./components/AllAllocationCard";

export default function HomePage() {
  const [value, setValue] = useState<string>("");

  return (
    <section>
      <div className="md:hidden mb-4 flex items-center justify-center">
        <SearchInput
          value={value}
          onChange={(value) => {
            console.log({ value });
            setValue(value);
          }}
        />
      </div>

      <div className="max-lg:py-2 space-y-4">
        {/* Total NAV Panel Section */}
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4 lg:col-span-3">
            <TotalNavPanel />
          </div>

          {/* Allocation Breakdown */}
          <div className="col-span-4 lg:col-span-1">
            <AllocationBreakdown />
          </div>
        </div>

        {/* All Allocations Card */}
        <AllAllocationCard />

        <div className="grid grid-cols-4 gap-4">
          {/* Asset Performance Panel */}
          <div className="col-span-4 lg:col-span-3">
            <AssetPerformancePanel />
          </div>

          {/* Daily Report  rows */}
          <div className="col-span-4 lg:col-span-1 row-span-2">
            <DailyReport />
          </div>

          {/* System Status */}
          <div className="col-span-4 lg:col-span-3">
            <Card className="h-full">
              <CardContent>
                <SystemStatus />
              </CardContent>
            </Card>
          </div>

          {/* From the news */}
          {/* <div className="col-span-4 lg:col-span-1">
            <FromTheNews />
          </div> */}
        </div>
      </div>
    </section>
  );
}
