# Guia: Como crear CLAUDE.md

## Que es

`CLAUDE.md` es el archivo raiz que Claude Code lee **automaticamente** al iniciar una sesion.
Es el "briefing" del proyecto: le dice a Claude que es el repo, como compilar, que arquitectura
tiene y que reglas respetar.

**Ubicacion:** Raiz del proyecto (`/CLAUDE.md`)

Claude Code tambien lee `CLAUDE.md` de subdirectorios cuando trabaja en ellos,
pero el de la raiz siempre se carga.

---

## Estructura recomendada (template)

```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

[Descripcion breve del proyecto: que es, cuantas apps tiene, stack principal]

- **app1/** -- Descripcion (stack)
- **app2/** -- Descripcion (stack)

Solution/workspace: `archivo.sln` o `package.json` raiz.

## Build & Development Commands

### App 1
\```bash
[comando build]
[comando run]
[comando test]
[comando lint]
\```

### App 2
\```bash
[comandos equivalentes]
\```

## Architecture

### [Nombre del patron]
- **Capa1/** -- Responsabilidad. Reglas clave.
- **Capa2/** -- Responsabilidad. Reglas clave.
- **Capa3/** -- Responsabilidad. Reglas clave.

[Patrones de DI, acceso a datos, llamadas externas, etc.]

## Naming Conventions

### Backend
- Metodos: [convencion]
- Interfaces: [convencion]
- Variables privadas: [convencion]
- Parametros: [convencion]

### Frontend
- Componentes: [convencion]
- Hooks: [convencion]
- Redux/State: [convencion]

## Critical Rules

- **[Regla 1]** -- explicacion breve
- **[Regla 2]** -- explicacion breve
- **No hacer X** -- por que
- **Siempre hacer Y** -- por que

## Workflow / Business Logic (si aplica)

[Orden de operaciones o flujos de negocio que Claude debe respetar]

## CI/CD

[Pipeline, naming de artefactos, pasos del build]

## Per-App AGENTS.md Files

Each application has its own `AGENTS.md` with detailed coding standards:
- `app1/AGENTS.md` -- Backend standards
- `app2/AGENTS.md` -- Frontend standards
```

---

## Principios para escribir un buen CLAUDE.md

### 1. Ser conciso pero completo
Claude tiene contexto limitado. Cada linea debe aportar valor.
No explicar que es React o .NET — explicar como se usa **en este proyecto**.

### 2. Build commands primero
Lo primero que Claude necesita es saber como compilar y testear.
Sin esto no puede validar su propio trabajo.

### 3. Arquitectura orientada a accion
No describir la arquitectura en abstracto. Decir:
- "Controllers/ -- HTTP endpoints. **No business logic**; solo validate, call service, return result."
- "Services/ -- Business logic. Call external APIs via `GetData<T,R>`. **Never use raw HttpClient**."

El **"no hagas X"** es tan importante como el "hace Y".

### 4. Naming conventions con ejemplos concretos
No decir "usamos PascalCase". Decir:
- Metodos: `ObtenerPreCalificacion`
- Interfaces: `IObtenerBancosService`
- Privadas: prefijo `i` -> `iLogger`, `iHttpClient`

### 5. Critical Rules = lo que causa bugs si se ignora
Esta seccion es la mas importante. Poner aqui las reglas que si se rompen
generan bugs, inconsistencias o deuda tecnica. Ejemplos:
- No agregar paquetes sin aprobacion
- No hardcodear strings/colores
- No form state en Redux
- TypeScript strict, no `any`

### 6. Apuntar a los AGENTS.md
CLAUDE.md es el mapa general. Los detalles de cada app van en su AGENTS.md.
Mencionar que existen y donde encontrarlos.

---

## Errores comunes a evitar

| Error | Por que es malo |
|-------|-----------------|
| Demasiado largo (>200 lineas) | Claude lo resume y pierde detalles criticos |
| Solo listar carpetas sin reglas | Claude no sabe que patron seguir |
| No poner build commands | Claude no puede validar que compila |
| Reglas ambiguas ("usar buenas practicas") | Claude interpreta a su criterio |
| Copiar documentacion oficial del framework | Claude ya lo sabe, es ruido |
| No mencionar naming conventions | Claude inventa nombres inconsistentes |

---

## Ejemplo minimo para un proyecto nuevo

```markdown
# CLAUDE.md

## Repository Overview
API REST con Node.js (Express + TypeScript) y frontend React (Vite).

- **api/** -- Backend Express + Prisma + PostgreSQL
- **web/** -- Frontend React 18 + TypeScript + TailwindCSS

## Build & Development
\```bash
# API
cd api && npm run dev        # dev server port 3000
cd api && npm run build      # tsc
cd api && npm run test       # vitest
cd api && npm run db:migrate # prisma migrate dev

# Web
cd web && npm run dev        # vite port 5173
cd web && npm run build      # tsc && vite build
cd web && npm run lint       # eslint (zero warnings)
\```

## Architecture

### API -- Layered
- **routes/** -- Express routes. No business logic.
- **services/** -- Business logic. All DB access via Prisma.
- **middleware/** -- Auth (JWT), validation (Zod), error handling.
- **prisma/** -- Schema and migrations. Never edit existing migrations.

### Web -- Feature-based
- **features/{name}/** -- Components, hooks, types per feature.
- **shared/** -- Reusable UI components, utils, API client.
- **store/** -- Zustand stores. No Redux.

## Naming Conventions
- Files: kebab-case (`user-profile.tsx`)
- Components: PascalCase (`UserProfile`)
- Hooks: `use` prefix (`useAuth`)
- API routes: `/api/v1/kebab-case`
- DB tables: snake_case (Prisma handles mapping)

## Critical Rules
- **TypeScript strict** -- no `any`, no `@ts-ignore`
- **No raw SQL** -- always Prisma ORM
- **No packages** without explicit approval
- **Zod validation** on all API inputs
- **No inline styles** -- TailwindCSS only
- **Feature folders** -- no dumping files in shared/
```
