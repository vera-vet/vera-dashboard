import Link from "next/link";
import { ActivarForm } from "./activar-form";

async function validarEnlace(uid: string, token: string): Promise<{ email: string } | { error: string }> {
  try {
    const params = new URLSearchParams({ uid, token });
    const response = await fetch(`${process.env.DJANGO_API_URL}/api/auth/activar/?${params}`, { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    return response.ok ? { email: data.email } : { error: data.detail ?? "El enlace no es válido." };
  } catch {
    return { error: "No pudimos conectar con Vera. Intenta de nuevo en un momento." };
  }
}

export default async function ActivarPage({ searchParams }: { searchParams: Promise<{ uid?: string; token?: string }> }) {
  const { uid = "", token = "" } = await searchParams;
  const enlace = uid && token ? await validarEnlace(uid, token) : { error: "Falta el enlace completo. Ábrelo tal como te llegó." };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elevated)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <span className="font-display text-lg font-bold">V</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-vera-verde">Define tu contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">Para entrar a Vera con tu cuenta de la clínica</p>
        </div>
        {"email" in enlace ? (
          <ActivarForm uid={uid} token={token} email={enlace.email} />
        ) : (
          <div className="space-y-4 text-center">
            <p role="alert" className="text-sm text-vera-coral-fuerte">{enlace.error}</p>
            <Link href="/login" className="text-sm font-semibold text-vera-apoyo underline">Ir a entrar</Link>
          </div>
        )}
      </div>
    </main>
  );
}
