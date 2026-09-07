"use server";

import { apiFetch } from "@/lib/api/client";

export async function crearNotaConsulta(pacienteId: string, formData: FormData): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/pacientes/${pacienteId}/notas-consulta/`, {
    method: "POST",
    body: formData,
  });
  return { ok: response.ok };
}

interface CrearSesionActivaInput {
  pacienteId: string;
  empleadoId: string;
  estacionId: string;
  motivo: string;
  tipo: "consulta" | "grooming";
  inicio: string;
}

export async function crearSesionActiva(datos: CrearSesionActivaInput): Promise<{ ok: boolean }> {
  const response = await apiFetch("/api/sesiones-activas/", {
    method: "POST",
    body: JSON.stringify({
      paciente: datos.pacienteId,
      empleado: datos.empleadoId,
      estacion: datos.estacionId,
      motivo: datos.motivo,
      tipo: datos.tipo,
      inicio: datos.inicio,
    }),
  });
  return { ok: response.ok };
}
