import { DataTable } from "@/components/DataTable/dataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useAssetPerformanceData } from "@/queries/assetPerformanceQueries";

// coins images
import ETH from "@/assets/icons/coins/Ethereum ETH.png";
import BTC from "@/assets/icons/coins/Group (1).png";
import T from "@/assets/icons/coins/Group (2).png";
import D from "@/assets/icons/coins/Group (3).png";
import Synthetix from "@/assets/icons/coins/Synthetix Network SNX.png";
import TrueUSD from "@/assets/icons/coins/TrueUSD TUSD.png";
import type { TAssetPerformanceResponse, TCoinData } from "@/types";

const coinImages: { [key: string]: string } = {
  ETH,
  BTC,
  TUSD: TrueUSD,
  USDT: T,
  DAI: D,
  SUSD: Synthetix,
};

export default function AssetPerformancePanel(): React.ReactNode {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);

  const { data: assetPerformanceData, isPending } =
    useAssetPerformanceData(120);

  const latestAssets: { [key: string]: TAssetPerformanceResponse } = {};

  assetPerformanceData?.data?.forEach((perf: TAssetPerformanceResponse) => {
    if (
      !latestAssets[perf.symbol] ||
      new Date(perf.datetime) > new Date(latestAssets[perf.symbol].datetime)
    ) {
      latestAssets[perf.symbol] = perf;
    }
  });

  const formattedAssetPerformance = Object.keys(latestAssets).map((key) => {
    const coin = latestAssets[key];
    return {
      image: coinImages[key],
      name: key,
      symbol: coin.symbol,
      open: coin.open,
      close: coin.close,
      change: coin.change_percent,
      volume: coin.volume_usd,
      volumeTrend:
        coin.change_percent >= 0 ? ("up" as const) : ("down" as const),
    };
  });

  const columns: ColumnDef<TCoinData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback className="text-white font-semibold">
              <img src={row.original.image} alt="" />
            </AvatarFallback>
          </Avatar>
          <p>{row.original.name}</p>
        </div>
      ),
    },
    {
      accessorKey: "symbol",
      header: "",
      enableHiding: true,
      cell: ({ row }) => (
        <p className="text-muted-foreground">{row.original.symbol}</p>
      ),
    },
    {
      accessorKey: "open",
      header: "Open",
      enableHiding: true,
      cell: ({ row }) => <p>{`+${row.original.open}`}</p>,
    },
    {
      accessorKey: "close",
      header: "Close",
      enableHiding: true,
      cell: ({ row }) => <p>{`+${row.original.close}`}</p>,
    },
    {
      accessorKey: "change",
      header: "Change",
      enableHiding: true,
      cell: ({ row }) => <p>{`+${row.original.change}`}</p>,
    },
    {
      accessorKey: "volume",
      header: "Volume",
      enableHiding: true,
      cell: ({ row }) => (
        <div
          className={`
          flex items-center justify-center
          ${
            row.original.volumeTrend === "up"
              ? "text-green-500"
              : "text-red-500"
          }
        `}
        >
          <p>{`${(row.original.volume / 1000000).toFixed(2)}M`}</p>
          <div>
            {row.original.volumeTrend === "up" ? <ArrowUp /> : <ArrowDown />}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="section-container h-full">
      <h3 className="font-bold">Asset Performance Panel</h3>
      <div>
        <DataTable<TCoinData>
          data={formattedAssetPerformance}
          columns={columns}
          isLoading={isPending}
          page={page}
          limit={limit}
          total={Object.keys(latestAssets).length}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isPagination={false}
        />
      </div>
    </section>
  );
}
