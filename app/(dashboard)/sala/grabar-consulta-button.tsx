"use client";

import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";
import { crearNotaConsulta } from "./actions";

type Estado = "idle" | "grabando" | "subiendo" | "listo" | "error";

export function GrabarConsultaButton({ pacienteId, empleadoId }: { pacienteId: string; empleadoId: string }) {
  const [estado, setEstado] = useState<Estado>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function iniciarGrabacion() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      setEstado("subiendo");
      const formData = new FormData();
      formData.append("audio", audioBlob, "consulta.webm");
      formData.append("empleado", empleadoId);
      const resultado = await crearNotaConsulta(pacienteId, formData);
      setEstado(resultado.ok ? "listo" : "error");
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setEstado("grabando");
  }

  function detenerGrabacion() {
    mediaRecorderRef.current?.stop();
  }

  if (estado === "idle") {
    return (
      <button
        onClick={iniciarGrabacion}
        className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground hover:bg-secondary"
      >
        <Mic size={13} /> Grabar consulta
      </button>
    );
  }
  if (estado === "grabando") {
    return (
      <button
        onClick={detenerGrabacion}
        className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-vera-coral px-3 text-xs font-semibold text-white"
      >
        <Square size={13} /> Detener
      </button>
    );
  }
  if (estado === "subiendo") {
    return <p className="mt-3 text-xs text-muted-foreground">Transcribiendo…</p>;
  }
  if (estado === "listo") {
    return <p className="mt-3 text-xs text-vera-emerald">Nota guardada ✓</p>;
  }
  return <p className="mt-3 text-xs text-vera-coral">No se pudo guardar. Intenta de nuevo.</p>;
}
