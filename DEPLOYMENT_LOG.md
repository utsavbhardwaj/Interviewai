# Deployment Issue Log

> Project: InterviewAI (Node.js + Express + Vite + React)
> Deployment target: Docker (EC2 / local)
> All fixes pushed to: https://github.com/utsavbhardwaj/Interviewai

---

## Issue 1 — Vite bundled into production server output

### Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'vite'
imported from /app/dist/index.js
```

### Root Cause
The original build script bundled `server/index.ts` with esbuild using `--bundle`.
`server/index.ts` had a static top-level import:
```ts
import { setupVite, serveStatic, log } from "./vite";
```
Because esbuild followed this static import, it inlined the entire `server/vite.ts`
file into `dist/index.js`, which brought in `import { createServer } from "vite"` at
the top level. The Docker production image installs only production dependencies
(`npm ci --omit=dev`), so `vite` is not present → crash.

### Fix
**Files changed:** `server/logger.ts` (new), `server/vite.ts`, `server/index.ts`, `package.json`

1. Extracted `log()` from `server/vite.ts` into a new `server/logger.ts` (no Vite dependency).
2. Changed `server/index.ts` to import `log` from `./logger` only.
3. Replaced the static import of `setupVite`/`serveStatic` with dynamic imports:
   ```ts
   if (env === "development") {
     const { setupVite } = await import("./vite");   // only loaded in dev
   } else {
     const { serveStatic } = await import("./static"); // no vite dependency
   }
   ```
4. Changed build script from `--bundle` to per-file transpilation temporarily
   (later improved — see Issue 3).

---

## Issue 2 — ERR_MODULE_NOT_FOUND for local relative modules

### Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/dist/routes'
imported from /app/dist/index.js
```

### Root Cause
Node.js ESM (`"type": "module"`) requires explicit `.js` file extensions on
relative imports at runtime. TypeScript source files use extensionless imports
(e.g. `import { x } from "./routes"`), and esbuild without `--bundle` passes
these through unchanged. Node then cannot resolve `./routes` because it expects
`./routes.js`.

### Fix
**Files changed:** `server/index.ts`, `server/routes.ts`, `server/storage.ts`,
`server/vite.ts`, `server/services/gemini.ts`

Added `.js` extension to every relative import in the server folder:
```ts
// Before
import { registerRoutes } from "./routes";
// After
import { registerRoutes } from "./routes.js";
```
12 imports fixed across 6 files. Also fixed both dynamic imports in `index.ts`.

> Note: These `.js` extensions were later removed when switching back to
> bundled mode (Issue 3), where the bundler handles resolution.

---

## Issue 3 — dist/services/ directory missing from build output

### Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/dist/services/gemini.js'
imported from /app/dist/routes.js
```

### Root Cause
The per-file esbuild command `esbuild server/*.ts` uses a shell glob that only
matches files directly inside `server/`. The `server/services/` subdirectory
is not matched. So `dist/services/` was never created.

### Fix
**Files changed:** `package.json`

Added `server/services/*.ts` explicitly and `--outbase=server` to preserve
the folder structure:
```json
"build": "vite build && esbuild server/*.ts server/services/*.ts
  --platform=node --packages=external --format=esm
  --outbase=server --outdir=dist"
```
`--outbase=server` tells esbuild to mirror the source tree so
`server/services/gemini.ts` → `dist/services/gemini.js`.

---

## Issue 4 — @shared/schema path alias unresolvable at runtime

### Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@shared/schema'
imported from /app/dist/routes.js
```

### Root Cause
`@shared/schema` is a TypeScript path alias defined in `tsconfig.json`:
```json
"paths": { "@shared/*": ["./shared/*"] }
```
Per-file transpilation (no bundler) does NOT resolve TypeScript aliases.
The compiled JS passes `@shared/schema` through as-is. Node.js then looks
for an npm package named `@shared/schema` — which doesn't exist → crash.

This is the **fundamental flaw** of the per-file transpilation approach:
it cannot resolve TypeScript path aliases without a bundler.

### Fix
**Files changed:** `server/static.ts` (new), `server/vite.ts`, `server/index.ts`,
`server/routes.ts`, `server/storage.ts`, `server/services/gemini.ts`, `package.json`

**Definitive strategy — bundle with code splitting:**

1. Created `server/static.ts` — extracted `serveStatic()` from `server/vite.ts`
   into a completely Vite-free file. Only contains `express.static` + SPA fallback.

2. Updated `server/index.ts` production branch to import from `./static`
   (not `./vite`), so the Vite module is never loaded in production.

3. Switched build back to `--bundle` with `--splitting`:
   ```json
   "build": "vite build && esbuild server/index.ts --bundle --splitting
     --platform=node --packages=external --format=esm
     --alias:@shared=./shared --outdir=dist"
   ```
   - `--bundle` → resolves `@shared` alias at build time, inlines into bundle
   - `--splitting` → `await import("./vite")` becomes a real lazy chunk
     (`dist/vite-XXXXXXXX.js`) that is **never loaded** in production
   - `--alias:@shared=./shared` → maps the TypeScript path alias for esbuild

**Build output:**
```
dist/index.js          ← main bundle, zero top-level vite imports ✅
dist/static-*.js       ← production static serving, no vite ✅
dist/vite-*.js         ← isolated dev-only chunk, never loaded in prod ✅
dist/public/           ← Vite client bundle (React app) ✅
```

---

## Issue 5 — Clerk publishable key missing in Docker production

### Error (browser console)
```
@clerk/clerk-react: Missing publishableKey
```

### Root Cause
`VITE_CLERK_PUBLISHABLE_KEY` was listed under `docker-compose.yml`
`environment:` — but that only injects variables at **container runtime**.

Vite bakes `VITE_*` variables into the static JS bundle **at build time**
(`RUN npm run build` inside the Dockerfile builder stage). During that
`RUN` step, no environment variables from `docker-compose.yml` are present.
So Vite replaced `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY` with
`undefined` → baked permanently into `dist/public/assets/index.js` → Clerk crash.

### Fix
**Files changed:** `Dockerfile`, `docker-compose.yml`

1. **`Dockerfile`** — added `ARG` + `ENV` before the build step:
   ```dockerfile
   ARG VITE_CLERK_PUBLISHABLE_KEY
   ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
   RUN npm run build
   ```
   `ARG` receives the value from `docker build --build-arg`.
   `ENV` promotes it so child processes (`vite build`) can read it.

2. **`docker-compose.yml`** — added `build.args` to forward the key
   from the host `.env` into the Docker build stage:
   ```yaml
   build:
     context: .
     dockerfile: Dockerfile
     args:
       - VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
   ```

**Key flow:**
```
.env on host
  → docker-compose build.args
    → Dockerfile ARG
      → Dockerfile ENV
        → RUN npm run build
          → vite build reads process.env.VITE_CLERK_PUBLISHABLE_KEY
            → baked into dist/public/assets/index.js ✅
```

---

## Summary of All Commits

| Commit | Fix |
|--------|-----|
| `f471253` | Extract log() to logger.ts; dynamic vite imports; per-file build |
| `9e32577` | Add .js extensions to all relative imports for Node ESM |
| `cd42df3` | Include server/services/*.ts in build; preserve folder structure |
| `f3b977b` | Definitive fix: bundle+splitting, extract static.ts, resolve @shared |
| `17c80a4` | Pass VITE_CLERK_PUBLISHABLE_KEY as Docker build arg |

---

## Key Lessons

1. **Never statically import dev-only tools** (Vite, webpack) in server entry files.
   Use dynamic `import()` so they are tree-shaken or code-split out.

2. **Per-file transpilation cannot resolve TypeScript path aliases.**
   If you use `@shared/*`, `@/*`, etc., you need a bundler (`--bundle`).

3. **Vite environment variables are compile-time, not runtime.**
   `VITE_*` vars must be in the process environment during `vite build`,
   not just at container startup. Use Docker `ARG` + `build.args` for this.

4. **Shell globs don't recurse.** `server/*.ts` does not match `server/services/*.ts`.
   Use explicit paths or `--bundle` (which follows imports automatically).

5. **esbuild `--splitting`** is the right tool when you want `--bundle` (for alias
   resolution) but also need dynamic imports to remain truly lazy (for Vite isolation).
