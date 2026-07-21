"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const PRIMARY_ITEMS = NAV_ITEMS.slice(0, 4);
const OVERFLOW_ITEMS = NAV_ITEMS.slice(4);

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const overflowActive = OVERFLOW_ITEMS.some(({ href }) => pathname.startsWith(href));

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card lg:hidden">
        <div className="grid grid-cols-5">
          {PRIMARY_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
                  active ? "text-vera-emerald" : "text-muted-foreground",
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
                {label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
              overflowActive ? "text-vera-emerald" : "text-muted-foreground",
            )}
          >
            <MoreHorizontal size={20} strokeWidth={overflowActive ? 2.3 : 1.8} />
            Más
          </button>
        </div>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Más opciones</SheetTitle>
          </SheetHeader>
          <ul className="space-y-1 px-4 pb-6">
            {OVERFLOW_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <li key={href}>
                  <SheetClose asChild>
                    <Link
                      href={href}
                      className={cn(
                        "flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium",
                        active ? "bg-secondary text-vera-emerald" : "text-foreground",
                      )}
                    >
                      <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
                      {label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
}
