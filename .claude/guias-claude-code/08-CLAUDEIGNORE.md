# Guia: .claudeignore — Que excluir de Claude Code

## Que es

`.claudeignore` funciona igual que `.gitignore` pero para Claude Code.
Le dice a Claude que archivos y carpetas **no debe leer, indexar ni recorrer**.

**Ubicacion:** Raiz del proyecto (`/.claudeignore`)

**Impacto:** Sin `.claudeignore`, Claude recorre TODO el proyecto incluyendo
`node_modules/` (1.3GB+), `.git/` (46MB+), binarios compilados, etc.
Esto puede desperdiciar **30-50K tokens por sesion** solo en escaneo.

---

## Template base (copiar y adaptar)

```gitignore
# ===========================
# .claudeignore
# ===========================

# Version control
.git/

# Dependencies (nunca leer paquetes de terceros)
node_modules/
**/node_modules/
.pnp/
.pnp.js

# Build outputs
bin/
obj/
dist/
build/
out/
.next/
.nuxt/
.output/

# Cache
.cache/
.turbo/
.parcel-cache/
.vite/
*.tsbuildinfo

# IDE y editores
.vs/
.vscode/settings.json
.idea/
*.swp
*.swo

# Bases de datos locales
*.db
*.db-shm
*.db-wal
*.sqlite
*.sqlite3

# Logs
*.log
logs/

# Archivos pesados
*.zip
*.tar.gz
*.rar
*.7z
*.exe
*.dll
*.so
*.dylib

# Coverage y reportes
coverage/
.nyc_output/
test-results/
playwright-report/

# Environment (seguridad)
.env
.env.*
!.env.example

# OS
Thumbs.db
.DS_Store

# SBOM y artefactos CI
*.cdx.json
*.spdx.json
```

---

## Por stack (agregar segun tu proyecto)

### .NET / C#
```gitignore
bin/
obj/
*.user
*.suo
*.cache
Debug/
Release/
packages/
*.nupkg
```

### React / Vite / Node
```gitignore
node_modules/
dist/
.vite/
*.tsbuildinfo
coverage/
playwright-report/
```

### Python
```gitignore
__pycache__/
*.pyc
.venv/
venv/
*.egg-info/
.pytest_cache/
.mypy_cache/
```

### Go
```gitignore
vendor/
*.exe
*.test
*.out
```

### Java / Kotlin
```gitignore
target/
*.class
*.jar
.gradle/
build/
```

---

## Que NO ignorar

| No ignorar | Por que |
|------------|---------|
| Archivos de config (`tsconfig.json`, `vite.config.ts`) | Claude los necesita para entender el build |
| `.env.example` | Claude necesita saber que variables existen |
| `package.json` / `*.csproj` | Claude necesita saber las dependencias |
| Lock files (`package-lock.json`) | Claude puede necesitarlos para resolver conflictos |
| Tests | Claude los lee y genera |
| Migraciones | Claude necesita el historial de schema |
| CLAUDE.md, AGENTS.md | Obvio, son sus instrucciones |

---

## Diferencia con .gitignore

| Aspecto | .gitignore | .claudeignore |
|---------|------------|---------------|
| Proposito | Que no trackear en git | Que Claude no debe leer |
| Afecta | Git | Claude Code |
| Se solapan | Si, parcialmente | Si, pero con adiciones |

**Regla practica:** Todo lo que esta en `.gitignore` deberia estar en `.claudeignore`,
MAS archivos que git si trackea pero Claude no necesita (ej: imagenes, PDFs, archivos grandes).

```gitignore
# Agregar al .claudeignore cosas que git SI trackea pero Claude NO necesita:
*.png
*.jpg
*.svg
*.ico
*.woff
*.woff2
*.ttf
*.eot
*.mp4
*.pdf
public/images/
```

---

## Errores comunes

| Error | Consecuencia |
|-------|-------------|
| No crear .claudeignore | Claude escanea node_modules (miles de archivos) |
| Ignorar archivos de config | Claude no entiende como compilar |
| No ignorar .git/ | Claude lee el historial completo (46MB+) |
| No ignorar binarios/imagenes | Tokens gastados en archivos que no puede interpretar |
| Ignorar tests | Claude no puede verificar que su codigo funciona |
| Ignorar migraciones | Claude no sabe el estado actual del schema |

---

## Verificar que funciona

Despues de crear el `.claudeignore`, en una sesion nueva de Claude Code
pedi que liste la estructura del proyecto. No deberia mostrar `node_modules/`,
`bin/`, `obj/`, ni los demas directorios excluidos.
