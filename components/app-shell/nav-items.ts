import type { LucideIcon } from "lucide-react";
import { BarChart3, Bell, CalendarDays, Home, LayoutGrid, PawPrint, PlusCircle, Settings, Syringe } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/recordatorios", label: "Recordatorios", icon: Bell },
  { href: "/pacientes", label: "Pacientes", icon: PawPrint },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/vacunas", label: "Vacunas", icon: Syringe },
  { href: "/sala", label: "Sala", icon: LayoutGrid },
  { href: "/registrar", label: "Registrar", icon: PlusCircle },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];
