"use client";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider defaultOpen={false}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </SidebarProvider>
    </SessionProvider>
  );
}
