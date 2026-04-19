---
title: Claude Agents
description: Monorepo de agentes y skills IA construidos con Claude — web2react, code-reviewer y más
wiki_managed: true
---

# claude-agents

Monorepo de agentes y skills AI-powered construidos con Claude. Agentes ejecutables por CLI, skills reutilizables entre agentes.

## Estructura

```
claude-agents/
├── shared/                      # tipos, Anthropic client, logger
├── skills/
│   ├── playwright-capture/      # captura de webs con hidratación, lazy load, multi-viewport
│   ├── html-sanitizer/          # limpia clases autogeneradas, trackers, inline styles
│   ├── design-tokens/           # extrae paleta/fonts/spacing por frecuencia + tailwind config
│   └── jsx-validator/           # valida JSX/TSX con Babel + TS compiler API + retry loop
└── agents/
    ├── web2react/               # clona una web y genera componentes React reutilizables
    └── code-reviewer/           # analiza un repo y genera SKILL.md/AGENTS.md específico
```

## Setup

```bash
pnpm install
cp .env.example .env
# Editar .env con tu ANTHROPIC_API_KEY
pnpm build
```

## Uso

### web2react

```bash
# Instalar Playwright browsers (solo primera vez)
pnpm --filter @claude-agents/playwright-capture exec playwright install chromium

# Clonar una web
pnpm --filter @claude-agents/web2react start clone https://stripe.com \
  --out ./output/stripe \
  --framework next
```

### code-reviewer

```bash
# Generar SKILL.md para cualquier proyecto
pnpm --filter @claude-agents/code-reviewer start generate \
  --path /ruta/a/tu/proyecto \
  --out /ruta/a/tu/proyecto/SKILL.md \
  --name SKILL.md
```

## Scripts

- `pnpm build` — compila todos los packages
- `pnpm test` — corre Vitest en todo el monorepo
- `pnpm lint` — Biome
- `pnpm format` — Biome format write

## Agregar un skill nuevo

Si ya tenés skills hechas, copialas a `skills/<nombre>/` respetando esta estructura mínima:

```
skills/<nombre>/
├── package.json                 # name: @claude-agents/<nombre>
├── tsconfig.json                # extiende ../../tsconfig.base.json
├── src/index.ts
└── tests/*.test.ts              # opcional pero recomendado
```

Después corré `pnpm install` para que pnpm workspaces lo detecte.

## Agregar un agente nuevo

```
agents/<nombre>/
├── package.json                 # con bin pointando al CLI
├── tsconfig.json
└── src/
    ├── index.ts                 # exporta la API pública
    ├── types.ts
    ├── pipeline/                # una carpeta por etapa
    └── cli/main.ts              # entrypoint CLI con commander
```

## Stack

- TypeScript estricto, ESM.
- pnpm workspaces.
- Biome (lint + format).
- Vitest.
- Anthropic SDK oficial.
- GitHub Actions CI.

## Licencia

MIT
