---
title: Claude Agents
description: Monorepo de agentes y skills AI-powered construidos con Claude — web2react, code-reviewer, marketing-agents y más
wiki_managed: true
---

# claude-agents

Monorepo TypeScript de agentes y skills AI-powered construidos con Claude.
Agentes ejecutables por CLI o importables como librería. Skills reutilizables entre agentes.

## Stack

- TypeScript 5 strict, ESM
- pnpm workspaces
- Biome (lint + format)
- Vitest
- Anthropic SDK oficial (via `@claude-agents/shared`)
- Playwright (captura web)

## Setup

```bash
git clone git@github.com:bruno-avila21/claude-agents.git
cd claude-agents
pnpm install
cp .env.example .env
# Agregar ANTHROPIC_API_KEY
pnpm build
```

## Variables de entorno

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## Estructura

```
claude-agents/
├── shared/                       # Anthropic client, logger, tipos comunes
├── skills/
│   ├── playwright-capture/       # captura web: hidratación, lazy load, multi-viewport
│   ├── html-sanitizer/           # limpia clases autogeneradas, trackers, inline styles
│   ├── design-tokens/            # extrae paleta/fonts/spacing + tailwind config
│   ├── jsx-validator/            # valida JSX/TSX con Babel + retry loop
│   └── marketing-skills/         # auditors y frameworks para análisis de marketing
└── agents/
    ├── web2react/                 # clona web → componentes React reutilizables
    ├── code-reviewer/             # repo → SKILL.md / AGENTS.md
    ├── marketing-agents/          # content-generator, landing-auditor, pricing-advisor
    └── marketing-orchestrator/    # orquesta marketing-agents con feedback loop
```

## Agentes

### web2react

Clona un sitio web y genera componentes React reutilizables.

```bash
# Instalar Playwright (solo primera vez)
pnpm --filter @claude-agents/playwright-capture exec playwright install chromium

# Clonar un sitio
pnpm --filter @claude-agents/web2react start clone https://stripe.com \
  --out ./output/stripe \
  --framework next
```

**Pipeline:** segment → capture → crop → generate → assemble

### code-reviewer

Analiza un repo y genera `SKILL.md` / `AGENTS.md` específico para el proyecto.

```bash
pnpm --filter @claude-agents/code-reviewer start generate \
  --path /ruta/al/proyecto \
  --out /ruta/al/proyecto/AGENTS.md \
  --name AGENTS.md
```

### marketing-agents

content-generator, landing-auditor, pricing-advisor. Importables como librería:

```typescript
import { runLandingAuditor } from '@claude-agents/marketing-agents'
```

### marketing-orchestrator

Orquesta los marketing-agents con loop de feedback (decisor + metrics-store + feedback-loop).

## Scripts

```bash
pnpm build    # compila shared → skills → agents
pnpm test     # Vitest en todo el monorepo
pnpm lint     # Biome check
pnpm format   # Biome format --write
```

## Agregar skill nuevo

```
skills/<nombre>/
├── package.json    # name: @claude-agents/<nombre>
├── tsconfig.json   # extiende ../../tsconfig.base.json
├── src/index.ts
└── tests/
```

```bash
pnpm install   # pnpm workspaces detecta el nuevo package
pnpm build
```

## Agregar agente nuevo

```
agents/<nombre>/
├── package.json    # bin → dist/cli/main.js
├── tsconfig.json   # references a skills usadas
└── src/
    ├── index.ts    # API pública
    ├── types.ts
    ├── pipeline/   # una etapa por archivo
    └── cli/main.ts # commander entrypoint
```

## Reglas clave

- Llamadas a Claude: siempre via `@claude-agents/shared`, nunca instalar `@anthropic-ai/sdk` directamente
- Tests que llaman a Claude: mockear con `vi.mock('@claude-agents/shared')`
- Agents no dependen de otros agents — solo de skills y shared
- TypeScript strict: no `any`, no `@ts-ignore`
