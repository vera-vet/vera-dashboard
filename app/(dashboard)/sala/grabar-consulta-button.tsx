"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, Square } from "lucide-react";
import { crearNotaConsulta } from "./actions";

type Estado = "idle" | "grabando" | "subiendo" | "listo" | "error";

const MENSAJE_ERROR_DEFECTO = "No se pudo guardar. Intenta de nuevo.";

// Maps a MediaRecorder mimeType (e.g. "audio/webm;codecs=opus") to a file
// extension. Safari/iOS Safari default to MP4/AAC instead of webm, so the
// extension must be derived from what the browser actually chose rather
// than assumed.
function extensionParaMime(mime: string): string {
  const subtipo = mime.split(";")[0].split("/")[1];
  return subtipo || "webm";
}

export function GrabarConsultaButton({ pacienteId, empleadoId }: { pacienteId: string; empleadoId: string }) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("idle");
  const [mensajeError, setMensajeError] = useState(MENSAJE_ERROR_DEFECTO);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function iniciarGrabacion() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { audioBitsPerSecond: 32000 });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        setEstado("subiendo");
        try {
          const mime = recorder.mimeType || "audio/webm";
          const extension = extensionParaMime(mime);
          const audioBlob = new Blob(chunksRef.current, { type: mime });
          const formData = new FormData();
          formData.append("audio", audioBlob, `consulta.${extension}`);
          formData.append("empleado", empleadoId);
          const resultado = await crearNotaConsulta(pacienteId, formData);
          if (resultado.ok) {
            setEstado("listo");
            router.refresh();
          } else {
            setMensajeError(MENSAJE_ERROR_DEFECTO);
            setEstado("error");
          }
        } catch {
          setMensajeError(MENSAJE_ERROR_DEFECTO);
          setEstado("error");
        }
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setEstado("grabando");
    } catch {
      setMensajeError("No se pudo acceder al micrófono. Revisa los permisos del navegador.");
      setEstado("error");
    }
  }

  function detenerGrabacion() {
    mediaRecorderRef.current?.stop();
  }

  function reiniciar() {
    setEstado("idle");
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
        className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-vera-coral-fuerte px-3 text-xs font-semibold text-white"
      >
        <Square size={13} /> Detener
      </button>
    );
  }
  if (estado === "subiendo") {
    return <p className="mt-3 text-xs text-muted-foreground">Transcribiendo…</p>;
  }
  if (estado === "listo") {
    return (
      <div className="mt-3 flex items-center gap-3">
        <p className="text-xs text-vera-apoyo">Nota guardada ✓</p>
        <button onClick={reiniciar} className="text-xs font-semibold text-muted-foreground underline hover:text-foreground">
          Grabar otra consulta
        </button>
      </div>
    );
  }
  return (
    <div className="mt-3 flex items-center gap-3">
      <p className="text-xs text-vera-coral-fuerte">{mensajeError}</p>
      <button onClick={reiniciar} className="text-xs font-semibold text-muted-foreground underline hover:text-foreground">
        Intentar de nuevo
      </button>
    </div>
  );
}
