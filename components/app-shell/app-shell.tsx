import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1200px] px-4 pb-28 pt-6 lg:px-10 lg:pb-10 lg:pt-10">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
