import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AvatarPaciente, inicialDe } from "./avatar-paciente";

// El caso "la foto existe pero falla al cargar" necesita un navegador real: lo cubre
// e2e/avatar.spec.ts.
describe("AvatarPaciente", () => {
  it("con foto muestra la imagen", () => {
    const html = renderToStaticMarkup(<AvatarPaciente nombre="Rocky" fotoUrl="https://ejemplo.test/rocky.jpg" tamano={48} />);
    expect(html).toContain('<img src="https://ejemplo.test/rocky.jpg" alt="Rocky"');
  });

  it("sin foto muestra la inicial, sin imagen rota", () => {
    for (const fotoUrl of ["", null, undefined]) {
      const html = renderToStaticMarkup(<AvatarPaciente nombre="luna" fotoUrl={fotoUrl} tamano={48} />);
      expect(html).not.toContain("<img");
      expect(html).toContain('role="img" aria-label="luna"');
      expect(html).toContain(">L</span>");
    }
  });
});

describe("inicialDe", () => {
  it("usa la primera letra en mayúscula, con acentos, y un respaldo si no hay nombre", () => {
    expect(inicialDe("  Ágata")).toBe("Á");
    expect(inicialDe("ñoño")).toBe("Ñ");
    expect(inicialDe("")).toBe("?");
  });
});
