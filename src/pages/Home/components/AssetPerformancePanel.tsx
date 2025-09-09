import { DataTable } from "@/components/DataTable/dataTable";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { DialogWrapper } from "@/components/DialogWrapper";
import AssetPerformanceForm from "@/pages/DataForms/components/AssetPerformanceForm";

const coinImages: { [key: string]: string } = {
  ETH,
  BTC,
  TUSD: TrueUSD,
  USDT: T,
  DAI: D,
  SUSD: Synthetix,
};

export default function AssetPerformancePanel({
  fromAdmin = false,
}: {
  fromAdmin?: boolean;
}) {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(15);
  const [isEditingAssetPerformance, setIsEditingAssetPerformance] =
    useState(false);
  const [selectedRowToEdit, setSelectedRowToEdit] = useState<TCoinData>({
    image: "",
    name: "",
    symbol: "",
    open: 0,
    close: 0,
    change: 0,
    volume: 0,
    volumeTrend: "up",
  });

  const { data: assetPerformanceData, isPending } = useAssetPerformanceData();

  const stablecoin: TAssetPerformanceResponse = assetPerformanceData?.data.find(
    (item: TAssetPerformanceResponse) => item.symbol === "Stablecoin"
  );

  const formattedAssetPerformance =
    assetPerformanceData?.data &&
    assetPerformanceData?.data
      ?.filter(
        (item: TAssetPerformanceResponse) => item.symbol !== "Stablecoin"
      )
      .map((item: TAssetPerformanceResponse) => {
        return {
          image: coinImages[item?.symbol],
          name: item?.symbol,
          symbol: item?.symbol,
          open: item?.open,
          close: item?.close,
          change: item?.change_percent,
          volume: item?.volume_usd,
          volumeTrend:
            item?.change_percent >= 0 ? ("up" as const) : ("down" as const),
        };
      });

  const columns: ColumnDef<TCoinData>[] = [
    {
      accessorKey: "name",
      header: "Coin",
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
        <div className="flex items-center gap-2">
          <p>{row.original.symbol}</p>
        </div>
      ),
    },
    {
      accessorKey: "open",
      header: "Open",
      enableHiding: true,
      cell: ({ row }) => <p>{`+${row.original.open}$`}</p>,
    },
    {
      accessorKey: "close",
      header: "Close",
      enableHiding: true,
      cell: ({ row }) => <p>{`+${row.original.close}$`}</p>,
    },
    {
      accessorKey: "change",
      header: "Change",
      enableHiding: true,
      cell: ({ row }) => <p>{`+${row.original.change}%`}</p>,
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
    ...(fromAdmin
      ? [
          {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }: { row: { original: TCoinData } }) => (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant={"outline"}
                  className=""
                  onClick={() => {
                    setIsEditingAssetPerformance(true);
                    setSelectedRowToEdit(row.original);
                  }}
                  title="Edit"
                >
                  <Pencil size={16} />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <section className="section-container h-full">
      <h3 className="font-bold">Asset Performance Panel</h3>
      <div>
        <DataTable<TCoinData>
          data={formattedAssetPerformance || []}
          columns={columns}
          isLoading={isPending}
          page={page}
          limit={limit}
          total={formattedAssetPerformance?.length}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isPagination={false}
        />
      </div>

      {/* Stablecoin Yield Matrix */}
      {stablecoin && (
        <div className="rounded-2xl border p-4 shadow-sm">
          <h4 className="font-semibold mb-2">Stablecoin Yield Matrix</h4>
          <p className="text-sm mb-3">
            Current Yield:{" "}
            <span className="font-bold text-green-600">
              +{stablecoin.change_percent}%
            </span>
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>USDC → Clearpool</li>
            <li>USDT → Maple Prime</li>
            <li>DAI → Frax Treasury Optimizer</li>
          </ul>
        </div>
      )}

      {/* edit asset performance dialog */}
      <DialogWrapper
        isOpen={isEditingAssetPerformance}
        onOpenChange={setIsEditingAssetPerformance}
        title="Edit Asset Performance"
      >
        <AssetPerformanceForm selectedRowToEdit={selectedRowToEdit} />
      </DialogWrapper>
    </section>
  );
}
