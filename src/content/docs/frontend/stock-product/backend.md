---
title: Backend
description: API REST multi-tenant — Express + PostgreSQL, JWT, RBAC, Cloudflare R2, MercadoPago
wiki_managed: true
---

# Backend

API REST multi-tenant construida con Express y PostgreSQL. Gestiona autenticación, multi-tenancy, uploads a Cloudflare R2, pagos con MercadoPago y automatizaciones via Telegram.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js + Express | 4.18.2 | Framework web |
| PostgreSQL + `pg` | 8.13.1 | DB por tenant |
| jsonwebtoken | 9.0.3 | Auth JWT |
| bcryptjs | 3.0.3 | Hash de passwords |
| @aws-sdk/client-s3 | 3.x | Cloudflare R2 (uploads) |
| @anthropic-ai/sdk | 0.90.0 | Claude API |
| multer + sharp | 2.0 / 0.34.5 | Upload + resize de imágenes |
| mercadopago | 2.12.0 | Pagos y suscripciones |
| resend | 6.10.0 | Email transaccional |
| zod | 4.3.6 | Validación de schemas |
| helmet + cors | — | Seguridad |
| express-rate-limit | 8.3.2 | Rate limiting |
| node-cron | 4.2.1 | Jobs programados |
| @sentry/node | 10.47.0 | Error tracking |

## Variables de entorno

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=cambiar_en_produccion

# Master DB (Railway)
DATABASE_URL=postgres://...

# Multi-tenant
SAAS_DOMAIN=tuapp.com
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
FRONTEND_URL=https://admin.tuapp.com

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=stock-product-uploads
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# MercadoPago
MP_ACCESS_TOKEN=
MP_WEBHOOK_SECRET=
MP_PLAN_BASICO_ID=
MP_PLAN_PRO_ID=
MP_PLAN_ENTERPRISE_ID=

# Email
RESEND_API_KEY=

# Railway (provisioning)
RAILWAY_API_TOKEN=
RAILWAY_PROJECT_ID=

# Telegram bot (opcional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Google OAuth
GOOGLE_CLIENT_ID=

# n8n (opcional)
N8N_WEBHOOK_URL=

# Sentry (opcional)
SENTRY_DSN=
```

## Correr localmente

```bash
cd backend
cp .env.example .env
# completar .env

npm install
npm run dev      # nodemon/watch en :3001
```

## Comandos operacionales

```bash
npm run migrate               # Aplica migrations a TODOS los tenants
npm run provision             # Registrar nuevo tenant en master DB
npm run migrate:r2            # Migrar uploads locales → Cloudflare R2
npm run seed:presets          # Cargar presets de tema
npm run setup:local           # Setup completo para dev local
node scripts/verify-staging.js # Verificar entorno de staging
```

## Arquitectura de carpetas

```
backend/
├── server.js                    # Entry point (puerto 3001)
├── src/
│   ├── app.js                   # Config Express: middlewares, rutas
│   ├── config/
│   │   ├── baseDatos.js         # Pool multi-tenant + helpers consulta
│   │   ├── openapi.js           # Definición OpenAPI
│   │   └── seed.js              # Seed inicial
│   ├── controladores/           # Lógica de negocio (~32 archivos)
│   │   ├── authControlador.js
│   │   ├── productosControlador.js
│   │   ├── ventasControlador.js
│   │   ├── dashboardControlador.js
│   │   ├── temaControlador.js
│   │   └── __tests__/
│   ├── rutas/                   # Endpoints (~30 archivos)
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── tenantMiddleware.js  # X-Tenant-ID → eReq.pool
│   │   ├── autorizacion.js      # RBAC (ADMIN/VENDEDOR)
│   │   └── verificarApiKey.js   # Auth headless
│   ├── servicios/
│   │   ├── r2Servicio.js        # Cloudflare R2
│   │   ├── botTelegram.js       # Telegram bot
│   │   └── servicioPrecios.js
│   └── utils/
│       ├── calculosGastos.js
│       └── calculosPrecios.js
├── migrations/                  # SQL idempotentes (000_, 001_, ...)
│   ├── 000_master_schema.sql    # Master DB (tenants, planes)
│   ├── 001_schema_inicial.sql   # Schema base de tenant
│   ├── 003_theme_system.sql
│   ├── 004_billing.sql          # Suscripciones
│   └── 005_signup.sql
├── scripts/                     # Scripts operacionales
│   ├── migrate.js
│   ├── provision-tenant.js
│   └── migrar-uploads-r2.js
└── e2e/                         # Tests Playwright E2E
    ├── auth.spec.js
    └── ventas.spec.js
```

## Endpoints principales

### Autenticación (público)
```
POST /api/auth/login              { email, password } → token JWT
GET  /api/auth/me                 Usuario actual (JWT)
POST /api/auth/google             Google OAuth
GET  /api/auth/config             google_client_id público
```

### Productos (JWT)
```
GET    /api/productos             Lista + filtros + paginación
GET    /api/productos/:id         Detalle
GET    /api/productos/stock-bajo  Alertas de stock
POST   /api/productos             Crear
PUT    /api/productos/:id         Actualizar
DELETE /api/productos/:id         Eliminar
POST   /api/productos/actualizar-precio      Cambio de precio + historial
GET    /api/productos/exportar-excel         Exportar catálogo
POST   /api/productos/importar-excel/preview Previsualizar import
POST   /api/productos/importar-excel/confirmar Confirmar import
```

### Ventas (JWT)
```
GET    /api/ventas                Lista
GET    /api/ventas/resumen        Resumen por período
GET    /api/ventas/producto/:id   Ventas de 1 producto
POST   /api/ventas                Registrar 1 venta
POST   /api/ventas/masiva         Carrito múltiple
DELETE /api/ventas/:id            Eliminar
```

### Dashboard (JWT)
```
GET /api/dashboard/financiero?periodo=mes|semana|trimestre
```

### Catálogo público (sin auth)
```
GET /api/public/productos         Catálogo del tenant
GET /api/public/reviews           Reseñas aprobadas
POST /api/public/reviews          Crear reseña
GET /api/public/combos            Combos de productos
```

### Tema y branding
```
GET  /api/config/tema             CSS vars del tenant (público)
PUT  /api/config/tema             Actualizar (admin)
GET  /api/config/tema/presets     Lista de presets
POST /api/admin/preview-token     Token 15min para preview
GET  /api/tienda-config           Branding del tenant (público)
PATCH /api/tienda-config          Actualizar (admin)
```

### SaaS / Billing
```
GET    /api/planes                Lista de planes (público)
GET    /api/suscripciones         Suscripción del tenant (JWT)
POST   /api/signup                Registro self-service (público)
POST   /api/webhooks/mercadopago  Webhook MP (público)
GET    /api/tenant-from-domain    Resolver tenant desde dominio
GET    /api/salud                 Health check
GET    /docs                      Scalar UI (OpenAPI)
```

## Base de datos

### Master DB
```
tenants          — slug, nombre, db_url, plan, email_admin
planes           — básico, pro, enterprise
suscripciones    — MP subscriptions
custom_domains   — dominios personalizados
signup_pendientes
```

### Tenant DB (por tenant)
```
usuarios         — email, password (bcrypt), rol (ADMIN/VENDEDOR)
productos        — nombre, stock, costos, margen, imagen_url
historial_precios — registro de cambios de precio
ventas           — cantidad, precio, ganancia, método de pago
gastos           — gastos adicionales del negocio
categorias       — con color
proveedores      — datos de contacto
tema_config      — preset, modo claro/oscuro, branding
ordenes          — pedidos del storefront
api_keys         — para acceso headless
```

## Autenticación y seguridad

**JWT:**
- Token incluye: `{ id, email, nombre, rol, tenantSlug }`
- Validez: 7 días
- Validación cross-tenant: rechaza tokens de otro tenant

**RBAC — roles:**
- `ADMIN` — acceso total (usuarios, tema, exportar, api keys)
- `VENDEDOR` — productos, ventas, dashboard, proveedores

**API Key headless:**
- Header: `X-API-Key`
- Para integraciones programáticas sin usuario interactivo

## Upload de imágenes

```
Cliente → multer (memory) → sharp (resize) → R2 (storage) → URL pública
```

- Almacenamiento: Cloudflare R2 (compatible S3)
- URL pública: `R2_PUBLIC_URL/uploads/tenantSlug/archivo.jpg`
- Resize automático: sharp optimiza antes de subir

## Testing

```bash
cd backend
npm test                    # Vitest unitarios
npm run test:watch          # Modo watch
npm run test:e2e            # Playwright E2E (requiere servidor corriendo)
```
