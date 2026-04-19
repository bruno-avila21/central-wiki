# Como usar todo esto en un proyecto nuevo — Paso a paso

## Resumen rápido

```
Paso 1: Crear el repo y abrir Claude Code
Paso 2: Ejecutar scaffold (o crear a mano)
Paso 3: Completar CLAUDE.md
Paso 4: Completar AGENTS.md por app
Paso 5: Crear agentes
Paso 6: Crear tu primer skill + command
Paso 7: Configurar settings.json y .claudeignore
Paso 8: Primeras sesiones — entrenar la memoria
Paso 9: Iterar y mejorar
```

---

## Paso 1: Crear el repo y abrir Claude Code

```bash
# Crear o clonar tu proyecto
mkdir mi-proyecto && cd mi-proyecto
git init

# Crear tu estructura base de app (o ya tenerla)
# Ejemplo: API + Frontend
mkdir api web

# Abrir Claude Code
claude
```

---

## Paso 2: Ejecutar scaffold

Opcion A — **Pedile a Claude que lo haga:**

```
> Necesito que me configures la estructura de Claude Code para este proyecto.
> Es un [describir: API Node.js + frontend React / monorepo .NET + Angular / etc].
> Creame: .claudeignore, CLAUDE.md, AGENTS.md por app, agentes, un command /dev,
> settings.json y el SKILLS-INDEX.md.
> Seguí el formato de las guias en C:/Users/USUARIO/Desktop/guias-claude-code/
```

Claude va a leer tus guías y generar todo adaptado a tu proyecto.

Opcion B — **Usar el script de scaffold** (ver guía 12):

```bash
bash ~/scripts/scaffold-claude.sh
```

Opcion C — **Crear a mano** (si preferís control total):

```bash
mkdir -p .claude/agents .claude/commands .claude/skills/_shared
touch CLAUDE.md .claudeignore
touch .claude/settings.json
touch .claude/skills/SKILLS-INDEX.md
```

---

## Paso 3: Completar CLAUDE.md

Este es el archivo MAS importante. Dedicale 15 minutos.

**Abrilo y completá estas secciones:**

### 3.1 Repository Overview
```markdown
## Repository Overview

API REST para gestion de turnos médicos con frontend React.

- **api/** — Backend Express + TypeScript + Prisma + PostgreSQL
- **web/** — Frontend React 18 + TypeScript + Vite + TailwindCSS
```

Tip: 2-3 líneas. Que es, cuantas apps, que stack.

### 3.2 Build commands
```markdown
## Build & Development Commands

### API
```bash
cd api && npm run dev          # dev server port 3000
cd api && npm run build        # tsc
cd api && npm run test         # vitest
cd api && npm run lint         # eslint
cd api && npx prisma migrate dev  # migraciones
```

### Web
```bash
cd web && npm run dev          # vite port 5173
cd web && npm run build        # tsc && vite build
cd web && npm run lint         # eslint
cd web && npm run test         # vitest
```
```

Tip: Corré los comandos vos primero para asegurarte de que funcionan.

### 3.3 Architecture
```markdown
## Architecture

### API — Layered
- **routes/** — Express routes. No business logic, solo validate + call service.
- **services/** — Business logic. Todo acceso a BD via Prisma.
- **middleware/** — Auth (JWT), validation (Zod), error handling.
- **prisma/** — Schema y migraciones. NUNCA editar migraciones existentes.
```

Tip: Describí cada capa con **que hace** y **que NO debe hacer**.

### 3.4 Naming + Critical Rules

```markdown
## Naming Conventions
- Files: kebab-case (`user-profile.tsx`)
- Components: PascalCase (`UserProfile`)
- DB tables: snake_case via Prisma

## Critical Rules
- **TypeScript strict** — no `any`, no `@ts-ignore`
- **No raw SQL** — siempre Prisma ORM
- **No packages** sin aprobación
- **Zod** en todos los inputs de API
```

Tip: Las critical rules son lo que causa bugs si se ignora. Pensá en los ultimos 5 bugs que tuviste.

### 3.5 Referencia a AGENTS.md
```markdown
## Per-App Standards
- `api/AGENTS.md` — Backend patterns
- `web/AGENTS.md` — Frontend patterns
```

---

## Paso 4: Completar AGENTS.md por app

Para cada app, crear su AGENTS.md. Ejemplo para una API:

```markdown
# AGENTS.md — API

## Rol
Senior Node.js/TypeScript engineer. Implementás endpoints REST.

## Patrón de endpoint
```typescript
// routes/turno.routes.ts
router.post('/turnos',
  authenticate,
  validate(createTurnoSchema),
  async (req, res, next) => {
    try {
      const result = await turnoService.create(req.body, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);
```

## Patrón de servicio
```typescript
// services/turno.service.ts
export const turnoService = {
  create: async (data: CreateTurnoInput, userId: string): Promise<Turno> => {
    return prisma.turno.create({
      data: { ...data, userId }
    });
  }
};
```

## Naming
| Que | Patrón | Ejemplo |
|-----|--------|---------|
| Routes | `{recurso}.routes.ts` | `turno.routes.ts` |
| Services | `{recurso}.service.ts` | `turno.service.ts` |
| Schemas | `{accion}{Recurso}Schema` | `createTurnoSchema` |
| Types | PascalCase | `CreateTurnoInput` |

## Reglas
1. NUNCA acceder a prisma fuera de services
2. SIEMPRE validar con Zod en el router
3. NUNCA catchear en services — dejar que suba al error handler
4. SIEMPRE async/await, nunca callbacks
```

**Clave:** Poné templates copiables de código real de TU proyecto.
Claude aprende mejor de ejemplos que de explicaciones.

---

## Paso 5: Crear agentes

### 5.1 Orquestador (siempre crearlo primero)

`.claude/agents/orquestador.md`:
```markdown
---
name: orquestador
description: Coordina desarrollo fullstack del proyecto
model: opus
---

# Agente Orquestador

## Fase 1: Analisis
- Leer el requerimiento
- Determinar que apps se tocan

## Fase 2: Plan (OBLIGATORIO)
- Listar artefactos a crear
- Esperar aprobación del usuario

## Fase 3: Ejecución
### Oleada 1: Backend
Lanzar `agente-api` con: endpoints, schemas, reglas

### Oleada 2: Frontend
Lanzar `agente-web` con: pantallas, endpoints disponibles

### Oleada 3: Compilación
Lanzar `agente-compilacion`
```

### 5.2 Un agente por app

`.claude/agents/agente-api.md`:
```markdown
---
name: agente-api
description: Implementa endpoints en la API Express/TypeScript
model: sonnet
---

# Agente: API

## Instrucciones
1. Leer: `api/AGENTS.md`
2. Seguir todos los patrones de ese archivo

## Artefactos (en orden)
1. Zod schema en `api/src/schemas/`
2. Types en `api/src/types/`
3. Service en `api/src/services/`
4. Route en `api/src/routes/`
5. Registrar route en `api/src/app.ts`

## Al Finalizar
Reportar: archivos creados, endpoints nuevos
```

### 5.3 Agente compilación

`.claude/agents/agente-compilacion.md`:
```markdown
---
name: agente-compilacion
description: Compila y valida el proyecto
model: sonnet
---

# Agente: Compilación

## Paso 1: API
```bash
cd api && npm run lint && npm run build
```

## Paso 2: Web
```bash
cd web && npm run lint && npm run build
```

## Reglas
- Lint con CERO warnings
- Máximo 5 iteraciones
- Solo corregir errores de compilación
```

---

## Paso 6: Crear tu primer skill + command

### 6.1 Skill

`.claude/skills/desarrollo/SKILL.md`:
```markdown
---
name: desarrollo
description: >
  Desarrollo fullstack de funcionalidades.
  Trigger: Al desarrollar features, crear endpoints + pantallas.
metadata:
  version: "1.0"
---

# Skill: Desarrollo

## Flujo
```
PASO 0: Analizar requerimiento
PASO 1: Planificar artefactos
PASO 2: Backend (endpoints + servicios)
PASO 3: Frontend (componentes + hooks)
PASO 4: Compilar y validar
PASO 5: Resumen de lo creado
```

## PASO 0: Analizar
Leer el input. Si es archivo .md, leerlo. Si es texto, parsearlo.
Determinar: endpoints, pantallas, flujos.

## PASO 1: Planificar
Entrar en modo Plan. Listar:
- Archivos a crear/modificar
- Orden de ejecución
Esperar aprobación.

## PASO 2: Backend
Delegar a `agente-api`. Pasar: endpoints, schemas, reglas de negocio.

## PASO 3: Frontend
Delegar a `agente-web`. Pasar: diseño, endpoints ya creados.

## PASO 4: Compilar
Delegar a `agente-compilacion`.

## PASO 5: Resumen
```markdown
## Resumen

### Archivos creados
- `api/src/routes/turno.routes.ts` — POST /turnos, GET /turnos/:id
- `web/src/features/turnos/TurnoForm.tsx` — Formulario de turno

### Endpoints nuevos
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /turnos | Crear turno |
| GET | /turnos/:id | Obtener turno |
```
```

### 6.2 Command

`.claude/commands/dev.md`:
```markdown
# Desarrollo de Funcionalidades

## Parámetros
- **$ARGUMENTS**: Documento funcional (.md) o texto libre

## Ejemplos
```
/dev docs/feature-turnos.md
/dev Crear CRUD de turnos con calendario
```

## Ejecución
Skill: desarrollo
```

### 6.3 Actualizar el SKILLS-INDEX.md

`.claude/skills/SKILLS-INDEX.md`:
```markdown
# Skills Index

| Skill | Archivo | Que hace | Parámetros |
|-------|---------|----------|------------|
| desarrollo | skills/desarrollo/SKILL.md | Dev fullstack con orquestador | Doc .md o texto |
```

---

## Paso 7: Configurar settings.json y .claudeignore

### .claudeignore
Ya lo generó el scaffold. Revisá que incluya todo lo pesado de tu stack.

### settings.json (compartido)

`.claude/settings.json`:
```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(ls*)"
    ]
  }
}
```

### settings.local.json (personal)

`.claude/settings.local.json`:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint*)",
      "Bash(npm run build*)",
      "Bash(npm run test*)",
      "Bash(npm run dev*)"
    ]
  }
}
```

Agregar `settings.local.json` al `.gitignore`.

---

## Paso 8: Primeras sesiones — entrenar la memoria

En tus primeras sesiones con Claude Code, decile cosas para que las recuerde:

```
> Soy Bruno, senior fullstack dev, 5 años con .NET y React.
> Prefiero respuestas cortas y directas, sin explicaciones básicas.
> No uses emojis en las respuestas.
> Los tickets están en Jira, proyecto TURNOS.
> Recorda que en este proyecto los tests van con vitest, no jest.
```

Claude va a guardar esto en su sistema de memoria y lo va a usar en futuras sesiones.

---

## Paso 9: Iterar y mejorar

### Semana 1: Lo básico funciona
- CLAUDE.md + AGENTS.md + .claudeignore
- Settings con permisos de lectura
- `/dev` command funcional

### Semana 2: Agregar más commands
- `/review` para code review
- `/test` para generar tests
- Mejorar AGENTS.md con patrones que aparecieron

### Semana 3: Optimizar
- Mover secciones duplicadas a `_shared/`
- Si un AGENTS.md crece mucho, dividirlo en satélites
- Revisar memoria y limpiar lo obsoleto

### Ongoing: Cada vez que...
- Claude hace algo mal → agregar regla a AGENTS.md o feedback memory
- Claude hace algo bien de forma no obvia → agregar feedback memory positivo
- Necesitás un workflow nuevo → crear skill + command
- Un skill crece mucho → extraer secciones a `_shared/`

---

## Resumen: qué crear y en qué orden

```
Día 1 (30 min):
  ✅ .claudeignore
  ✅ CLAUDE.md (completar las 5 secciones)
  ✅ settings.json (permisos de lectura)

Día 2 (30 min):
  ✅ AGENTS.md por app (con templates de código)
  ✅ Agente orquestador + compilación

Día 3 (20 min):
  ✅ Primer skill (desarrollo)
  ✅ Primer command (/dev)
  ✅ SKILLS-INDEX.md

Semana 2+:
  ✅ Más skills según necesidad
  ✅ Más agentes si hay más apps
  ✅ Memoria se va llenando sola
  ✅ Iterar AGENTS.md con lo que aparece
```

---

## Atajo: pedile a Claude que haga todo

Si ya tenés las guías en el Desktop, podés arrancar un proyecto nuevo y decir:

```
> Leé las guías en C:/Users/USUARIO/Desktop/guias-claude-code/ y configurame
> Claude Code completo para este proyecto. Es un [describir proyecto y stack].
> Seguí el paso a paso de la guía 13.
```

Claude lee las guías, analiza tu proyecto, y genera todo adaptado.
Vos solo revisás y ajustás.
