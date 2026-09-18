import type { ReactNode } from "react";

export default function TiendaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4">
        <h1 className="font-display text-xl font-bold text-vera-forest">Tienda</h1>
      </header>
      <main className="mx-auto max-w-[600px] px-4 py-6">{children}</main>
    </div>
  );
}
