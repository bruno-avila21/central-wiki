---
title: Stock Product — Storefront
description: Tienda ecommerce customer-facing multi-tenant con sistema de templates white-label
wiki_managed: true
---

# Storefront

Ecommerce customer-facing del SaaS. Cada tenant tiene su propia tienda con marca, colores y templates configurables desde el backend. No usa React Router — la navegación es estado interno.

## Stack

| Tecnología | Versión |
|------------|---------|
| React | 18.3 |
| Vite | 5.3 |
| Tailwind CSS | 3.4 |
| Framer Motion | 11 |
| Lucide React | 0.400 |

## Correr localmente

```bash
cd storefront
npm install
npm run dev   # http://localhost:3000
```

> El puerto 3000 entra en conflicto con `ecommerce-saas`. Nunca correr ambos a la vez.

## Variables de entorno

```env
VITE_API_URL=http://localhost:3001/api
VITE_API_BASE_URL=http://localhost:3001
VITE_UPLOADS_URL=http://localhost:3001/uploads
VITE_TENANT_ID=demo
VITE_STOREFRONT_USER=storefront@tienda.com
VITE_STOREFRONT_PASS=password_readonly

# White-label (fallback si el backend no responde)
VITE_BRAND_NAME=AutoLux
VITE_BRAND_TAGLINE=Encontrá tu próximo vehículo
VITE_ACCENT_COLOR=#c9a84c
VITE_WHATSAPP=+5491112345678
```

## Arquitectura de carpetas

```
storefront/src/
├── App.jsx                        # Shell: rutas como estado + AnimatePresence
├── config/
│   └── storefrontConfig.js        # Config de marca por defecto (fallback)
├── contextos/
│   └── StoreConfigContext.jsx     # Provider: hidrata config desde el backend
├── servicios/
│   └── api.js                     # Cliente HTTP: auto-login, tenant header, mapper
├── paginas/
│   ├── LandingPage.jsx            # Solo para template automotriz-clasico
│   ├── CatalogPage.jsx            # Grid de productos con filtros
│   └── ProductDetailPage.jsx      # Detalle con galería
├── templates/
│   └── {nombre}/
│       ├── Hero.jsx               # Hero propio del template (NUNCA importar LandingPage)
│       ├── Hero.css               # Estilos BEM con prefijo único
│       ├── theme-defaults.css     # Variables --sf-* del tema
│       └── index.jsx              # Orquestador del template
└── componentes/
    └── storefront/
        ├── Navbar.jsx
        ├── Footer.jsx
        └── WhatsAppBridge.jsx
```

## Navegación (sin React Router)

```js
const ROUTES = { landing: 'landing', catalog: 'catalog', detail: 'detail' };
const [page, setPage] = useState(ROUTES.landing);

// Navegar
navigate(ROUTES.catalog, { search: 'Toyota' });
navigate(ROUTES.detail, { product: productoObj });
```

**Nunca:** `window.location.href`, `<a href>`, `<Link>`, `useNavigate`.

## Config dinámica desde el backend

```js
const { brand, copy, theme, navItems } = useStoreConfig();

// Campos válidos de brand:
brand.name        // ✅
brand.tagline     // ✅
brand.description // ✅
brand.logoUrl     // ✅
brand.whatsapp    // ✅

brand.nombre      // ❌ NO EXISTE — devuelve undefined silencioso
brand.descripcion // ❌ NO EXISTE
```

## Estilos — CSS variables (OBLIGATORIO)

```css
color: var(--sf-accent);
background: var(--sf-hero-bg);
border-radius: var(--sf-radius);
```

**Nunca** hardcodear colores en hex ni inline styles.

## Templates disponibles

| Template | Prefijo BEM |
|----------|------------|
| automotriz-clasico | `.ac-hero` |
| automotriz-premium | `.ap-hero` |
| blanqueria-1 | `.bl1-hero` |
| blanqueria-2 | `.bl2-hero` |
| blanqueria-3 | `.bl3-hero` |
| indumentaria-1 | `.ind1-hero` |
| indumentaria-2 | `.ind2-hero` |
| bazar-1 | `.bz1-hero` |
| bazar-2 | `.bz2-hero` |

Cada template DEBE tener: `Hero.jsx`, `Hero.css`, `theme-defaults.css`, `index.jsx`.

## Comunicación con el backend

Todo via `servicios/api.js`. **Nunca `fetch` directo en componentes.**

El token JWT se gestiona en memoria y se renueva automáticamente cada 55 minutos.

```js
// Funciones exportadas
fetchProductos(params)          // { search, category, priceMax }
fetchProducto(id)
fetchImagenesProducto(id)
fetchCategorias()
```

## Bugs conocidos (no repetir)

| Bug | Causa | Fix |
|-----|-------|-----|
| `brand.nombre` → undefined | Campo no existe | Usar `brand.name` |
| `brand.descripcion` → undefined | Campo no existe | Usar `brand.description` |
| Template importa LandingPage | LandingPage es solo automotriz-clasico | Crear propio `Hero.jsx` |
| Puerto 3000 ocupado | Conflicto con ecommerce-saas | Usar `detener_proyecto.bat` |

## Verificación post-implementación

Después de crear o modificar un template, correr el agente `storefront-template-verifier` disponible en `~/.claude/agents/`.
