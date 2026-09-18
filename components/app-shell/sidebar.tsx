"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/session/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-primary text-primary-foreground lg:flex">
      <div className="flex items-center gap-2.5 px-6 pb-6 pt-8">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-vera-emerald text-primary">
          <span className="font-display text-[15px] font-bold">V</span>
        </div>
        <span className="font-display text-lg font-bold tracking-tight">Vera</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                active ? "bg-vera-emerald/20 text-primary-foreground" : "text-primary-foreground/70 hover:bg-primary-foreground/5",
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between border-t border-primary-foreground/10 px-6 py-4">
        <span className="text-xs text-primary-foreground/60">Vet. San Rafael</span>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={handleLogout}
            className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground/70 transition-colors hover:bg-primary-foreground/5 hover:text-primary-foreground"
            aria-label="Cerrar sesión"
          >
            <LogOut size={18} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}
