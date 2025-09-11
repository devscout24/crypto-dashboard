import { useTitleStore } from "@/stores/titleStore";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable/dataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogWrapper } from "@/components/DialogWrapper";
import { AlertDialogModal } from "@/components/AlertDialogModal";
import {
  useAllocations,
  useCreateAllocation,
  useDeleteAllocation,
  useUpdateAllocation,
} from "@/queries/cryptoQueries";
import PageLoader from "@/components/Loader";
import type { TAllocation } from "@/types";
import AllocationForm from "./AllocationForm";

export default function AllocationsManagementPage() {
  const { setTitle } = useTitleStore();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [isAddAllocationModalOpen, setIsAddAllocationModalOpen] =
    useState(false);
  const [isDeleteAllocationModalOpen, setIsDeleteAllocationModalOpen] =
    useState(false);

  const [allocationToEdit, setAllocationToEdit] = useState<TAllocation | null>(
    null
  );
  const [allocationToDeleteKey, setAllocationToDeleteKey] =
    useState<string>("");

  const { isPending, data } = useAllocations();
  const { mutate: deleteAllocation, isPending: isDeleteAllocationPending } =
    useDeleteAllocation();
  const { isPending: isCreateAllocationPending, mutate: createAllocation } =
    useCreateAllocation();
  const { isPending: isUpdateAllocationPending, mutate: updateAllocation } =
    useUpdateAllocation();

  useEffect(() => {
    setTitle("Allocation Management");
    return () => setTitle("Dashboard");
  }, [setTitle]);

  const columns: ColumnDef<TAllocation>[] = [
    {
      accessorKey: "index",
      header: "SL",
      enableHiding: true,
      size: 50,
      cell: ({ row }) => (
        <p className="text-muted-foreground">{row.index + 1}</p>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-center">Name</div>,
      enableHiding: true,
      size: 200,
      cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
      accessorKey: "key",
      header: () => <div className="text-center">Key</div>,
      enableHiding: true,
      size: 150,
      cell: ({ row }) => <div className="text-center">{row.original.key}</div>,
    },
    {
      accessorKey: "currentBalance",
      header: () => <div className="text-center">Starting Balance</div>,
      enableHiding: true,
      size: 200,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.currentBalance.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "endingBalance",
      header: () => <div className="text-center">Current Balance</div>,
      enableHiding: true,
      size: 200,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.endingBalance.toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created At</div>,
      enableHiding: true,
      size: 180,
      cell: ({ row }) => (
        <div className="text-center">
          {format(new Date(row.original.createdAt), "PPP")}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <span className="text-center">Actions</span>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <div className="px-2 flex items-center gap-2">
              <Button
                className="text-muted-foreground hover:text-primary hover:border-primary"
                variant={"outline"}
                size={"icon"}
                onClick={() => {
                  setIsAddAllocationModalOpen(true);
                  setAllocationToEdit(row.original);
                }}
              >
                <SquarePen className="duration-150" />
              </Button>
              <Button
                variant={"outline"}
                size={"icon"}
                className="text-muted-foreground hover:text-red-600 hover:border-red-600"
                onClick={() => {
                  setIsDeleteAllocationModalOpen(true);
                  setAllocationToDeleteKey(row.original.key);
                }}
              >
                <Trash className="duration-150" />
              </Button>
            </div>
          </div>
        );
      },
    },
  ];

  if (
    isDeleteAllocationPending ||
    isCreateAllocationPending ||
    isUpdateAllocationPending
  ) {
    return <PageLoader />;
  }

  return (
    <section className="section-container">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-foreground/80 text-sm md:text-lg">
          Total Allocations
          <span className="text-foreground text-sm md:text-[20px] font-bold ml-1">
            {data?.meta?.total}
          </span>
        </h1>

        <Button
          onClick={() => {
            setIsAddAllocationModalOpen(true);
            setAllocationToEdit(null);
          }}
        >
          <Plus />
          <span>Add Allocation</span>
        </Button>
      </div>

      <ScrollArea className="h-[78.5vh]">
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
          <DataTable<TAllocation>
            data={data?.data || []}
            columns={columns}
            isLoading={isPending}
            page={page}
            limit={limit}
            total={data?.meta?.total || 0}
            onPageChange={setPage}
            onLimitChange={setLimit}
            isPagination={false}
          />
        </div>
      </ScrollArea>

      {/* Create Allocation Modal */}
      <DialogWrapper
        isOpen={isAddAllocationModalOpen}
        onOpenChange={setIsAddAllocationModalOpen}
        title={allocationToEdit ? "Edit Allocation" : "Add New Allocation"}
      >
        <AllocationForm
          allocationToEdit={allocationToEdit ? allocationToEdit : undefined}
          onClose={() => setIsAddAllocationModalOpen(false)}
          createAllocation={createAllocation}
          updateAllocation={updateAllocation}
          isPending={isCreateAllocationPending || isUpdateAllocationPending}
        />
      </DialogWrapper>

      {/* Delete Allocation Modal */}
      <AlertDialogModal
        isOpen={isDeleteAllocationModalOpen}
        onOpenChange={setIsDeleteAllocationModalOpen}
        title="Delete Allocation"
        description="Are you sure you want to delete this allocation?"
        onConfirm={() => {
          deleteAllocation(allocationToDeleteKey);
          setIsDeleteAllocationModalOpen(false);
        }}
      />
    </section>
  );
}
