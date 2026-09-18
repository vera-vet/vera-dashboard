# E2E (Playwright)

End-to-end tests against the **real stack**: this Next app + the Django API (`vera-api`) with the
demo seed loaded. Nothing is mocked.

## Running locally

```bash
# 1. API (in ../vera-api)
docker compose up -d db
.venv/bin/python manage.py migrate && .venv/bin/python manage.py seed_demo
.venv/bin/python manage.py runserver 8000      # DEBUG=True so the simulated payment provider works

# 2. Browsers (first time only)
npx playwright install chromium

# 3. Tests (reuses a dev server on :3000, or starts one)
npm run test:e2e
npx playwright test --ui                        # interactive
```

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `DJANGO_API_URL` | `http://localhost:8000` | API the app and the global setup talk to |
| `VERA_API_DIR` | `../vera-api` | Where `manage.py` lives. The helpers in `support/django.ts` run `manage.py shell` there |
| `VERA_API_PYTHON` | `$VERA_API_DIR/.venv/bin/python` | Python interpreter for those helpers |
| `E2E_PORT` / `E2E_BASE_URL` | `3000` | Where Next is served |
| `CI` | unset | When set: tests `next start` (build first), 1 worker, 1 retry, `test.only` forbidden |

## How it is organized

- `support/global-setup.ts` creates or resets two **dedicated** users (`e2e@sanrafael.test`,
  `e2e@losalamos.test`) in the seed's clinics, using a random password generated for each run. This
  public repo holds no credentials, and the demo seed users are never modified.
- `auth.setup.ts` logs in once as the San Rafael E2E user and saves the session to `e2e/.auth/`
  (gitignored). Specs reuse it; specs that exercise login itself start with an empty session.
- `support/django.ts` prepares data the demo seed lacks: E2E users, store products, a signed
  magic-link token (in production it arrives by WhatsApp), and the clinic-admin flag.
- Specs:
  - `auth`: login, logout, cookie flags
  - `navegacion`: every dashboard section
  - `pacientes`: list, detail, intake
  - `aislamiento`: cross-clinic isolation
  - `inventario`: admin gating
  - `tienda`: full purchase plus staff order handling
  - `home`: known bug, below

## Known bugs encoded as expected failures

`test.fail()` marks a test that must fail today because of a known bug. When the bug is fixed the
test passes, Playwright reports that as a failure, and the marker has to be removed.

- `home.spec.ts`: the home greeting is hardcoded to "Buenos días, Dra. Ramírez" for every user.
