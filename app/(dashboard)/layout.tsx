// src/app/(dashboard)/layout.tsx
"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Define the state for the sidebar (default to open)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. Create a toggle function
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Wrap everything in TooltipProvider for the sidebar tooltips to work
    <TooltipProvider>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden">
        {/* 3. Pass the state and toggle function to the Sidebar component */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content Area - flex-1 makes it fill remaining space automatically */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden bg-gray-50/50 relative">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}