import { useTitleStore } from "@/stores/titleStore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import AllocationsChart from "./components/AllocationsChart";
import type {
  TAllocationData,
  TAllocationKeyData,
  TPerformanceRecord,
} from "@/types";
import { DataTable } from "@/components/DataTable/dataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { AllocationMetricsPanel } from "./components/AllocationMetricsPanel";
import { useAllocationByKey } from "@/queries/cryptoQueries";

export type TStatic = {
  title: string;
  total: string;
};

export default function Allocations() {
  const { pathname } = useLocation();
  const { setTitle } = useTitleStore();
  const [financialData, setFinancialData] = useState<TPerformanceRecord[]>([]);
  const [statics, setStatics] = useState<TStatic[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  const allocationSegment = pathname.split("/").pop()?.toLowerCase();
  const allocation =
    allocationSegment &&
    allocationSegment.length === 1 &&
    /[a-z]/.test(allocationSegment)
      ? allocationSegment
      : null;

  useEffect(() => {
    setTitle(
      allocation ? `Allocations ${allocation.toUpperCase()}` : "Allocations"
    );
    return () => setTitle("Dashboard");
  }, [pathname, setTitle, allocation]);

  const { data: allocationDataByKey } = useAllocationByKey(
    allocation?.toUpperCase() || ""
  );

  useEffect(() => {
    if (!allocation || !allocationDataByKey?.data) return;

    const { history, current_balance } =
      allocationDataByKey.data as TAllocationData;

    // Group history by date (ignoring time)
    const groupedByDate: { [key: string]: TAllocationKeyData[] } =
      history.reduce((acc: { [key: string]: TAllocationKeyData[] }, item) => {
        const date = item.minuteKey.split("-").slice(0, 3).join("-"); // Extract YYYY-MM-DD
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});

    // Aggregate data: average minute_gain and minute_gain_percent, take latest ending_balance and notes
    const aggregatedHistory = Object.keys(groupedByDate).map((date) => {
      const records = groupedByDate[date];
      const avgMinuteGain =
        records.reduce((sum, item) => sum + item.minute_gain, 0) /
        records.length;
      const avgMinuteGainPercent =
        records.reduce((sum, item) => sum + item.minute_gain_percent, 0) /
        records.length;
      // Sort by createdAt to get the latest record
      const latestRecord = records.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];

      return {
        date,
        minute_gain: avgMinuteGain,
        minute_gain_percent: avgMinuteGainPercent,
        ending_balance: latestRecord.ending_balance,
        notes: latestRecord.notes,
      };
    });

    // Format financial data for DataTable
    const formattedFinancialData: TPerformanceRecord[] = aggregatedHistory.map(
      (item) => ({
        date: item.date,
        balance: `$${item.ending_balance.toLocaleString()}`,
        dailyChange: `${item.minute_gain >= 0 ? "+" : "-"}$${Math.abs(
          item.minute_gain
        ).toLocaleString()}`,
        percentChange: `${item.minute_gain_percent >= 0 ? "+" : "-"}${Math.abs(
          item.minute_gain_percent
        )}%`,
        notes: item.notes,
      })
    );

    // Apply client-side pagination
    const startIndex = (page - 1) * limit;
    const paginatedData = formattedFinancialData.slice(
      startIndex,
      startIndex + limit
    );

    setFinancialData(paginatedData);

    // Calculate statistics
    const firstRecord = history[history.length - 1]; // Earliest record for starting balance
    const totalReturnPercent = aggregatedHistory.reduce(
      (sum, item) => sum + item.minute_gain_percent,
      0
    );
    const latestRecord = aggregatedHistory[0]; // Latest record for daily performance

    setStatics([
      {
        title: "Starting Balance",
        total: firstRecord
          ? `$${firstRecord.starting_balance.toLocaleString()}`
          : "$0",
      },
      {
        title: "Current Balance",
        total: `$${current_balance.toFixed(2)}`,
      },
      {
        title: "Daily Performance",
        total: latestRecord
          ? `${latestRecord.minute_gain >= 0 ? "+" : "-"}$${Math.abs(
              latestRecord.minute_gain
            ).toLocaleString()}`
          : "$0",
      },
      {
        title: "Total Return",
        total: `${
          totalReturnPercent >= 0 ? "+" : ""
        }${totalReturnPercent.toFixed(2)}%`,
      },
    ]);
  }, [allocation, allocationDataByKey, page, limit]);

  const columns: ColumnDef<TPerformanceRecord>[] = [
    {
      accessorKey: "date",
      header: "Date",
      enableHiding: true,
    },
    {
      accessorKey: "balance",
      header: "Balance",
      enableHiding: true,
    },
    {
      accessorKey: "dailyChange",
      header: "Daily Change",
      enableHiding: true,
    },
    {
      accessorKey: "percentChange",
      header: "%Change",
      enableHiding: true,
    },
    {
      accessorKey: "notes",
      header: "Notes",
      enableHiding: true,
    },
  ];

  return (
    <section className="space-y-4">
      {/* Chart Section */}
      <section className="section-container">
        <AllocationsChart allocation={allocation} />
      </section>

      {/* Allocation Overview Section */}
      <section className="section-container">
        <div>
          <div className="flex items-start justify-between">
            <h2 className="font-bold">
              Allocation {allocation?.toUpperCase()}:
              {allocation === "a"
                ? " Core Holdings"
                : allocation === "b"
                ? " Growth Strategy"
                : " Alternative Assets"}
            </h2>

            <div
              className={`
          size-4 rounded-full
          ${
            pathname.endsWith("/a")
              ? "bg-[#0867ED]"
              : pathname.endsWith("/b")
              ? "bg-[#00CA72]"
              : pathname.endsWith("/c")
              ? "bg-[#F2C916]"
              : ""
          } 
        `}
            ></div>
          </div>
          <p className="text-muted-foreground">
            Performance overview and daily tracking
          </p>
        </div>

        {/* Stats Grid - Made Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statics.map((item, i) => (
            <div key={i} className="border rounded-xl p-5">
              <p className="text-muted-foreground text-sm">{item.title}</p>
              <h1 className="font-bold text-2xl lg:text-4xl">{item.total}</h1>
            </div>
          ))}
        </div>

        {/* Allocation Metrics Panel */}
        {allocation && <AllocationMetricsPanel allocation={allocation} />}
      </section>

      {/* Daily Performance History Section - Fixed Container */}
      <section className="section-container">
        <div className="space-y-4">
          <h2 className="font-bold">Daily Performance History</h2>
          <div
            className="
            w-[15.9rem] 
            min-[330px]:w-[16.5rem] 
            min-[340px]:w-[17.1rem] 
            min-[350px]:w-[17.7rem] 
            min-[360px]:w-[18.3rem] 
            min-[370px]:w-[18.9rem] 
            min-[380px]:w-[19.5rem] 
            min-[390px]:w-[20.1rem] 
            min-[400px]:w-[20.7rem] 
            min-[410px]:w-[21.3rem] 
            min-[420px]:w-[21.9rem] 
            min-[430px]:w-[22.5rem] 
            min-[440px]:w-[23.1rem] 
            min-[450px]:w-[23.7rem] 
            min-[460px]:w-[24.3rem] 
            min-[470px]:w-full
          "
          >
            <DataTable<TPerformanceRecord>
              data={financialData}
              columns={columns}
              isLoading={!allocationDataByKey?.data?.history?.length}
              page={page}
              limit={limit}
              total={
                Object.keys(
                  allocationDataByKey?.data?.history.reduce(
                    (
                      acc: { [key: string]: boolean },
                      item: TAllocationKeyData
                    ) => {
                      const date = item.minuteKey
                        .split("-")
                        .slice(0, 3)
                        .join("-");
                      acc[date] = true;
                      return acc;
                    },
                    {} as { [key: string]: boolean }
                  ) || {}
                ).length
              }
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
