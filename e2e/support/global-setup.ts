import { randomBytes } from "node:crypto";
import { crearUsuariosE2E } from "./django";
import { USUARIOS_E2E } from "./users";

export default async function globalSetup() {
  const api = process.env.DJANGO_API_URL ?? "http://localhost:8000";
  try {
    const res = await fetch(`${api}/api/schema/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (error) {
    throw new Error(
      `La API Django no responde en ${api} (${String(error)}). ` +
        "Levántala con `manage.py runserver` después de `migrate` y `seed_demo` (ver e2e/README.md).",
    );
  }

  // Los workers se lanzan después del global setup y heredan este process.env.
  process.env.E2E_PASSWORD = randomBytes(18).toString("base64url");
  crearUsuariosE2E(USUARIOS_E2E, process.env.E2E_PASSWORD);
}
