import {
  Home,
  Globe2,
  ListOrdered,
  SidebarIcon,
  ChevronRight,
  ChevronDown,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "./ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";
import { CommandDialogDemo } from "./command-k";

const menuItems = [
  { title: "Dashboard", url: "#", icon: Home },
  {
    title: "By Location",
    icon: Globe2,
    children: [
      { title: "Regions", url: "#" },
      { title: "Countries", url: "#" },
    ],
  },
  {
    title: "By Category",
    icon: ListOrdered,
    children: [
      { title: "Sector", url: "#" },
      { title: "Pistle", url: "#" },
      { title: "Topic", url: "#" },
    ],
  },
  {
    title: "By Time",
    icon: Calendar,
    url: "#",
  },
];

export function AppSidebar() {
  const setSidebarOpen = useSidebar().setOpen;
  const setMobileOpen = useSidebar().toggleSidebar;
  const [isStatic, setIsStatic] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div
      onMouseEnter={() => !isStatic && setSidebarOpen(true)}
      onMouseLeave={() => !isStatic && setSidebarOpen(false)}
      className="relative flex"
    >
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-4">
                {menuItems.map((item) =>
                  item.children ? (
                    <Collapsible
                      key={item.title}
                      defaultOpen={false}
                      onOpenChange={(isOpen) =>
                        setExpanded((prev) => ({ ...prev, [item.title]: isOpen }))
                      }
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            <item.icon />
                            <span className="text-lg">{item.title}</span>
                            <span className="ml-auto text-lg transition-transform">
                              {expanded[item.title] ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </span>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((subItem) => (
                              <SidebarMenuSubItem
                                key={subItem.title}
                                className="hover:bg-sidebar-accent text-md flex rounded-sm px-2 py-1"
                              >
                                <a href={subItem.url} className="w-full">
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ) : (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span className="text-lg">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuItem key="Open Spotlight">
            <SidebarMenuButton asChild>
              <CommandDialogDemo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarFooter>
      </Sidebar>
      {/* Sidebar Toggle Button */}
      <Button
        size="icon"
        onClick={() => setMobileOpen()}
        className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent absolute right-[-2.5em] bottom-4 z-10 rounded-l-none sm:hidden"
      >
        <SidebarIcon />
      </Button>
      <Button
        size="icon"
        onClick={() => setIsStatic(!isStatic)}
        className="bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent absolute right-[-2.5em] bottom-4 z-10 hidden rounded-l-none sm:flex"
      >
        <SidebarIcon />
      </Button>
    </div>
  );
}
