import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { getMe } from "@/lib/data/usuario";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Si /me falla, el shell se muestra sin el nombre de la clínica en vez de romper todo el panel.
  const usuario = await getMe().catch(() => null);
  return <AppShell clinicaNombre={usuario?.clinicaNombre ?? ""}>{children}</AppShell>;
}
