"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const ESTILOS = {
  // Sobre el verde de la barra lateral: igual que el botón de cerrar sesión (antes era un círculo
  // blanco que tapaba el nombre de la clínica).
  sidebar: "grid h-9 w-9 place-items-center rounded-xl text-primary-foreground/70 transition-colors hover:bg-primary-foreground/5 hover:text-primary-foreground",
  suelto: "grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-transform hover:scale-105",
};

export function ThemeToggle({ variante = "suelto", className }: { variante?: keyof typeof ESTILOS; className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={variante === "sidebar" ? "h-9 w-9" : "h-11 w-11"} aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className={cn(ESTILOS[variante], className)}
    >
      {isDark ? <Sun size={variante === "sidebar" ? 18 : 16} strokeWidth={1.8} /> : <Moon size={variante === "sidebar" ? 18 : 16} strokeWidth={1.8} />}
    </button>
  );
}
