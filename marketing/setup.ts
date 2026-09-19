import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const API_DIR = path.resolve(process.env.VERA_API_DIR ?? path.join(__dirname, "../../vera-api"));
const PYTHON = process.env.VERA_API_PYTHON ?? path.join(API_DIR, ".venv/bin/python");
export const SALIDA = path.join(__dirname, "salida");
export const DATOS = path.join(SALIDA, "datos.json");

// Recrea la clínica demo con una contraseña nueva en cada corrida (nada queda en el repo) y deja
// los ids que necesitan las capturas.
export default function setup() {
  for (const dir of ["capturas", "video"]) mkdirSync(path.join(SALIDA, dir), { recursive: true });
  const password = randomBytes(12).toString("base64url");
  execFileSync(PYTHON, ["manage.py", "seed_marketing", "--password", password], { cwd: API_DIR, stdio: "ignore" });
  const salida = execFileSync(
    PYTHON,
    [
      "manage.py",
      "shell",
      "-c",
      `import json
from apps.pacientes.models import Paciente
d = Paciente.objects.get(clinica__nombre="Clínica Veterinaria San Benito", nombre="Dante")
print(json.dumps({"danteId": d.id, "carnetToken": str(d.carnet_token)}))`,
    ],
    { cwd: API_DIR, encoding: "utf-8" },
  );
  const datos = JSON.parse(salida.trim().split("\n").pop()!);
  writeFileSync(DATOS, JSON.stringify({ ...datos, email: "demo@sanbenito.test", password }));
}
