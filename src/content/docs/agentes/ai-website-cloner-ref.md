---
title: AI Website Cloner (Referencia)
description: Template de referencia para clonar sitios web con agentes de IA — Next.js + Claude Code + skill /clone-website
---

# AI Website Cloner (Referencia)

Template reutilizable para hacer reverse-engineering de cualquier sitio web en un codebase Next.js moderno, usando agentes de IA. Basado en el proyecto open source de JCodesMore.

## Stack

- **Next.js 16** — App Router, React 19, TypeScript strict
- **shadcn/ui** — Radix primitives + Tailwind CSS v4
- **Tailwind CSS v4** — oklch design tokens
- **Lucide React** — íconos (reemplazados por SVGs extraídos durante el clonado)

## Cómo funciona

El skill `/clone-website` ejecuta un pipeline multi-fase:

1. **Reconnaissance** — screenshots, extracción de design tokens, sweep de interacciones (scroll, click, hover, responsive)
2. **Foundation** — actualiza fonts, colores, globals, descarga assets
3. **Component Specs** — escribe specs detalladas (`docs/research/components/`) con valores CSS exactos, estados y comportamientos
4. **Parallel Build** — despacha agentes builders en git worktrees, uno por sección/componente
5. **Assembly & QA** — mergea worktrees, conecta la página, corre diff visual contra el original

## Quick Start

```bash
git clone https://github.com/JCodesMore/ai-website-cloner-template.git my-clone
cd my-clone
npm install
claude --chrome
# En Claude Code:
/clone-website <target-url>
```

## Casos de uso

- **Migración de plataforma** — pasar un sitio de WordPress/Webflow/Squarespace a Next.js
- **Código perdido** — el sitio está live pero el repo no existe o el stack es legacy
- **Aprendizaje** — deconstruir cómo sitios de producción logran layouts, animaciones y comportamiento responsive

## Estructura

```
src/
  app/              # Next.js routes
  components/       # React components
    ui/             # shadcn/ui primitives
    icons.tsx       # SVGs extraídos
  lib/utils.ts      # cn() utility
docs/
  research/         # Specs de componentes extraídos
  design-references/ # Screenshots de referencia
scripts/
  sync-agent-rules.sh  # Regenera archivos de instrucciones por agente
  sync-skills.mjs      # Regenera /clone-website para todas las plataformas
```

## Comandos

```bash
npm run dev        # Dev server
npm run build      # Build de producción
npm run check      # lint + typecheck + build
```

## Agentes soportados

Claude Code (recomendado con Opus 4), Codex CLI, OpenCode, GitHub Copilot, Cursor, Windsurf, Gemini CLI, Cline, Roo Code, Continue, Amazon Q, Augment Code, Aider.
