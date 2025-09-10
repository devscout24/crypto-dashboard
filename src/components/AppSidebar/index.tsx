import * as React from "react";
import {
  LayoutGrid,
  Clipboard,
  ShoppingBag,
  ShieldBan,
  Users,
  PlusCircle, // Import the PlusCircle icon
} from "lucide-react";
import { type Sidebar } from "@/components/ui/sidebar";
import NavSidebar from "./navSidebar";
import type { NavItem, TAllocation } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useAllocations } from "@/queries/cryptoQueries";
import { useProfile } from "@/queries/userQueries";

export default function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const currentUser = useAuth();

  const { data: userData } = useProfile();
  const { data } = useAllocations();

  const allocations =
    currentUser?.role === "ADMIN"
      ? data?.data &&
        data?.data.map((item: TAllocation) => ({
          title: item?.name,
          url: `/dashboard/allocations/${item.key.toLowerCase()}`,
        }))
      : userData?.data?.userAllocations.map((item) => ({
          title: item?.allocation?.name,
          url: `/dashboard/allocations/${item?.allocation?.key.toLowerCase()}`,
        }));

  const items: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutGrid />,
      end: true,
    },
    {
      title: "Report",
      url: "/dashboard/report",
      icon: <ShoppingBag />,
      end: true,
    },
    {
      title: "Allocations",
      icon: <Clipboard />,
      end: false,
      childLinks: allocations,
    },
  ];

  if (currentUser?.role === "ADMIN") {
    items.push({
      title: "User Management",
      url: "/dashboard/users",
      icon: <Users />,
      end: true,
    });
    items.push({
      title: "Data Forms",
      url: "/dashboard/create-data-forms",
      icon: <Clipboard />,
      end: true,
    });
    // Add the new "Add Allocation" button for admins
    items.push({
      title: "Allocation Management",
      url: "/dashboard/allocation-management",
      icon: <PlusCircle />,
      end: true,
    });
  }

  if (!currentUser) {
    items.push({ title: "Not Authorized User", icon: <ShieldBan /> });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section>
      <NavSidebar navItems={items} props={props} />
    </section>
  );
}
