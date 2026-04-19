---
title: Ecommerce SaaS
description: Storefront SPA white-label — React 18 + Vite, dockerizable con Nginx
wiki_managed: true
---

# Ecommerce SaaS

Storefront ecommerce SPA white-label. No tiene backend propio: se conecta al API de stock-product.
Deploy como imagen Docker multi-stage (Nginx sirve el build de Vite).

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.3 | UI |
| Vite | 5.3 | Build tool (puerto dev: 3000) |
| Tailwind CSS | 3.4 | Layout utilities |
| Framer Motion | 11 | Transiciones de página |
| Lucide React | 0.400 | Íconos |
| Nginx | alpine | Sirve el SPA en producción |
| Docker | multi-stage | Build → Nginx |

## Correr localmente

```bash
cd ecommerce-saas
npm install
npm run dev      # http://localhost:3000
                 # Proxy automático: /api → :3001 (backend stock-product)
```

> Requiere que el backend de stock-product esté corriendo en `:3001`.

## Variables de entorno

Copiar `.env.example` → `.env`:

```env
VITE_API_URL=/api
VITE_UPLOADS_URL=http://localhost:3001/uploads
VITE_STOREFRONT_USER=admin
VITE_STOREFRONT_PASS=admin123

# White-label (marca del tenant)
VITE_BRAND_NAME=AutoLux
VITE_BRAND_TAGLINE=Encontrá tu próximo vehículo
VITE_BRAND_DESC=Los mejores vehículos seleccionados para vos.
VITE_WHATSAPP=+5491112345678
VITE_EMAIL=contacto@autolux.com.ar

# Colores de acento
VITE_ACCENT_COLOR=#c9a84c
VITE_ACCENT_LIGHT=#f5ecd4
VITE_ACCENT_DARK=#a07830
```

> Las variables `VITE_*` se "queman" en build time — no son runtime.

## Build Docker

```bash
docker build \
  --build-arg VITE_API_URL=https://api.tudominio.com/api \
  --build-arg VITE_UPLOADS_URL=https://api.tudominio.com/uploads \
  --build-arg VITE_BRAND_NAME="Mi Tienda" \
  --build-arg VITE_ACCENT_COLOR=#2563eb \
  --build-arg VITE_STOREFRONT_USER=readonly@tienda.com \
  --build-arg VITE_STOREFRONT_PASS=mipass \
  -t ecommerce-saas .

docker run -p 8080:8080 ecommerce-saas
# → http://localhost:8080
```

## Arquitectura

```
src/
├── App.jsx                      # Shell: ROUTES como estado + AnimatePresence
├── config/storefrontConfig.js   # Brand defaults + applyTheme()
├── contextos/StoreConfigContext # Provider: brand, theme, navItems del backend
├── servicios/api.js             # Cliente HTTP — único punto de acceso al backend
├── paginas/
│   ├── LandingPage.jsx          # Hero + presentación
│   ├── CatalogPage.jsx          # Grid de productos + filtros
│   └── ProductDetailPage.jsx    # Galería + detalle
└── componentes/
    ├── storefront/              # Navbar, Footer, WhatsApp, Hero, SocialProof
    └── admin/                   # CustomAttributesBuilder
```

## Navegación

Sin React Router — navegación por estado interno:

```js
const ROUTES = { landing: 'landing', catalog: 'catalog', detail: 'detail' };
const [page, setPage] = useState(ROUTES.landing);

navigate(ROUTES.catalog, { search: 'Toyota' });
navigate(ROUTES.detail, { product: productoObj });
```

**Nunca:** `window.location.href`, `<Link>`, `useNavigate`.

## Comandos útiles

```bash
npm run build    # genera dist/
npm run preview  # sirve el build en :4173
```
