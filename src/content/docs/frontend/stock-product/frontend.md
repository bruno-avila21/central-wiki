---
title: Frontend (Admin Dashboard)
description: Dashboard de administración multi-tenant — React 18 + Vite, sistema de temas CSS, React Router v6
wiki_managed: true
---

# Frontend — Dashboard de Administración

Panel de administración para gestionar inventario, ventas, reportes y configuración del tenant. Soporta temas visuales por tenant con modo oscuro.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| React | 18.3.1 | UI library |
| React Router DOM | 6.22.0 | Routing |
| Vite | 6.0.5 | Build tool |
| Tailwind CSS | 3.4.1 | Layout utilities |
| Recharts | 2.12.0 | Gráficos financieros |
| Lucide React | 0.344.0 | Íconos |
| @react-oauth/google | 0.13.5 | Google OAuth |

## Variables de entorno

```env
VITE_API_URL=http://localhost:3001/api
VITE_TENANT_ID=demo
VITE_STOREFRONT_URL=http://localhost:3000
```

## Correr localmente

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
                 # Proxy automático: /api → :3001
```

## Build y deploy

```bash
npm run build    # genera dist/
npm run preview  # preview del build en :4173
npm run lint     # ESLint
```

## Arquitectura de carpetas

```
frontend/src/
├── App.jsx                       # Router principal (React Router v6)
├── main.jsx                      # Entry point
├── paginas/                      # 20 páginas
│   ├── Dashboard.jsx             # KPIs financieros
│   ├── Productos.jsx             # CRUD + import/export Excel
│   ├── Ventas.jsx                # Registro de ventas
│   ├── Proveedores.jsx           # Gestión de proveedores
│   ├── Categorias.jsx            # Gestión de categorías
│   ├── Gastos.jsx                # Registro de gastos
│   ├── Usuarios.jsx              # Gestión de usuarios (admin)
│   ├── Pedidos.jsx               # Pedidos del storefront
│   ├── Reportes.jsx              # Reportes y análisis
│   ├── ConfiguracionTema.jsx     # Editor visual de tema
│   ├── ApiKeysPage.jsx           # API keys headless
│   ├── Login.jsx                 # Email/password + Google
│   ├── Registro.jsx              # Signup self-service
│   └── SuperAdminPanel.jsx       # Super admin
├── componentes/
│   ├── Layout/
│   │   ├── Layout.jsx            # Wrapper sidebar + header
│   │   ├── Sidebar.jsx           # Navegación lateral
│   │   └── Header.jsx            # Top bar
│   ├── UI/                       # Badge, Modal, Button, Input...
│   ├── Productos/                # FormularioProducto, ModalImagenes
│   ├── Ventas/                   # ModalVenta
│   ├── Pedidos/                  # ModalPedido
│   ├── BrandAnimation/           # Animaciones por template (SVGs)
│   ├── RutaProtegida.jsx         # Guard JWT
│   └── RutaAdmin.jsx             # Guard RBAC admin
├── contextos/
│   ├── AuthContext.jsx           # usuario, login, logout, esAdmin
│   └── ThemeContext.jsx          # preset, modo, cambiarPreset, alternarModo
├── hooks/
│   ├── useMouseParallax.js
│   └── useTenantBrandingAsync.js
├── servicios/
│   ├── api.js                    # Cliente HTTP (todos los endpoints)
│   └── temaServicio.js           # cargar/guardar tema
├── config/
│   └── temaConfig.js             # Presets de tema (colores, tokens CSS)
└── estilos/
    ├── variables.css             # --color-* tokens
    ├── theme.css                 # Tokens dinámicos por preset
    └── dark-mode.css             # Overrides modo oscuro
```

## Páginas y módulos

| Página | Ruta | Protección | Descripción |
|--------|------|-----------|-------------|
| Dashboard | `/dashboard` | JWT | KPIs: ingresos, gastos, ganancia, stock bajo |
| Productos | `/productos` | JWT | CRUD, importar/exportar Excel, actualizar precios |
| Ventas | `/ventas` | JWT | Individual y carrito múltiple, historial |
| Proveedores | `/proveedores` | JWT | CRUD, estadísticas por proveedor |
| Categorías | `/categorias` | JWT | CRUD con colores |
| Pedidos | `/pedidos` | JWT | Pedidos del storefront |
| Gastos | `/gastos` | JWT | Registro de gastos adicionales |
| Usuarios | `/usuarios` | JWT + ADMIN | Gestión de usuarios del tenant |
| Reportes | `/reportes` | JWT | Análisis y descarga de reportes |
| Config Tema | `/configuracion-tema` | JWT + ADMIN | Editor visual de colores/branding |
| API Keys | `/api-keys` | JWT + ADMIN | Keys para acceso headless |
| Login | `/login` | Público | Email/password + Google OAuth |
| Registro | `/registro` | Público | Signup self-service |
| Super Admin | `/super-admin` | Token estático | Panel de operaciones SaaS |

## Sistema de temas

Cada tenant puede personalizar colores, logo y modo oscuro. El tema se guarda en la DB y se aplica como CSS variables en `:root`.

**Presets disponibles:** `vaultec`, `indigo`, `verde`, `rojo` (y más).

**Modos:** `claro` / `oscuro`.

```css
/* Variables aplicadas dinámicamente */
--color-primary-50 ... --color-primary-900
--color-success-*, --color-danger-*
--color-bg, --color-text, --color-border
```

**Regla:** Nunca usar colores hardcodeados en hex. Solo `var(--color-*)`. Tailwind solo para layout (`flex`, `grid`, `p-4`).

**Persistencia:** `localStorage` (instantáneo) + tabla `tema_config` en la DB del tenant.

## Contextos globales

**AuthContext:**
```js
const { usuario, login, logout, esAdmin, esVendedor } = useAuth()
// usuario: { id, email, nombre, rol, tenantSlug }
```

**ThemeContext:**
```js
const { iPresetId, iModoId, cambiarPreset, alternarModo } = useTheme()
```

## API client — api.js

Todas las llamadas al backend van por `servicios/api.js`. El header `X-Tenant-ID` se inyecta automáticamente en cada request.

```js
// Auth
loginAsync(credenciales, tenantSlug)
loginGoogleAsync(credential)
obtenerUsuarioActualAsync()

// Productos
obtenerProductosAsync(filtros)      // { search, categoria, stockBajo }
crearProductoAsync(producto)
actualizarProductoAsync(id, datos)
eliminarProductoAsync(id)
obtenerStockBajoAsync()

// Ventas
registrarVentaAsync(venta)
registrarVentaMasivaAsync(items)    // carrito
obtenerVentasAsync(filtros)
obtenerVentasPorProductoAsync(productoId)

// Dashboard
obtenerEstadoFinancieroAsync(periodo)  // mes|semana|trimestre

// Tema
cargarTemaAsync()
guardarTemaAsync(tema)
```

## Testing

```bash
cd frontend
npm test                  # Vitest + Testing Library
npm run test:watch        # Modo watch
npm test -- NombrePagina  # Test específico
```

Tests en `__tests__/` al lado del archivo fuente. Patrón AAA, descripciones en español.
