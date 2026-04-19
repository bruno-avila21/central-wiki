# central-wiki — CLAUDE.md

Portal de documentación centralizado construido con Astro Starlight. Se despliega automáticamente en GitHub Pages con cada push a `main`.

## Comandos

```bash
npm run dev      # servidor local http://localhost:4321
npm run build    # build de producción → dist/
npm run preview  # previsualiza el build en :4321
```

## Estructura del contenido

```
src/content/docs/
├── index.mdx                    # Página principal (splash)
├── novedades.md                 # Registro de novedades
├── frontend/                    # Proyectos frontend
├── backend/                     # Proyectos backend
├── agentes/                     # Agentes y skills IA
└── infraestructura/             # Infra, CI/CD, Docker
```

## Sistema de sincronización automática

Los repos externos pushean a este wiki via `repository_dispatch`:

1. **`notify-wiki.yml`** (en cada repo externo): detecta cambios en `README.md` y dispara el evento `readme-updated`
2. **`sync-readmes.yml`** (en este repo): recibe el evento, fetcha el README, lo convierte en página Starlight y hace commit

El mapeo repo → categoría vive en `sync-config.json`.

### Flag `wiki_managed: true`

Cualquier página con `wiki_managed: true` en el frontmatter es ignorada por el sync automático. Úsalo cuando el contenido del wiki sea más rico que el README del repo.

### Agregar un proyecto nuevo

1. Agregar entrada en `sync-config.json`: `"nombre-repo": "categoria"`
2. Instalar `notify-wiki.yml` en el repo externo con el secret `WIKI_SYNC_TOKEN`
3. O crear la página manualmente con `wiki_managed: true`

## Configuración de Astro

`astro.config.mjs` — Starlight 0.38+. El sidebar usa `autogenerate` por directorio. Para agregar una sección nueva, crear la carpeta en `src/content/docs/` y añadirla al array `sidebar`.

## CSS / Tema

`src/styles/custom.css` — tema Deep Space completo. Variables clave:
- `--sl-color-accent`: `#7c3aed` (violeta principal)
- Dark mode: `:root:not([data-theme='light'])`
- Light mode: `:root[data-theme='light']`

No usar `@layer` para overrides — los estilos sin layer siempre ganan a los de Starlight.
