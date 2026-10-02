import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VaccineTimeline } from "./vaccine-timeline";
import type { ServicioVisita } from "@/lib/data/types";

const servicio = (producto: string, fecha: string): ServicioVisita => ({
  id: producto, pacienteId: "1", tipo: "vacuna", producto, fecha, vet: "Dra. Molina", aplicada: true, reporte: undefined,
});

describe("VaccineTimeline", () => {
  it("ordena las dosis de la más antigua a la más reciente", () => {
    const html = renderToStaticMarkup(
      <VaccineTimeline
        servicios={[servicio("3ª dosis", "2026-01-07"), servicio("1ª dosis", "2025-11-26"), servicio("2ª dosis", "2025-12-17")]}
        vacunasCompletas={3}
        vacunasTotal={3}
      />,
    );

    expect(html.indexOf("1ª dosis")).toBeLessThan(html.indexOf("2ª dosis"));
    expect(html.indexOf("2ª dosis")).toBeLessThan(html.indexOf("3ª dosis"));
  });

  it("deja fuera lo que no es vacuna", () => {
    const html = renderToStaticMarkup(
      <VaccineTimeline
        servicios={[{ ...servicio("Consulta por otitis", "2026-03-16"), tipo: "consulta" }, servicio("Rabia", "2026-01-28")]}
        vacunasCompletas={1}
        vacunasTotal={1}
      />,
    );

    expect(html).toContain("Rabia");
    expect(html).not.toContain("Consulta por otitis");
  });
});
