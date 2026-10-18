import type { LucideIcon } from "lucide-react";
import {
  BarChart3, Bell, CalendarDays, FolderHeart, Home, LayoutGrid, PlusCircle, Receipt, Settings, Share2, ShoppingBag, Syringe,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Por frecuencia de uso en el día de la clínica: en móvil, los cuatro primeros son las pestañas
// y el resto va en "Más". Íconos de línea, sin huellas (manual de marca).
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/pacientes", label: "Pacientes", icon: FolderHeart },
  { href: "/registrar", label: "Registrar", icon: PlusCircle },
  { href: "/sala", label: "Sala", icon: LayoutGrid },
  { href: "/recordatorios", label: "Recordatorios", icon: Bell },
  { href: "/vacunas", label: "Vacunas", icon: Syringe },
  { href: "/reportes", label: "Reportes", icon: BarChart3 },
  { href: "/inventario", label: "Inventario", icon: ShoppingBag },
  { href: "/pedidos", label: "Pedidos", icon: Receipt },
  { href: "/compartidos", label: "Compartidos", icon: Share2 },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];
