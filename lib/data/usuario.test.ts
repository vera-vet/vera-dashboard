import { describe, expect, it } from "vitest";
import { mapUsuario } from "./usuario";
import type { ApiUsuario } from "@/lib/api/types";

describe("mapUsuario", () => {
  it("maps es_admin to esAdmin", () => {
    const api: ApiUsuario = { email: "vet@sanrafael.com", nombre: "Dra. Ramírez", es_admin: true, clinica_nombre: "Veterinaria San Rafael" };

    expect(mapUsuario(api)).toEqual({
      email: "vet@sanrafael.com", nombre: "Dra. Ramírez", esAdmin: true, clinicaNombre: "Veterinaria San Rafael",
    });
  });
});
