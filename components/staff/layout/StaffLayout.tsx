"use client";

import React, { useState } from "react";
import { StaffSidebar } from "./StaffSidebar";
import { StaffHeader } from "./StaffHeader";
import { AuthGuard } from "./AuthGuard";
import { Permission } from "@/types/portal";

interface StaffLayoutProps {
  children: React.ReactNode;
  requiredPermissions?: Permission[];
}

export function StaffLayout({ children, requiredPermissions }: StaffLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard requiredPermissions={requiredPermissions}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        <StaffSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-72 flex flex-col flex-1">
          <StaffHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

