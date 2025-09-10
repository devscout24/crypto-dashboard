import { useDeleteUser, useSingleUser, useUsers } from "@/queries/userQueries";
import { useTitleStore } from "@/stores/titleStore";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable/dataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye, Plus, SquarePen, Trash } from "lucide-react";
import AddUserForm from "./components/AddUserForm";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogWrapper } from "@/components/DialogWrapper";
import { AlertDialogModal } from "@/components/AlertDialogModal";
import UserDetails from "./components/UserDetails";
import AssignUnassignToAllocation from "./components/AssignUnassignToAllocation";
import type { TUserData } from "@/types";
import PageLoader from "@/components/Loader";

export default function Users() {
  const { setTitle } = useTitleStore();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const { isPending, data } = useUsers({
    page,
    limit,
  });

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isViewUserModalOpen, setIsViewUserModalOpen] = useState(false);

  const [userToEditId, setUserToEditId] = useState<string>("");
  const [userToDeleteId, setUserToDeleteId] = useState<string>("");
  const [userToViewId, setUserToViewId] = useState<string>("");

  const { mutate: deleteUser, isPending: isDeleteUserPending } =
    useDeleteUser();
  const userId = userToEditId ? userToEditId : undefined;
  const { isPending: isUserPending } = useSingleUser(userId ?? "");

  useEffect(() => {
    setTitle("User Management");
    return () => setTitle("Dashboard");
  }, [setTitle]);

  const columns: ColumnDef<TUserData>[] = [
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
      accessorKey: "fullName",
      header: () => <div className="text-center">Full Name</div>,
      enableHiding: true,
      size: 200,
      cell: ({ row }) => (
        <div className="text-center">{row.original.fullName}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="text-center">Email</div>,
      enableHiding: true,
      size: 200,
      cell: ({ row }) => (
        <div className="text-center">{row.original.email}</div>
      ),
    },
    {
      accessorKey: "isStatus",
      header: () => <div className="text-center">Status</div>,
      size: 150,
      cell: ({ row }) => (
        <div className="text-center">
          <Badge variant={row.getValue("isStatus") ? "default" : "destructive"}>
            {row.getValue("isStatus") ? "Active" : "Inactive"}
          </Badge>
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
      accessorKey: "role",
      header: () => <div className="text-center">Role</div>,
      enableHiding: true,
      size: 180,
      cell: ({ row }) => <div className="text-center">{row.original.role}</div>,
    },
    // Assign/Unassign User to Allocation
    {
      id: "allocations",
      header: () => <div className="text-center">Allocations</div>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <AssignUnassignToAllocation userData={row?.original} />
          </div>
        );
      },
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
                variant={"outline"}
                size={"icon"}
                className="text-muted-foreground hover:text-primary hover:border-primary"
                onClick={() => {
                  setIsViewUserModalOpen(true);
                  setUserToViewId(row.original.id);
                }}
              >
                <Eye className="duration-150" />
              </Button>
              <Button
                className="text-muted-foreground hover:text-primary hover:border-primary"
                variant={"outline"}
                size={"icon"}
                onClick={() => {
                  setIsAddUserModalOpen(true);
                  setUserToEditId(row.original.id);
                }}
              >
                <SquarePen className="duration-150" />
              </Button>
              <Button
                variant={"outline"}
                size={"icon"}
                className="text-muted-foreground hover:text-red-600 hover:border-red-600"
                onClick={() => {
                  setIsDeleteUserModalOpen(true);
                  setUserToDeleteId(row.original.id);
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

  if (isUserPending || isDeleteUserPending) {
    return <PageLoader />;
  }

  return (
    <section className="section-container">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-foreground/80 text-sm md:text-lg">
          Total Users
          <span className="text-foreground text-sm md:text-[20px] font-bold ml-1">
            {data?.meta?.total}
          </span>
        </h1>

        <Button
          onClick={() => {
            setIsAddUserModalOpen(true);
            setUserToEditId("");
          }}
        >
          <Plus />
          <span>Add User</span>
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
          <DataTable<TUserData>
            data={data?.data || []}
            columns={columns}
            isLoading={isPending}
            page={page}
            limit={limit}
            total={data?.meta?.total || 0}
            onPageChange={setPage}
            onLimitChange={setLimit}
            isPagination={true}
          />
        </div>
      </ScrollArea>

      {/* Create User Modal */}
      <DialogWrapper
        isOpen={isAddUserModalOpen}
        onOpenChange={setIsAddUserModalOpen}
        title={userToEditId ? "Edit User" : "Add New User"}
      >
        <AddUserForm
          onClose={() => setIsAddUserModalOpen(false)}
          userId={userToEditId ? userToEditId : undefined}
        />
      </DialogWrapper>

      {/* Delete User Modal */}
      <AlertDialogModal
        isOpen={isDeleteUserModalOpen}
        onOpenChange={setIsDeleteUserModalOpen}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        onConfirm={() => {
          deleteUser(userToDeleteId);
          setIsDeleteUserModalOpen(false);
        }}
      />

      {/* View User Details */}
      <UserDetails
        isOpen={isViewUserModalOpen}
        onOpenChange={setIsViewUserModalOpen}
        userId={userToViewId}
      />
    </section>
  );
}
