"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/header/site-header";
import { sidebarRoute } from "@/routes/routes";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <SiteHeader routes={sidebarRoute} />
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
