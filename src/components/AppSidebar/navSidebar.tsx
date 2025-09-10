import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import NavUser from "./navUser";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight, X } from "lucide-react";
import type { NavItem } from "@/types";
import logo from "@/assets/image/logo.svg";

export default function NavSidebar({
  navItems,
  ...props
}: {
  navItems: NavItem[];
  props: React.ComponentProps<typeof Sidebar>;
}) {
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <div className="pb-8 pt-3 flex items-center justify-center">
          {state === "collapsed" ? (
            <h1 className="lg:w-[180px] text-[24px] font-bold lg:text-center mr-3 mt-1 rounded-full  text-white flex justify-center items-center">
              <img className="w-[30px]" src={logo} alt="" />
            </h1>
          ) : (
            <h1 className="lg:w-[180px] text-[24px] font-bold lg:text-center text-primary flex justify-center items-center ">
              Vault
              <img className="w-[30px]" src={logo} alt="" />
            </h1>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-end absolute top-2 right-2 "
        >
          <X />
        </button>

        <SidebarMenu className="-mt-2.5">
          {navItems.map((item, i) =>
            item.childLinks ? (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
                defaultOpen={true}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item?.title}
                      className={`w-full hover:bg-gradient-to-r from-primary/50 to-primary/10 text-foreground rounded-none py-6`}
                    >
                      <span className="!size-7 transition-colors">
                        {item.icon}
                      </span>
                      <h4 className="text-lg duration-300 w-full min-w-0">
                        <span className="truncate block">{item.title}</span>
                      </h4>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {item.childLinks?.map((subItem) => (
                      <NavLink
                        key={subItem.title}
                        to={subItem?.url as string}
                        className={({ isActive }) =>
                          `w-full ${
                            isActive
                              ? "bg-white text-primary"
                              : "text-[#797979]"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton
                                asChild
                                className={`w-full hover:bg-gradient-to-r from-primary/50 to-primary/10 text-foreground rounded-none py-4 ${
                                  isActive
                                    ? "bg-gradient-to-r from-primary/50 to-primary/0 text-foreground shadow-sm"
                                    : ""
                                }`}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        )}
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={i}>
                <NavLink
                  to={item?.url as string}
                  end={item?.end}
                  className={({ isActive }) =>
                    `w-full ${
                      isActive ? "bg-white text-primary" : "text-[#797979]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <SidebarMenuButton
                      tooltip={item?.title}
                      className={`w-full hover:bg-gradient-to-r from-primary/50 to-primary/10 text-foreground rounded-none py-6 ${
                        isActive
                          ? "bg-gradient-to-r from-primary/50 to-primary/0 text-foreground shadow-sm"
                          : ""
                      }`}
                    >
                      <span className="!size-7 transition-colors">
                        {item.icon}
                      </span>
                      <h4 className="text-lg duration-300 w-full min-w-0">
                        <span className="truncate block">{item.title}</span>
                      </h4>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
