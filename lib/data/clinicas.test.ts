import { describe, expect, it } from "vitest";
import { mapClinica } from "./clinicas";
import type { ApiClinica } from "@/lib/api/types";

describe("mapClinica", () => {
  it("maps id to string and keeps nombre", () => {
    const api: ApiClinica = { id: 3, nombre: "Clínica Oftalmológica del Valle" };
    expect(mapClinica(api)).toEqual({ id: "3", nombre: "Clínica Oftalmológica del Valle" });
  });
});
