"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, MessageCircle } from "lucide-react";
import type { UsuarioEquipo } from "@/lib/data/types";
import { formatFechaCorta, hoyISOElSalvador } from "@/lib/date";
import { actualizarUsuario, cambiarMiPassword, invitarUsuario, nuevoLinkDeAcceso } from "./actions-usuarios";

const CAMPO = "mt-1 min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base md:text-sm";

/** El enlace para definir la contraseña: se copia o se comparte por WhatsApp (no hay correo saliente). */
function EnlaceDeAcceso({ nombre, link }: { nombre: string; link: string }) {
  const [copiado, setCopiado] = useState(false);
  const texto = `Hola, ${nombre.split(" ")[0]}. Este es tu enlace para entrar a Vera y definir tu contraseña (vence en 3 días): ${link}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-vera-apoyo bg-vera-menta-suave p-3 text-sm">
      <p className="font-semibold">Envíale este enlace a {nombre}. Vence en 3 días y sirve una sola vez.</p>
      <p className="mt-2 break-all rounded-lg bg-card p-2 font-mono text-xs">{link}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={copiar} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold">
          <Copy size={13} aria-hidden /> {copiado ? "Copiado" : "Copiar enlace"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-whatsapp px-3 text-xs font-semibold text-whatsapp-foreground"
        >
          <MessageCircle size={13} aria-hidden /> Enviar por WhatsApp
        </a>
      </div>
    </div>
  );
}

function Invitar({ onCerrar }: { onCerrar: () => void }) {
  const router = useRouter();
  const id = useId();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [esAdmin, setEsAdmin] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  async function invitar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    setGuardando(true);
    setError(null);
    try {
      const resultado = await invitarUsuario({ nombre: nombre.trim(), email: email.trim(), esAdmin });
      if (resultado.ok && resultado.linkAcceso) {
        setLink(resultado.linkAcceso);
        router.refresh();
      } else {
        setError(resultado.mensaje ?? "No se pudo invitar. Intenta de nuevo.");
      }
    } catch {
      setError("No se pudo invitar. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  if (link) {
    return (
      <div className="px-5 py-4">
        <EnlaceDeAcceso nombre={nombre} link={link} />
        <button type="button" onClick={onCerrar} className="mt-3 min-h-11 text-sm font-semibold text-muted-foreground underline">
          Listo
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={invitar} className="space-y-3 px-5 py-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nombre`} className="text-xs font-semibold text-muted-foreground">Nombre</label>
          <input id={`${id}-nombre`} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={150} className={CAMPO} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-xs font-semibold text-muted-foreground">Correo</label>
          <input id={`${id}-email`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={CAMPO} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={esAdmin} onChange={(e) => setEsAdmin(e.target.checked)} className="h-4 w-4 accent-vera-verde" />
        Administrador (configura la clínica, el inventario y las cuentas)
      </label>
      {error && <p role="alert" className="text-xs text-vera-coral-fuerte">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={guardando} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {guardando ? "Invitando…" : "Invitar"}
        </button>
        <button type="button" onClick={onCerrar} disabled={guardando} className="min-h-11 rounded-xl border border-border px-4 text-sm font-semibold">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function FilaUsuario({ usuario, esYo }: { usuario: UsuarioEquipo; esYo: boolean }) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  async function ejecutar(accion: () => Promise<{ ok: boolean; mensaje?: string; linkAcceso?: string }>) {
    if (ocupado) return;
    setOcupado(true);
    setError(null);
    try {
      const resultado = await accion();
      if (!resultado.ok) setError(resultado.mensaje ?? "No se pudo guardar. Intenta de nuevo.");
      else if (resultado.linkAcceso) setLink(resultado.linkAcceso);
      else router.refresh();
    } catch {
      setError("No se pudo guardar. Intenta de nuevo.");
    } finally {
      setOcupado(false);
    }
  }

  const acceso = usuario.ultimoAcceso
    ? `Último acceso: ${formatFechaCorta(hoyISOElSalvador(new Date(usuario.ultimoAcceso)))}`
    : "Todavía no entra (invitación pendiente)";

  return (
    <li className="px-5 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-semibold">
            {usuario.nombre || usuario.email}
            {esYo && <span className="ml-2 text-xs font-normal text-muted-foreground">(tú)</span>}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {usuario.email} · {usuario.esAdmin ? "Administrador" : "Personal"} · {usuario.activo ? acceso : "Desactivada"}
          </div>
        </div>
        {!esYo && (
          <div className="flex flex-wrap gap-1 text-xs">
            {usuario.activo && (
              <button type="button" disabled={ocupado} onClick={() => ejecutar(() => nuevoLinkDeAcceso(usuario.id))}
                className="min-h-10 rounded-lg px-2 font-semibold text-muted-foreground hover:text-foreground">
                Enlace nuevo
              </button>
            )}
            <button type="button" disabled={ocupado} onClick={() => ejecutar(() => actualizarUsuario(usuario.id, { esAdmin: !usuario.esAdmin }))}
              className="min-h-10 rounded-lg px-2 font-semibold text-muted-foreground hover:text-foreground">
              {usuario.esAdmin ? "Quitar admin" : "Hacer admin"}
            </button>
            <button type="button" disabled={ocupado} onClick={() => ejecutar(() => actualizarUsuario(usuario.id, { activo: !usuario.activo }))}
              className="min-h-10 rounded-lg px-2 font-semibold text-muted-foreground hover:text-vera-coral-fuerte">
              {usuario.activo ? "Desactivar" : "Activar"}
            </button>
          </div>
        )}
      </div>
      {error && <p role="alert" className="mt-1 text-xs text-vera-coral-fuerte">{error}</p>}
      {link && <EnlaceDeAcceso nombre={usuario.nombre || usuario.email} link={link} />}
    </li>
  );
}

export function UsuariosSection({ usuarios, miEmail }: { usuarios: UsuarioEquipo[]; miEmail: string }) {
  const [invitando, setInvitando] = useState(false);

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-bold">Cuentas de acceso</h2>
          <p className="text-xs text-muted-foreground">Quién entra a Vera. Quien olvidó su contraseña recibe un enlace nuevo.</p>
        </div>
        {!invitando && (
          <button type="button" onClick={() => setInvitando(true)} className="min-h-11 rounded-xl border border-border px-3 text-sm font-semibold hover:bg-secondary">
            + Invitar
          </button>
        )}
      </div>
      <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {invitando && (
          <li>
            <Invitar onCerrar={() => setInvitando(false)} />
          </li>
        )}
        {usuarios.map((u) => (
          <FilaUsuario key={u.id} usuario={u} esYo={u.email === miEmail} />
        ))}
      </ul>
    </section>
  );
}

export function MiCuenta() {
  const id = useId();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; error: boolean } | null>(null);

  async function cambiar(e: React.FormEvent) {
    e.preventDefault();
    if (guardando) return;
    if (nueva !== confirmacion) {
      setMensaje({ texto: "La contraseña nueva y su confirmación no coinciden.", error: true });
      return;
    }
    setGuardando(true);
    setMensaje(null);
    try {
      const resultado = await cambiarMiPassword(actual, nueva);
      if (resultado.ok) {
        setActual("");
        setNueva("");
        setConfirmacion("");
        setMensaje({ texto: "Contraseña actualizada.", error: false });
      } else {
        setMensaje({ texto: resultado.mensaje ?? "No se pudo cambiar. Intenta de nuevo.", error: true });
      }
    } catch {
      setMensaje({ texto: "No se pudo cambiar. Intenta de nuevo.", error: true });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 font-display text-lg font-bold">Tu cuenta</h2>
      <form onSubmit={cambiar} className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <div>
          <label htmlFor={`${id}-actual`} className="text-xs font-semibold text-muted-foreground">Contraseña actual</label>
          <input id={`${id}-actual`} type="password" autoComplete="current-password" value={actual} onChange={(e) => setActual(e.target.value)} className={CAMPO} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-nueva`} className="text-xs font-semibold text-muted-foreground">Contraseña nueva</label>
            <input id={`${id}-nueva`} type="password" autoComplete="new-password" value={nueva} onChange={(e) => setNueva(e.target.value)} className={CAMPO} />
          </div>
          <div>
            <label htmlFor={`${id}-confirmacion`} className="text-xs font-semibold text-muted-foreground">Confírmala</label>
            <input id={`${id}-confirmacion`} type="password" autoComplete="new-password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} className={CAMPO} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={guardando} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {guardando ? "Cambiando…" : "Cambiar contraseña"}
          </button>
          {mensaje && (
            <p role={mensaje.error ? "alert" : "status"} className={mensaje.error ? "text-sm text-vera-coral-fuerte" : "text-sm text-vera-apoyo"}>
              {mensaje.texto}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
