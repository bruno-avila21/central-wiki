# Guia: Arquitectura Completa — Como se conecta todo

## Vista general

```
Proyecto/
│
├── CLAUDE.md                          # Contexto global (siempre cargado)
│
├── app-backend/
│   └── AGENTS.md                      # Reglas del backend
│
├── app-frontend/
│   └── AGENTS.md                      # Reglas del frontend
│
└── .claude/
    ├── agents/                        # Ejecutores especializados
    │   ├── orquestador.md             # Coordina todo (opus)
    │   ├── agente-backend.md          # Implementa backend (sonnet)
    │   ├── agente-frontend.md         # Implementa frontend (sonnet)
    │   └── agente-compilacion.md      # Compila y valida (sonnet)
    │
    ├── commands/                      # Slash commands del usuario
    │   ├── dev.md                     # /dev -> desarrollo fullstack
    │   ├── review.md                  # /review -> code review
    │   ├── test.md                    # /test -> generar tests
    │   └── deploy.md                  # /deploy -> deployment
    │
    └── skills/                        # Logica detallada de workflows
        ├── desarrollo/
        │   └── SKILL.md
        ├── code-review/
        │   └── SKILL.md
        ├── testing/
        │   ├── SKILL.md
        │   └── plantillas/
        └── deploy/
            └── SKILL.md
```

---

## Flujo de ejecucion completo

```
                    USUARIO
                      |
                      | escribe: /dev docs/feature.md
                      v
              ┌──────────────┐
              │   COMMAND     │  .claude/commands/dev.md
              │   (interfaz)  │  - Detecta modo de entrada
              │               │  - Lee $ARGUMENTS
              └──────┬───────┘
                     |
                     | invoca
                     v
              ┌──────────────┐
              │    SKILL      │  .claude/skills/desarrollo/SKILL.md
              │   (logica)    │  - Flujo paso a paso
              │               │  - Reglas detalladas
              └──────┬───────┘
                     |
                     | delega a
                     v
              ┌──────────────┐
              │ ORQUESTADOR   │  .claude/agents/orquestador.md
              │   (opus)      │  - Planifica oleadas
              │               │  - Coordina subagentes
              └──────┬───────┘
                     |
          ┌──────────┼──────────┐
          |          |          |
          v          v          v
     ┌─────────┐ ┌─────────┐ ┌─────────┐
     │BACKEND  │ │FRONTEND │ │COMPILE  │
     │(sonnet) │ │(sonnet) │ │(sonnet) │
     └────┬────┘ └────┬────┘ └────┬────┘
          |          |          |
          | lee      | lee      |
          v          v          |
     ┌─────────┐ ┌─────────┐   |
     │AGENTS.md│ │AGENTS.md│   |
     │backend  │ │frontend │   |
     └─────────┘ └─────────┘   |
                                |
                                v
                         BUILD OK/FAIL
```

---

## Que lee Claude y cuando

### Carga automatica (siempre)
- `CLAUDE.md` de la raiz
- `AGENTS.md` del directorio actual (si existe)

### Carga explicita (cuando se necesita)
- `.claude/agents/*.md` — cuando se lanza un agente
- `.claude/commands/*.md` — cuando el usuario invoca un slash command
- `.claude/skills/*/SKILL.md` — cuando un command lo referencia

### Carga por instruccion del agente
- `app/AGENTS.md` — el agente lo lee antes de escribir codigo en esa app

---

## Principios de diseno

### 1. Separacion de responsabilidades

| Capa | Responsabilidad | Cambia cuando... |
|------|-----------------|-------------------|
| CLAUDE.md | Contexto del proyecto | Cambia la arquitectura global |
| AGENTS.md | Patrones de codigo de una app | Cambia el stack o las convenciones |
| agents/ | Instrucciones de implementacion | Cambia como se ejecuta una tarea |
| commands/ | Interfaz del usuario | Cambia como el usuario interactua |
| skills/ | Logica de workflow | Cambia el proceso paso a paso |

### 2. Jerarquia de informacion

```
CLAUDE.md (general, conciso)
  └── AGENTS.md (por app, detallado)
        └── agents/ (ejecutores, con templates)
```

Cada nivel agrega detalle. No duplicar informacion entre niveles.

### 3. Principio DRY aplicado

- AGENTS.md define las reglas de la app UNA vez
- Los agentes LEEN el AGENTS.md, no copian su contenido
- Los commands apuntan a skills, no copian la logica
- Los skills referencian agentes, no replican sus instrucciones

### 4. Oleadas para secuencia, paralelismo cuando se puede

```
Oleada 1: Backend (necesita terminar primero)
Oleada 2: Frontend A + Frontend B (en paralelo, son independientes)
Oleada 3: Compilacion (necesita que todo este listo)
```

---

## Checklist para configurar un proyecto nuevo

### Paso 1: CLAUDE.md
- [ ] Repository overview (apps, stacks)
- [ ] Build & dev commands por app
- [ ] Arquitectura (capas, responsabilidades)
- [ ] Naming conventions
- [ ] Critical rules
- [ ] Business workflow (si aplica)
- [ ] CI/CD
- [ ] Referencia a AGENTS.md por app

### Paso 2: AGENTS.md por app
- [ ] Rol y stack
- [ ] Estructura de carpetas
- [ ] Patrones de codigo con templates
- [ ] Naming detallado con tabla
- [ ] Reglas MUST/NEVER
- [ ] Forbidden patterns con antes/despues
- [ ] Hooks y utilidades disponibles
- [ ] Checklist "Al Finalizar"

### Paso 3: Agentes
- [ ] Orquestador (opus): fases, oleadas, validacion
- [ ] Agente por app (sonnet): artefactos, templates, reglas
- [ ] Agente compilacion (sonnet): build, lint, max iteraciones
- [ ] (Opcional) Agente de review/analisis

### Paso 4: Commands
- [ ] Un command por workflow principal
- [ ] Parametros y ejemplos
- [ ] Referencia al skill que invoca

### Paso 5: Skills
- [ ] Un skill por workflow complejo
- [ ] Flujo paso a paso numerado
- [ ] Template de output
- [ ] Integraciones documentadas
- [ ] Reglas criticas
- [ ] Plantillas auxiliares (si aplica)

---

## Ejemplo completo: proyecto Node.js + React

```
mi-proyecto/
├── CLAUDE.md                          # Stack, build, reglas globales
├── api/
│   └── AGENTS.md                      # Patrones Express + Prisma
├── web/
│   └── AGENTS.md                      # Patrones React + Zustand
└── .claude/
    ├── agents/
    │   ├── orquestador.md             # opus: planifica y coordina
    │   ├── agente-api.md              # sonnet: routes, services, prisma
    │   ├── agente-web.md              # sonnet: components, hooks, stores
    │   └── agente-build.md            # sonnet: tsc, eslint, vitest
    ├── commands/
    │   ├── dev.md                     # /dev -> desarrollo fullstack
    │   ├── review.md                  # /review PR# -> code review
    │   ├── test.md                    # /test modulo -> generar tests
    │   └── migrate.md                 # /migrate nombre -> crear migracion
    └── skills/
        ├── desarrollo/
        │   └── SKILL.md              # Workflow completo de dev
        ├── code-review/
        │   └── SKILL.md              # Checklist de review
        └── testing/
            ├── SKILL.md              # Workflow de testing
            └── plantillas/
                ├── PLANTILLA_UNIT.md
                └── PLANTILLA_E2E.md
```
