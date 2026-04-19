---
title: Bingo Quiniela
description: Juego de bingo/quiniela interactivo con gestión de partidas y cartones
wiki_managed: true
---

# Bingo Quiniela

Aplicación web de bingo interactivo con flujo completo de partidas: generación de cartones, sorteo de números y verificación de ganadores en tiempo real.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Runtime | Node.js 18+ |
| Deploy | Vercel |

## Qué hace

- Genera cartones de bingo únicos con distribución aleatoria
- Sorteo de números con historial visible
- Validación automática de cartones ganadores (línea, bingo)
- Interfaz responsive para jugar desde el celular

## Correr localmente

```bash
git clone git@github.com:bruno-avila21/bingo-quiniela.git
cd bingo-quiniela
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Variables de entorno

Este proyecto no requiere variables de entorno para desarrollo local. Todo corre en el browser.

## Build y deploy

```bash
# Build de producción
npm run build
npm start

# Deploy en Vercel (automático con push a main)
# Conectar el repo en vercel.com → se deploya solo
```

## Estructura

```
bingo-quiniela/
├── app/
│   ├── page.tsx          # pantalla principal
│   ├── juego/            # lógica de partida
│   └── layout.tsx
├── components/
│   ├── Carton.tsx        # componente de cartón individual
│   ├── Sorteo.tsx        # bola de sorteo animada
│   └── Tablero.tsx       # tablero de números sorteados
├── lib/
│   └── bingo.ts          # lógica de generación y validación
└── public/
```
