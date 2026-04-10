"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AuthSync } from "./auth/AuthSync";
import { AuthProvider } from "./auth/AuthContext";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  return (
    <SidebarProvider>
      <AuthProvider>
        <AuthSync />
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
        <Toaster />
      </AuthProvider>
    </SidebarProvider>
  );
}
