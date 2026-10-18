import { describe, expect, it } from "vitest";
import { mapUsuario, mapUsuarioEquipo } from "./usuario";
import type { ApiUsuario } from "@/lib/api/types";

describe("mapUsuario", () => {
  it("maps es_admin to esAdmin", () => {
    const api: ApiUsuario = { email: "vet@sanrafael.com", nombre: "Dra. Ramírez", es_admin: true, clinica_nombre: "Veterinaria San Rafael" };

    expect(mapUsuario(api)).toEqual({
      email: "vet@sanrafael.com", nombre: "Dra. Ramírez", esAdmin: true, clinicaNombre: "Veterinaria San Rafael",
    });
  });
});


describe("mapUsuarioEquipo", () => {
  it("maps a staff account, keeping a null last login for pending invitations", () => {
    expect(mapUsuarioEquipo({
      id: 7, email: "fatima@sanrafael.com", nombre: "Fátima", es_admin: false, is_active: true, last_login: null,
    })).toEqual({
      id: "7", email: "fatima@sanrafael.com", nombre: "Fátima", esAdmin: false, activo: true, ultimoAcceso: null,
    });
  });
});
