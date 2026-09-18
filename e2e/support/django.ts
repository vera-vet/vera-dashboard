import { execFileSync } from "node:child_process";
import path from "node:path";

// Ayudantes que preparan datos directamente en la API Django vía `manage.py shell`.
// Solo para E2E: el seed demo no trae productos ni usuarios admin, y el link mágico de la
// tienda normalmente llega por WhatsApp -- aquí se firma con la misma SECRET_KEY de la API.
const API_DIR = path.resolve(process.env.VERA_API_DIR ?? path.join(__dirname, "../../../vera-api"));
const PYTHON = process.env.VERA_API_PYTHON ?? path.join(API_DIR, ".venv/bin/python");

function djangoShell<T>(code: string): T {
  const out = execFileSync(PYTHON, ["manage.py", "shell", "-c", code], {
    cwd: API_DIR,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const lastLine = out.trim().split("\n").pop() ?? "";
  return JSON.parse(lastLine) as T;
}

const PRELUDE = `
import json
from apps.accounts.models import Usuario, Clinica
from apps.pacientes.models import Dueno, Paciente
from apps.inventario.models import Producto
`;

export interface DatosTienda {
  tokenAcceso: string;
  duenoNombre: string;
  productoId: number;
  productoNombre: string;
  stockInicial: number;
}

/** Deja un producto con stock conocido en San Rafael y firma un link mágico para uno de sus dueños. */
export function prepararTienda(productoNombre: string, stock: number): DatosTienda {
  return djangoShell<DatosTienda>(`${PRELUDE}
from django.core import signing
clinica = Clinica.objects.get(nombre__icontains="San Rafael")
dueno = Dueno.objects.filter(clinica=clinica).order_by("id").first()
producto, _ = Producto.objects.update_or_create(
    clinica=clinica, nombre=${JSON.stringify(productoNombre)},
    defaults={"categoria": "accesorio", "precio": "9.50", "cantidad": ${stock}},
)
token = signing.dumps({"dueno_id": dueno.id}, salt="tienda-acceso")
print(json.dumps({"tokenAcceso": token, "duenoNombre": dueno.nombre, "productoId": producto.id,
                  "productoNombre": producto.nombre, "stockInicial": producto.cantidad}))
`);
}

export function stockDe(productoId: number): number {
  return djangoShell<number>(`${PRELUDE}
print(json.dumps(Producto.objects.get(id=${Number(productoId)}).cantidad))
`);
}

/** Crea o resetea los usuarios de E2E en las clínicas del seed, con la contraseña de esta corrida. */
export function crearUsuariosE2E(usuarios: { email: string; clinica: string; nombre: string }[], password: string): void {
  djangoShell(`${PRELUDE}
for u in json.loads(${JSON.stringify(JSON.stringify(usuarios))}):
    usuario, _ = Usuario.objects.update_or_create(
        email=u["email"],
        defaults={"clinica": Clinica.objects.get(nombre__icontains=u["clinica"]), "nombre": u["nombre"], "es_admin": False},
    )
    usuario.set_password(${JSON.stringify(password)})
    usuario.save()
print(json.dumps(True))
`);
}

export function setAdmin(email: string, esAdmin: boolean): void {
  djangoShell(`${PRELUDE}
Usuario.objects.filter(email=${JSON.stringify(email)}).update(es_admin=${esAdmin ? "True" : "False"})
print(json.dumps(True))
`);
}

export function pacienteIdPorNombre(clinica: string, nombre: string): number {
  return djangoShell<number>(`${PRELUDE}
print(json.dumps(Paciente.objects.get(clinica__nombre__icontains=${JSON.stringify(clinica)}, nombre=${JSON.stringify(nombre)}).id))
`);
}
