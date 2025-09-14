import { DataTable } from "@/components/DataTable/dataTable";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import {
  useAssetPerformanceData,
  useAssetPlatformsById,
  useDeleteAssetPerformance,
  useDeleteAssetPlatform,
} from "@/queries/assetPerformanceQueries";

// coins images
import ETH from "@/assets/icons/coins/Ethereum ETH.png";
import BTC from "@/assets/icons/coins/Group (1).png";
import T from "@/assets/icons/coins/Group (2).png";
import D from "@/assets/icons/coins/Group (3).png";
import Synthetix from "@/assets/icons/coins/Synthetix Network SNX.png";
import TrueUSD from "@/assets/icons/coins/TrueUSD TUSD.png";
import type { TAssetPerformance, TCoinData, TPlatform } from "@/types";
import { Button } from "@/components/ui/button";
import { DialogWrapper } from "@/components/DialogWrapper";
import AssetPerformanceForm from "@/pages/DataForms/components/AssetPerformanceForm";
import { AlertDialogModal } from "@/components/AlertDialogModal";
import AddAssetForm from "@/pages/DataForms/components/AddAssetForm";

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
  const [limit, setLimit] = useState<number>(10);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [isAddingPlatform, setIsAddingPlatform] = useState(false);
  const [isEditingAssetPerformance, setIsEditingAssetPerformance] =
    useState(false);
  const [selectedRowToEdit, setSelectedRowToEdit] = useState<TCoinData>({
    id: "",
    platformId: "",
    image: "",
    name: "",
    symbol: "",
    open: 0,
    close: 0,
    change: 0,
    volume: 0,
    volumeTrend: "up",
  });
  const [isDeletingAsset, setIsDeletingAsset] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<{
    id: string;
    platformId: string;
  }>({
    id: "",
    platformId: "",
  });

  const { data: assetPerformanceData, isPending } = useAssetPerformanceData();
  const { mutate: deleteAssetPerformance } = useDeleteAssetPerformance();
  const { mutate: deleteAssetPlatform } = useDeleteAssetPlatform();

  const stablecoin = assetPerformanceData?.data.find(
    (item: TAssetPerformance) => item.symbol === "Stablecoin"
  );

  const { data: assetPerformancePlatforms } = useAssetPlatformsById(
    stablecoin?.id || ""
  );

  const stablecoinPlatforms =
    assetPerformancePlatforms?.data.map((platform: TPlatform) => ({
      platformId: platform.id,
      image: coinImages[platform.symbol] || "",
      name: platform.name,
      symbol: platform.symbol,
      open: platform?.open || 0,
      close: platform?.close || 0,
      change: platform?.changePercent || 0,
      volume: platform?.changePercent || 0,
      volumeTrend: (platform?.changePercent || 0) >= 0 ? "up" : "down",
      active: platform?.active || false,
    })) || [];

  const formattedAssetPerformance =
    assetPerformanceData?.data &&
    assetPerformanceData?.data
      ?.filter((item: TAssetPerformance) => item.symbol !== "Stablecoin")
      .map((item: TAssetPerformance) => {
        return {
          id: item?.id,
          image: coinImages[item?.symbol],
          name: item?.name,
          symbol: item?.symbol,
          open: item?.open,
          close: item?.close,
          change: item?.change_percent,
          volume: item?.volume_usd,
          volumeTrend:
            item?.change_percent >= 0 ? ("up" as const) : ("down" as const),
        };
      });

  // Combine non-stablecoin assets with stablecoin platforms
  const tableData = [
    ...(formattedAssetPerformance || []),
    ...stablecoinPlatforms,
  ];

  const columns: ColumnDef<TCoinData>[] = [
    {
      accessorKey: "name",
      header: "Coin",
      enableHiding: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {/* <Avatar>
            <AvatarFallback className="text-white font-semibold">
              <img src={row.original.image} alt="" />
            </AvatarFallback>
          </Avatar> */}
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
      cell: ({ row }) => <p>{`${row.original.open}$`}</p>,
    },
    {
      accessorKey: "close",
      header: "Close",
      enableHiding: true,
      cell: ({ row }) => <p>{`${row.original.close}$`}</p>,
    },
    {
      accessorKey: "change",
      header: "Change",
      enableHiding: true,
      cell: ({ row }) => <p>{`${row.original.change}%`}</p>,
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
                <Button
                  variant={"outline"}
                  className=""
                  onClick={() => {
                    setIsDeletingAsset(true);
                    setAssetToDelete({
                      id: row.original.id || "",
                      platformId: row.original.platformId || "",
                    });
                  }}
                  title="Edit"
                >
                  <Trash size={16} />
                </Button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <section className="section-container h-full">
      {!fromAdmin && <h3 className="font-bold">Asset Performance Panel</h3>}

      {fromAdmin && (
        <div className="flex items-center justify-end gap-4">
          <Button onClick={() => setIsAddingAsset(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Asset
          </Button>
          <Button onClick={() => setIsAddingPlatform(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Stablecoin
          </Button>
        </div>
      )}

      <div>
        <DataTable<TCoinData>
          data={tableData || []}
          columns={columns}
          isLoading={isPending}
          page={page}
          limit={limit}
          total={tableData?.length}
          onPageChange={setPage}
          onLimitChange={setLimit}
          isPagination={false}
        />
      </div>

      {/* Add Asset Dialog */}
      <DialogWrapper
        isOpen={isAddingAsset}
        onOpenChange={setIsAddingAsset}
        onCancel={() => setIsAddingAsset(false)}
        title="Add New Asset"
      >
        <AddAssetForm
          isPlatform={false}
          onClose={() => setIsAddingAsset(false)}
        />
      </DialogWrapper>

      {/* Add Platform Dialog */}
      <DialogWrapper
        isOpen={isAddingPlatform}
        onOpenChange={setIsAddingPlatform}
        onCancel={() => setIsAddingPlatform(false)}
        title="Add New Platform"
      >
        <AddAssetForm
          isPlatform={true}
          onClose={() => setIsAddingPlatform(false)}
        />
      </DialogWrapper>

      {/* edit asset performance dialog */}
      <DialogWrapper
        isOpen={isEditingAssetPerformance}
        onOpenChange={setIsEditingAssetPerformance}
        onCancel={() => setIsEditingAssetPerformance(false)}
        title="Edit Asset Performance"
      >
        <AssetPerformanceForm
          selectedRowToEdit={selectedRowToEdit}
          onClose={() => setIsEditingAssetPerformance(false)}
        />
      </DialogWrapper>

      {/* delete asset performance alert dialog */}
      <AlertDialogModal
        isOpen={isDeletingAsset}
        onOpenChange={setIsDeletingAsset}
        title="Delete Asset Performance"
        description="Are you sure you want to delete this asset performance?"
        onConfirm={() => {
          if (assetToDelete && assetToDelete.id) {
            deleteAssetPerformance(assetToDelete?.id || "", {
              onSuccess: () => {
                setIsDeletingAsset(false);
              },
            });
          } else if (assetToDelete && assetToDelete.platformId) {
            deleteAssetPlatform(assetToDelete?.platformId || "", {
              onSuccess: () => {
                setIsDeletingAsset(false);
              },
            });
          }
        }}
      />
    </section>
  );
}
