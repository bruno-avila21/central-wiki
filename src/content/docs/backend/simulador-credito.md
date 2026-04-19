---
title: Simulador de Crédito
description: Widget React embebible para simulación de créditos — IIFE + ESM + demo standalone + Vercel Functions
wiki_managed: true
---

# Simulador de Crédito

Widget React embebible para simulación de créditos en pesos argentinos. Se distribuye como IIFE
(`<script>` tag en cualquier sitio) o ESM (import), y también como app standalone.
Incluye una Vercel Function para obtener TNA desde la API del BCRA.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 19 | UI del widget |
| TypeScript | 5.x | Lenguaje |
| Vite | 6.x | Build tool (library mode) |
| Recharts | 2.x | Gráficos de amortización |
| Vitest + Testing Library | 2.x | Tests |
| @vercel/node | 4.x | Vercel Functions |
| pnpm | — | Package manager |
| Vercel | — | Deploy |

## Builds de salida

| Archivo | Uso |
|---------|-----|
| `dist/simulador.iife.js` | Embebible vía `<script>` tag — define `window.SimuladorCredito` |
| `dist/simulador.es.js` | ESM para import como paquete |
| `demo/dist/` | App standalone hosteada en Vercel |

## Correr localmente

```bash
pnpm install
pnpm dev           # Demo standalone en http://localhost:5173
pnpm build:widget  # dist/simulador.iife.js + dist/simulador.es.js
pnpm build:demo    # demo/dist/
pnpm test          # Vitest
```

## Uso embebido

```html
<script src="simulador.iife.js"></script>
<script>
  window.SimuladorCredito.init({
    container: '#mi-simulador',
    config: {
      montoMin: 10000,
      montoMax: 5000000,
      plazoOpciones: [6, 12, 18, 24, 36, 48],
      tna: 0.45,
      tema: 'light',
    }
  });
</script>
```

## Estructura

```
src/
  components/     # Componentes React (sin business logic)
  hooks/          # Lógica de estado y cálculos
  utils/          # Funciones puras: cuotas, amortización, TNA→TEA
  types/          # TypeScript interfaces
  styles/         # CSS scoped (.sc-* — no colisiona con el host)
  embed.ts        # Entry point IIFE
  index.ts        # Entry point ESM
demo/
  vite.config.ts  # Config para la app standalone
api/
  tna.ts          # Vercel Function — TNA desde BCRA
  _lib/bcra.ts    # Fetch a API del BCRA
```

## Deploy

Vercel — automático con push a `main`.
Demo standalone y Vercel Functions se despliegan juntas.
