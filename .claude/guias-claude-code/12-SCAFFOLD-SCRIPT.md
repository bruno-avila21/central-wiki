# Guia: Script de Scaffold — Generar estructura .claude/ para un proyecto nuevo

## Que es

Un script que genera toda la estructura de `.claude/`, `CLAUDE.md`, `AGENTS.md`
y `.claudeignore` en un proyecto nuevo. Copiar, adaptar, ejecutar.

---

## Script Bash (copiar y ejecutar en la raiz del proyecto)

```bash
#!/bin/bash
# =============================================================
# scaffold-claude.sh
# Genera la estructura completa de Claude Code para un proyecto
# Ejecutar desde la raiz del proyecto: bash scaffold-claude.sh
# =============================================================

set -e

echo "=== Scaffolding Claude Code config ==="

# -----------------------------------------------
# 1. Crear estructura de carpetas
# -----------------------------------------------
mkdir -p .claude/agents
mkdir -p .claude/commands
mkdir -p .claude/skills/_shared

echo "[OK] Carpetas creadas"

# -----------------------------------------------
# 2. .claudeignore
# -----------------------------------------------
cat > .claudeignore << 'IGNORE'
# Dependencies
node_modules/
**/node_modules/

# Version control
.git/

# Build outputs
bin/
obj/
dist/
build/
out/
.next/
.nuxt/

# Cache
.cache/
.turbo/
.vite/
*.tsbuildinfo

# IDE
.vs/
.idea/

# Databases
*.db
*.db-shm
*.db-wal
*.sqlite

# Logs & temp
*.log
logs/
tmp/

# Binarios y media
*.zip
*.tar.gz
*.exe
*.dll
*.png
*.jpg
*.svg
*.ico
*.woff
*.woff2
*.mp4
*.pdf

# Coverage
coverage/
.nyc_output/
test-results/
playwright-report/

# Environment
.env
.env.*
!.env.example
IGNORE

echo "[OK] .claudeignore creado"

# -----------------------------------------------
# 3. CLAUDE.md (template a completar)
# -----------------------------------------------
if [ ! -f CLAUDE.md ]; then
cat > CLAUDE.md << 'CLAUDE'
# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Repository Overview

<!-- Completar: que es el proyecto, cuantas apps, stack principal -->

- **app1/** — Descripcion (stack)
- **app2/** — Descripcion (stack)

## Build & Development Commands

### App 1
```bash
# Completar
```

### App 2
```bash
# Completar
```

## Architecture

<!-- Completar: capas, responsabilidades, patrones de DI, acceso a datos -->

## Naming Conventions

### Backend
<!-- Completar -->

### Frontend
<!-- Completar -->

## Critical Rules

<!-- Completar con las reglas que si se rompen causan bugs -->

- **TypeScript strict** — no `any`, no `@ts-ignore`
- **No packages** without explicit approval
- **No hardcoded strings/colors** — use config/variables

## Per-App AGENTS.md Files

<!-- Completar con las rutas a cada AGENTS.md -->
CLAUDE

echo "[OK] CLAUDE.md creado (template a completar)"
else
echo "[SKIP] CLAUDE.md ya existe"
fi

# -----------------------------------------------
# 4. AGENTS.md template para una app
# -----------------------------------------------
create_agents_md() {
  local dir=$1
  local name=$2
  if [ -d "$dir" ] && [ ! -f "$dir/AGENTS.md" ]; then
    cat > "$dir/AGENTS.md" << AGENTS
# AGENTS.md — $name

## Rol
<!-- Completar: que tipo de engineer, que implementa -->

## Stack
<!-- Completar: framework, lenguaje, ORM, state management -->

## Estructura de carpetas
\`\`\`
src/
  <!-- Completar -->
\`\`\`

## Patrones de Codigo

### Patron principal
\`\`\`
// Completar con template copiable
\`\`\`

## Naming Conventions

| Que | Convencion | Ejemplo |
|-----|-----------|---------|
| <!-- completar --> | | |

## Reglas Criticas

1. **NUNCA** <!-- completar -->
2. **SIEMPRE** <!-- completar -->

## Forbidden Patterns

\`\`\`
// MAL
// Completar

// BIEN
// Completar
\`\`\`
AGENTS

    echo "[OK] $dir/AGENTS.md creado (template)"
  fi
}

# Detectar carpetas de apps y crear AGENTS.md
for dir in */; do
  if [ -f "$dir/package.json" ] || [ -f "$dir/*.csproj" ] || [ -f "$dir/Cargo.toml" ] || [ -f "$dir/go.mod" ]; then
    create_agents_md "$dir" "$dir"
  fi
done

# -----------------------------------------------
# 5. Agentes base
# -----------------------------------------------

# Orquestador
cat > .claude/agents/orquestador.md << 'ORCH'
---
name: orquestador
description: >
  Orquestador principal para desarrollo de funcionalidades completas.
  Coordina subagentes para cada capa del proyecto.
model: opus
---

# Agente Orquestador

Coordinas el desarrollo completo de funcionalidades.

## Fase 1: Deteccion de Alcance
Determinar que apps se tocan y que artefactos generar.

## Fase 2: Plan (OBLIGATORIO antes de codigo)
1. Analizar requerimiento
2. Listar artefactos por app
3. Definir orden de ejecucion
4. Esperar aprobacion del usuario

## Fase 3: Ejecucion con Subagentes
<!-- Completar con las oleadas de tu proyecto -->

### Oleada 1: Backend
Lanzar `agente-backend` con: endpoints, DTOs, reglas

### Oleada 2: Frontend (PARALELO si son independientes)
Lanzar `agente-frontend` con: pantallas, endpoints disponibles

### Oleada 3: Compilacion
Lanzar `agente-compilacion`

## Fase 4: Validacion Final
- [ ] Backend compila
- [ ] Frontend compila
- [ ] Lint sin warnings
- [ ] No hay `any` en TypeScript
ORCH

# Compilacion
cat > .claude/agents/agente-compilacion.md << 'COMP'
---
name: agente-compilacion
description: >
  Compila el proyecto completo y corrige errores iterativamente.
model: sonnet
---

# Agente: Compilacion

Compilas y validas el proyecto completo.

## Paso 1: Backend
```bash
# Completar: comando de build
```
Si hay errores: analizar, corregir, re-ejecutar.

## Paso 2: Frontend
```bash
# Completar: lint + build
```

## Reglas
1. Lint DEBE pasar con CERO warnings
2. Maximo 5 iteraciones de correccion
3. Solo corregir errores de compilacion — no tocar codigo funcional

## Al Finalizar
Reportar: BUILD OK/FAILED por cada app
COMP

echo "[OK] Agentes base creados"

# -----------------------------------------------
# 6. Command de desarrollo
# -----------------------------------------------
cat > .claude/commands/dev.md << 'DEV'
# Desarrollo de Funcionalidades

Orquestador para desarrollo de funcionalidades completas.

## Parametros
- **$ARGUMENTS**: Ruta a documento funcional (.md), URL de Figma, o texto libre

## Ejemplos
```
/dev docs/feature.md
/dev Crear endpoint de consulta de saldo
```

## Ejecucion
1. Leer AGENTS.md de las apps afectadas
2. Planificar (modo plan obligatorio)
3. Ejecutar oleadas con subagentes via agente orquestador
DEV

echo "[OK] Command /dev creado"

# -----------------------------------------------
# 7. Skills index
# -----------------------------------------------
cat > .claude/skills/SKILLS-INDEX.md << 'INDEX'
# Skills Index

Indice de skills disponibles. Leer el SKILL.md completo SOLO al ejecutar.

| Skill | Archivo | Que hace | Parametros |
|-------|---------|----------|------------|
| <!-- completar --> | | | |
INDEX

echo "[OK] Skills index creado"

# -----------------------------------------------
# 8. settings.json (compartido con el equipo)
# -----------------------------------------------
if [ ! -f .claude/settings.json ]; then
cat > .claude/settings.json << 'SETTINGS'
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git branch*)",
      "Bash(ls*)",
      "Bash(wc*)"
    ]
  }
}
SETTINGS

echo "[OK] settings.json creado"
else
echo "[SKIP] settings.json ya existe"
fi

# -----------------------------------------------
# 9. Secciones compartidas placeholder
# -----------------------------------------------
cat > .claude/skills/_shared/README.md << 'SHARED'
# Secciones Compartidas

Archivos con instrucciones reutilizables entre skills.
En vez de duplicar secciones, referenciar:

```markdown
Seguir las instrucciones de `.claude/skills/_shared/nombre.md`
```

## Archivos sugeridos:
- `validacion-repo.md` — Paso de validacion de repositorio
- `reglas-encoding.md` — Verificacion de encoding
- `formato-reporte.md` — Template de reportes
SHARED

echo "[OK] Carpeta _shared creada"

# -----------------------------------------------
echo ""
echo "=== Scaffold completado ==="
echo ""
echo "Proximos pasos:"
echo "  1. Completar CLAUDE.md con la info de tu proyecto"
echo "  2. Completar AGENTS.md de cada app con patrones de codigo"
echo "  3. Crear agentes especificos en .claude/agents/"
echo "  4. Crear skills en .claude/skills/{nombre}/SKILL.md"
echo "  5. Agregar commands en .claude/commands/"
echo "  6. Actualizar SKILLS-INDEX.md"
echo ""
```

---

## Uso

```bash
# Desde la raiz de tu proyecto nuevo:
bash scaffold-claude.sh

# O si lo tenes en algun lugar central:
bash ~/scripts/scaffold-claude.sh
```

**Output:**
```
=== Scaffolding Claude Code config ===
[OK] Carpetas creadas
[OK] .claudeignore creado
[OK] CLAUDE.md creado (template a completar)
[OK] api/AGENTS.md creado (template)
[OK] web/AGENTS.md creado (template)
[OK] Agentes base creados
[OK] Command /dev creado
[OK] Skills index creado
[OK] settings.json creado
[OK] Carpeta _shared creada

=== Scaffold completado ===

Proximos pasos:
  1. Completar CLAUDE.md con la info de tu proyecto
  2. Completar AGENTS.md de cada app con patrones de codigo
  ...
```

---

## Despues del scaffold

El script genera **templates a completar**, no archivos finales.
Las secciones marcadas con `<!-- Completar -->` son las que necesitas llenar
con la informacion especifica de tu proyecto.

### Orden recomendado para completar

1. **CLAUDE.md** — lo primero, es el mapa general
2. **AGENTS.md** por app — patrones de codigo especificos
3. **.claudeignore** — ajustar a tu stack (el template es generico)
4. **Agentes** — adaptar orquestador y crear ejecutores por app
5. **Skills** — crear segun los workflows que necesites
6. **Commands** — interfaz del usuario
7. **settings.json** — permisos y hooks
