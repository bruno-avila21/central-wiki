---
title: Bingo Quiniela
description: Juego de bingo/quiniela con Next.js 16, Supabase, MercadoPago y Resend
wiki_managed: true
---

# Bingo Quiniela

Aplicación web de bingo/quiniela interactivo. Compra de cartones con MercadoPago,
sorteo automático scrapeando la quiniela nacional/provincial, validación de ganadores
y notificaciones por email vía Resend.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.2 (App Router) | Framework |
| React | 19 | UI |
| TypeScript | 5 | Lenguaje |
| Tailwind CSS | 4 | Estilos |
| Supabase | 2.x | Auth + DB |
| MercadoPago | 2.x | Pagos |
| Resend | 6.x | Emails transaccionales |
| Vitest | 4.x | Tests |
| Vercel | — | Deploy |

## Correr localmente

```bash
git clone git@github.com:bruno-avila21/bingo-quiniela.git
cd bingo-quiniela
npm install
cp .env.example .env.local
# Completar variables de entorno
npm run dev   # http://localhost:3000
```

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
RESEND_API_KEY=
CRON_SECRET=
NEXT_PUBLIC_BASE_URL=http://localhost:3000
ADMIN_EMAIL=
QUINIELA_NACIONAL_URL=
QUINIELA_PROVINCIAL_URL=
```

## Módulos

- **Comprar**: flujo de compra de cartones con MercadoPago (checkout + webhook)
- **Mis cartones**: cartones del usuario autenticado con estado en tiempo real
- **Sorteo**: scraping de quiniela nacional/provincial + validación automática de ganadores
- **Admin**: panel de gestión de partidas, cartones y ganadores
- **Emails**: notificaciones con Resend (compra confirmada, ganador detectado)

## Estructura

```
app/
  (auth)/         # login, registro (Supabase Auth)
  admin/          # panel admin protegido
  comprar/        # compra de cartones
  mis-cartones/   # cartones del usuario
  api/
    payments/     # webhooks MercadoPago
    cards/        # generación de cartones
    admin/        # operaciones admin
    cron/         # sorteo programado
components/       # bingo-card, buy-form, game-banner
lib/
  game/           # card-generator, scraper, validator (lógica pura + tests)
  payments/       # integración MercadoPago
  email/          # templates Resend
  supabase/       # clientes SSR y browser
```

## Build y deploy

```bash
npm run build     # build producción
npm run test:run  # Vitest one-shot
```

Deploy automático en Vercel con cada push a `main`.
Supabase migrations via dashboard o CLI (`supabase db push`).
