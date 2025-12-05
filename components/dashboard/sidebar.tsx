// src/components/dashboard/sidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  PanelLeft, // Icon for the toggle button
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Queue Management", href: "/queue-management", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

// 1. Define the interface for the new props
interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// 2. Accept props in the component definition
export function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      // 3. Dynamically adjust width based on state with smooth transition
      className={cn(
        "bg-[#1B4D3E] text-white flex flex-col shadow-lg transition-all duration-300 ease-in-out z-10 relative",
        isSidebarOpen ? "w-64" : "w-[70px] items-center"
      )}
    >
      {/* Header: Logo & Toggle Button */}
      <div
        className={cn(
          "flex items-center p-4 mb-2",
          isSidebarOpen ? "justify-between" : "justify-center"
        )}
      >
        {/* Logo & Title - Hidden when collapsed */}
        {isSidebarOpen && (
          <div className="flex items-center transition-opacity duration-300">
            <div className="rounded-lg p-1.5 mr-3">
              {/* Ensure you have this image or comment it out */}
              <Image
                src="/logos/queuely_light_logo.svg"
                alt="Admin Logo"
                width={40}
                height={40}
              />
            </div>
            <span className="text-lg text-[30px] font-bold whitespace-nowrap text-[#E8F3E8]">Admin</span>
          </div>
        )}

        {/* 4. The Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white/70 hover:text-white hover:bg-white/10"
          aria-label="Toggle Sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          // The link itself consists of icon + text
          const LinkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center py-2.5 rounded-lg transition-colors group relative",
                // Adjust padding based on open state
                isSidebarOpen ? "px-4" : "justify-center px-2",
                isActive
                  ? "bg-[#E8F3E8] text-[#1B4D3E]"
                  : "text-gray-300 hover:bg-white/[0.08] hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isSidebarOpen && "mr-3")} />
              {/* 5. Conditionally hide text labels with transition */}
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap transition-all duration-300",
                  isSidebarOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 absolute left-16 hidden"
                  // Using 'hidden' here for the collapsed state prevents layout shifts
                )}
              >
                {item.name}
              </span>
            </Link>
          );

          // 6. Wrap in Tooltip only if collapsed
          return isSidebarOpen ? (
            <div key={item.name}>{LinkContent}</div>
          ) : (
            <Tooltip key={item.name} delayDuration={0}>
              <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
              {/* Tooltip appears to the right of the sidebar */}
              <TooltipContent side="right" className="bg-[#0A1D56] text-white border-white/10 font-medium ml-2">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 mt-auto">
        {isSidebarOpen && <Separator className="mb-4 bg-white/[0.1]" />}
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            isSidebarOpen ? "space-x-3" : "justify-center flex-col space-y-4"
          )}
        >
          <Avatar className="border-2 border-white/10">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CA</AvatarFallback>
          </Avatar>

          {/* User details - Hidden when collapsed */}
          {isSidebarOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate">Cartethyia</p>
              <p className="text-xs text-gray-400 truncate">
                smolcarte@gmail.com
              </p>
            </div>
          )}

          {/* Logout button (wrapped in tooltip for collapsed state) */}
          {isSidebarOpen ? (
             <Button
             variant="ghost"
             size="icon"
             className="text-gray-400 hover:bg-white/[0.08] hover:text-white shrink-0"
           >
             <LogOut className="h-5 w-5" />
           </Button>
          ) : (
             <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                 <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:bg-white/[0.08] hover:text-white shrink-0 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-[#0A1D56] text-white border-white/10 font-medium ml-2">Logout</TooltipContent>
             </Tooltip>
          )}

        </div>
      </div>
    </aside>
  );
}