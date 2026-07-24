import type { Reporte } from "@/lib/data/types";

export const REPORTES: Reporte[] = [
  {
    id: "rep1",
    servicioVisitaId: "s1",
    diagramaTipo: "perro",
    marcas: [
      { id: "m1", x: 30, y: 60, nota: "Aplicada en el cuarto trasero izquierdo" },
    ],
    fotos: [],
  },
  {
    id: "rep2",
    servicioVisitaId: "s6",
    diagramaTipo: "gato",
    marcas: [
      { id: "m2", x: 70, y: 45, nota: "Sin reacciones en el sitio de aplicación" },
    ],
    fotos: [],
  },
];
