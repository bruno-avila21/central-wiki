---
title: Ecosistema de Agentes
description: Visión general de los agentes y skills IA del ecosistema
wiki_managed: true
---

# Ecosistema de Agentes IA

Conjunto de agentes y herramientas construidas sobre Claude para automatizar tareas de desarrollo, investigación y análisis.

## Arquitectura general

```
Claude Code (orquestador)
    │
    ├── claude-agents/         ← agentes CLI + skills reutilizables
    │   ├── skills/            ← bloques de utilidad (playwright, html-sanitizer…)
    │   └── agents/            ← agentes con pipelines completos
    │
    └── Investigador/          ← agente especializado en research
```

## Agentes disponibles

### web2react
Clona cualquier sitio web y genera componentes React reutilizables.

```bash
pnpm --filter @claude-agents/web2react start clone https://ejemplo.com \
  --out ./output/ejemplo \
  --framework next
```

**Pipeline:**
1. Captura la web con Playwright (hidratación + lazy load)
2. Sanitiza el HTML (limpia clases autogeneradas, trackers)
3. Extrae design tokens (paleta, tipografía, spacing)
4. Genera componentes React con Claude
5. Valida el JSX con Babel + TypeScript compiler

### code-reviewer
Analiza un repo y genera `SKILL.md` y `AGENTS.md` específicos para ese proyecto.

```bash
pnpm --filter @claude-agents/code-reviewer start generate \
  --path /ruta/al/proyecto \
  --out /ruta/al/proyecto/SKILL.md
```

### Investigador
Investiga cualquier tema usando búsqueda web y produce un reporte estructurado.

```bash
node investigador.js --tema "tu pregunta aquí" --profundidad alta
```

Ver [documentación completa del Investigador](/agentes/investigador).

## Skills (bloques reutilizables)

| Skill | Qué hace |
|-------|----------|
| `playwright-capture` | Captura webs con hidratación completa, lazy load y multi-viewport |
| `html-sanitizer` | Limpia clases autogeneradas, trackers e inline styles del HTML |
| `design-tokens` | Extrae paleta de colores, fuentes y espaciados por frecuencia |
| `jsx-validator` | Valida JSX/TSX con Babel + TypeScript compiler con retry loop |

## Agregar un agente nuevo

1. Crear la carpeta `agents/<nombre>/` siguiendo la estructura mínima
2. Agregar el `package.json` con el `bin` apuntando al CLI
3. Correr `pnpm install` para que pnpm workspaces lo detecte
4. Documentarlo en esta wiki

Ver [claude-agents](/agentes/claude-agents) para la estructura de carpetas detallada.

## Setup inicial (monorepo)

```bash
git clone git@github.com:bruno-avila21/claude-agents.git
cd claude-agents
pnpm install
cp .env.example .env
# Agregar ANTHROPIC_API_KEY
pnpm build
```
