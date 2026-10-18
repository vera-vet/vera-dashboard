"use client";

import type { Empleado, Estacion, Rol } from "@/lib/data/types";
import { ListaEditable } from "./lista-editable";
import { borrarEmpleado, borrarEstacion, guardarEmpleado, guardarEstacion } from "./actions";

const ROLES: { value: Rol; label: string }[] = [
  { value: "vet", label: "Veterinario/a" },
  { value: "secretaria", label: "Recepción" },
  { value: "groomer", label: "Groomer" },
];

const TIPOS_ESTACION = [
  { value: "consultorio", label: "Consultorio" },
  { value: "bano", label: "Baño (grooming)" },
];

export function EquipoSection({ empleados, esAdmin }: { empleados: Empleado[]; esAdmin: boolean }) {
  return (
    <ListaEditable
      titulo="Equipo"
      singular="Integrante"
      etiquetaCategoria="Rol"
      opciones={ROLES}
      items={empleados.map((e) => ({ id: e.id, nombre: e.nombre, categoria: e.rol }))}
      esAdmin={esAdmin}
      textoVacio="Agrega a quienes atienden: aparecen al iniciar una sesión en Sala y en las grabaciones de consulta."
      guardar={(id, { nombre, categoria }) => guardarEmpleado(id, { nombre, rol: categoria as Rol })}
      borrar={borrarEmpleado}
      avisoAlBorrar="Sus sesiones abiertas en Sala se cierran; sus transcripciones se conservan sin su nombre."
    />
  );
}

export function ConsultoriosSection({ estaciones, esAdmin }: { estaciones: Estacion[]; esAdmin: boolean }) {
  return (
    <ListaEditable
      titulo="Consultorios"
      singular="Consultorio"
      etiquetaCategoria="Tipo"
      opciones={TIPOS_ESTACION}
      items={estaciones.map((e) => ({ id: e.id, nombre: e.nombre, categoria: e.tipo }))}
      esAdmin={esAdmin}
      textoVacio="Agrega los consultorios y baños de la clínica: son las tarjetas de Sala."
      guardar={(id, { nombre, categoria }) => guardarEstacion(id, { nombre, tipo: categoria as "consultorio" | "bano" })}
      borrar={borrarEstacion}
      avisoAlBorrar="Si hay una sesión abierta ahí, se cierra."
    />
  );
}
