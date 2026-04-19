# Guia: Como crear Commands (.claude/commands/)

## Que son

Los commands son **slash commands** que el usuario tipea en Claude Code.
Son la **interfaz de usuario** — el punto de entrada para invocar workflows.

Cuando el usuario escribe `/nombre-command argumentos`, Claude Code lee el archivo
`.claude/commands/nombre-command.md` y ejecuta lo que dice.

**Ubicacion:** `.claude/commands/{nombre}.md`

El usuario los invoca con: `/nombre` (sin la extension .md)

---

## Para que se usan (ejemplos reales)

| Command | Que hace |
|---------|----------|
| `/desarrollo docs/feature.md` | Orquesta desarrollo fullstack de una feature |
| `/code-review 991` | Hace code review de un PR |
| `/at YH-342` | Analisis tecnico de un ticket Jira |
| `/testing-unitario` | Genera tests unitarios |
| `/cambio-version` | Workflow de cambio de version + release |
| `/merge-pr 55` | Mergea un PR resolviendo conflictos |

---

## Anatomia de un command

### Command simple (invoca un skill)

```markdown
# Nombre del Command

Descripcion breve de que hace.

## Parametros

- **$ARGUMENTS**: Que espera recibir (ej: numero de PR, ruta a archivo)

## Ejemplos

\```
/mi-command 123
/mi-command archivo.md
/mi-command "texto libre"
\```

---

## Ejecucion

Este command invoca el skill `nombre-skill`. Leer y seguir las instrucciones del skill:

\```
Skill: nombre-skill
\```
```

### Command completo (con logica propia)

```markdown
# Nombre del Command

Descripcion de que hace y en que contexto.

## Parametros

- **$ARGUMENTS**: Descripcion
- **Modo 1 — Archivo:** Ruta a un .md con especificacion
- **Modo 2 — URL:** Link de Figma
- **Modo 3 — Texto:** Descripcion libre

## Ejemplos

\```
/mi-command docs/feature.md
/mi-command https://figma.com/...
/mi-command Crear pantalla de login
\```

---

## Modo de Ejecucion: Subagentes

Este command usa el agente orquestador (`.claude/agents/orquestador.md`).

### Flujo
\```
Oleada 1: agente-backend
Oleada 2: [PARALELO] agente-frontend-a + agente-frontend-b
Oleada 3: agente-compilacion
\```

### Subagentes disponibles

| Subagente | Archivo | Responsabilidad |
|-----------|---------|-----------------|
| `agente-backend` | `.claude/agents/agente-backend.md` | Backend |
| `agente-frontend` | `.claude/agents/agente-frontend.md` | Frontend |

---

## Deteccion del Modo de Entrada

Analizar `$ARGUMENTS`:

1. **Si es URL de Figma** -> Modo Figma
2. **Si es ruta a .md** -> Modo documento
3. **Si es texto libre** -> Modo interactivo

---

## Ejecucion

1. Leer el skill: `.claude/skills/mi-skill/SKILL.md`
2. Leer AGENTS.md de las apps afectadas
3. Planificar (modo plan obligatorio)
4. Ejecutar oleadas con subagentes
```

---

## La variable $ARGUMENTS

`$ARGUMENTS` contiene todo lo que el usuario escribio despues del nombre del command:

```
/code-review 991           --> $ARGUMENTS = "991"
/at YH-342                 --> $ARGUMENTS = "YH-342"
/desarrollo docs/feat.md   --> $ARGUMENTS = "docs/feat.md"
```

Usala en las instrucciones del command o del skill para parametrizar la ejecucion.

---

## Relacion Command <-> Skill

```
Command (interfaz)          Skill (logica)
-----------------           ---------------
Parametros                  Flujo paso a paso
Ejemplos de uso             Reglas detalladas
Que skill invocar           Templates de output
Deteccion de modo           Integraciones (Jira, Gitea, etc.)
```

**El command es corto** (20-60 lineas). Define QUE hace y COMO invocarlo.
**El skill es largo** (200-800+ lineas). Define COMO hacerlo paso a paso.

### Patron recomendado

1. Command minimo que apunta a un skill:
```markdown
# Code Review de PR

Realiza un code review de un Pull Request.

## Parametros
- Numero de PR en Gitea (ej: `991`)

## Ejemplos
\```
/code-review 991
\```

## Ejecucion
Este command invoca el skill `code-review`. Leer y seguir las instrucciones del skill:
\```
Skill: code-review
\```
```

2. Si la logica es muy simple (no justifica un skill), ponerla directo en el command.
   Pero si crece, extraerla a un skill.

---

## Buenas practicas

### 1. Nombre del archivo = nombre del slash command
`commands/code-review.md` -> `/code-review`
Usar kebab-case, descriptivo, corto.

### 2. Siempre incluir ejemplos
Los ejemplos aclaran ambiguedades sobre que esperar como input.

### 3. Documentar los modos de entrada
Si el command acepta diferentes tipos de input (archivo, URL, texto),
documentar la deteccion y el flujo para cada uno.

### 4. Un command = un workflow
No mezclar "code review" con "merge PR" en un solo command.

### 5. Referenciar agentes si usa subagentes
Listar en tabla los subagentes con su archivo y responsabilidad.

---

## Ideas de commands utiles para cualquier proyecto

| Command | Que haria |
|---------|-----------|
| `/dev` | Orquestador de desarrollo fullstack |
| `/review` | Code review de un PR |
| `/test` | Generar tests para el codigo actual |
| `/deploy` | Workflow de deploy interactivo |
| `/migrate` | Crear y ejecutar migraciones de BD |
| `/refactor` | Refactoring guiado con validacion |
| `/docs` | Generar documentacion de API |
| `/release` | Crear release con changelog |
| `/debug` | Investigar un bug con contexto de ticket |
| `/setup` | Setup inicial de un nuevo modulo/feature |

---

## Errores comunes

| Error | Solucion |
|-------|----------|
| Command con 500 lineas de logica | Extraer a un skill |
| No poner ejemplos | El usuario no sabe que parametro pasar |
| No referenciar el skill | Claude no sabe donde esta la logica |
| Nombre ambiguo (`/run`, `/do`) | Nombre descriptivo (`/code-review`, `/deploy`) |
| No documentar $ARGUMENTS | Claude no sabe que hacer con el input |
