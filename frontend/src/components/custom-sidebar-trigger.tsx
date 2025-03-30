import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { SidebarIcon } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      size="icon"
      onClick={toggleSidebar}
      className="hover:bg-sidebar-accent hover:text-sidebar-foreground bg-sidebar text-sidebar-foreground absolute bottom-2 z-10 -translate-x-[1px] rounded-l-none border-l-0 p-4 pl-4"
    >
      <SidebarIcon />
    </Button>
  );
}
