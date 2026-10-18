"use client";

import { useRef, useState } from "react";
import type { Paciente } from "@/lib/data/types";
import { buscarPacientes } from "@/app/(dashboard)/registrar/actions";

/**
 * Búsqueda de pacientes (mascota, dueño o teléfono) con debounce. Las respuestas que llegan
 * tarde, de una búsqueda ya reemplazada, se descartan.
 */
export function useBusquedaPacientes() {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ultimaRef = useRef("");

  function buscar(texto: string) {
    setQuery(texto);
    ultimaRef.current = texto;
    setError(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (texto.trim().length < 2) {
      setResultados([]);
      setBuscando(false);
      return;
    }
    setBuscando(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const encontrados = await buscarPacientes(texto);
        if (ultimaRef.current === texto) setResultados(encontrados);
      } catch {
        if (ultimaRef.current === texto) setError(true);
      } finally {
        if (ultimaRef.current === texto) setBuscando(false);
      }
    }, 250);
  }

  function limpiar() {
    buscar("");
  }

  const sinResultados = !buscando && !error && query.trim().length >= 2 && resultados.length === 0;
  return { query, resultados, buscando, error, sinResultados, buscar, limpiar };
}
