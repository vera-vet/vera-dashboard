<!-- Todo cambio entra por PR contra `staging` (ver AGENTS.md). Los releases son `staging → main`, con OK de ambos socios. -->

## Qué cambia y por qué

## Ticket de Linear

VER-

## Cómo se probó

- [ ] `npm test`, `tsc` y `npm run lint` en verde; E2E (`npm run test:e2e`) si toca flujos
- [ ] Probado a mano:

## Checklist

- [ ] La base del PR es `staging` (`main` solo si es un release)
- [ ] Sin secretos, credenciales, datos reales ni detalles de vulnerabilidades (**este repo es público**)
- [ ] Capturas antes y después si cambia la UI
- [ ] Si corrige un bug marcado con `xfail` o `test.fail()`, quité el marcador
- [ ] Actualicé `AGENTS.md` si cambió cómo se trabaja o se corre el proyecto
