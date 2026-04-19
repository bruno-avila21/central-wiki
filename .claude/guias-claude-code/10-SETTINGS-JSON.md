# Guia: settings.json y Hooks

## Que es

`settings.json` configura el comportamiento de Claude Code: permisos automaticos,
hooks (acciones pre/post), y preferencias del proyecto.

Hay **3 niveles** de configuracion, del mas general al mas especifico:

| Nivel | Ubicacion | Alcance | Se commitea? |
|-------|-----------|---------|-------------|
| **Usuario** | `~/.claude/settings.json` | Todas tus sesiones | No (es personal) |
| **Proyecto** | `.claude/settings.json` | Todo el equipo | Si (compartido en git) |
| **Local** | `.claude/settings.local.json` | Solo vos en este proyecto | No (en .gitignore) |

Los niveles se mergean: local > proyecto > usuario. Lo mas especifico gana.

---

## Estructura completa

```jsonc
{
  // Permisos: que herramientas se auto-aprueban sin preguntar
  "permissions": {
    "allow": [
      // Herramientas de lectura (siempre seguro auto-aprobar)
      "Read",
      "Glob",
      "Grep",

      // Bash commands seguros (patron con wildcard)
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git branch*)",
      "Bash(npm run lint*)",
      "Bash(npm run build*)",
      "Bash(npm run test*)",
      "Bash(dotnet build*)",
      "Bash(dotnet test*)",
      "Bash(ls*)",
      "Bash(wc*)",
      "Bash(cat*)",

      // MCP tools (si usas Jira, Gitea, etc.)
      "mcp__gitea__*",
      "mcp__jira__*"
    ],
    "deny": [
      // Cosas peligrosas que NUNCA auto-aprobar
      "Bash(rm -rf*)",
      "Bash(git push --force*)",
      "Bash(git reset --hard*)",
      "Bash(DROP TABLE*)"
    ]
  },

  // Hooks: acciones que se ejecutan automaticamente
  "hooks": {
    // Antes de que Claude use una herramienta
    "PreToolCall": [
      {
        "matcher": "Edit",
        "command": "echo '[hook] Editando archivo...'"
      }
    ],
    // Despues de que Claude usa una herramienta
    "PostToolCall": [
      {
        "matcher": "Bash(npm run build*)",
        "command": "echo '[hook] Build completado'"
      }
    ],
    // Cuando el usuario envia un mensaje
    "UserPromptSubmit": [
      {
        "command": "echo 'Recordar: leer AGENTS.md antes de escribir codigo'"
      }
    ],
    // Despues de que Claude responde
    "PostResponse": [
      {
        "command": "echo 'Sesion activa'"
      }
    ]
  },

  // Modelo por defecto
  "model": "claude-sonnet-4-6",

  // Preferencias de la interfaz
  "preferences": {
    "todoMode": true,
    "fastMode": false
  }
}
```

---

## Permisos: que auto-aprobar

### Regla de oro
Auto-aprobar todo lo que sea **lectura** o **builds seguros**.
Nunca auto-aprobar lo que sea **destructivo** o **write a sistemas externos**.

### Template minimo recomendado

**`.claude/settings.json`** (compartido con el equipo):
```json
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
```

**`.claude/settings.local.json`** (personal, mas permisivo):
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint*)",
      "Bash(npm run build*)",
      "Bash(npm run test*)",
      "Bash(dotnet build*)",
      "Bash(dotnet test*)",
      "mcp__gitea__*",
      "mcp__jira__*"
    ]
  }
}
```

### Sintaxis de patrones

| Patron | Matchea | Ejemplo |
|--------|---------|---------|
| `"Read"` | Cualquier Read | Todos los archivos |
| `"Bash(git*)"` | Bash que empieza con git | `git status`, `git log`, etc. |
| `"Bash(npm run lint*)"` | Bash que empieza con `npm run lint` | `npm run lint`, `npm run lint:fix` |
| `"mcp__gitea__*"` | Cualquier tool de Gitea MCP | Todas las operaciones Gitea |
| `"Edit"` | Cualquier edicion | (cuidado: permite editar todo) |

---

## Hooks: automatizaciones

### Que son
Los hooks son comandos shell que se ejecutan automaticamente cuando ocurren
ciertos eventos en Claude Code. Son como los git hooks pero para Claude.

### Eventos disponibles

| Evento | Cuando se dispara | Uso tipico |
|--------|-------------------|------------|
| `PreToolCall` | Antes de ejecutar una herramienta | Validar, logging |
| `PostToolCall` | Despues de ejecutar una herramienta | Notificar, verificar |
| `UserPromptSubmit` | Cuando el usuario envia un mensaje | Recordatorios, contexto |
| `PostResponse` | Despues de que Claude responde | Logging, metricas |

### Hooks utiles para desarrollo

```json
{
  "hooks": {
    "PreToolCall": [
      {
        "matcher": "Bash(git commit*)",
        "command": "cd LoanEcommerceFront && npm run lint 2>&1 | tail -5"
      }
    ],
    "PostToolCall": [
      {
        "matcher": "Write",
        "command": "echo 'Archivo creado. Verificar que compila.'"
      }
    ]
  }
}
```

### Hook que recuerda leer AGENTS.md

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "command": "echo 'Reminder: Si vas a escribir codigo, lee primero el AGENTS.md de la app afectada.'"
      }
    ]
  }
}
```

---

## Tu setup actual vs recomendado

### Lo que tenes (settings.local.json)
```json
{
  "permissions": {
    "allow": [
      "Bash(wc:*)",
      "Read(//proc/**)",
      "Bash(timeout 10 bash -c ...)",
      "Bash(grep -l ...)",
      "Bash(grep -l ...)",
      "Bash(grep -l ...)"
    ]
  }
}
```

Esto es muy especifico — solo permite unos pocos comandos exactos.

### Lo recomendado
Agregar permisos mas amplios para operaciones de lectura y build:

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(wc*)",
      "Bash(git status*)",
      "Bash(git log*)",
      "Bash(git diff*)",
      "Bash(git branch*)",
      "Bash(ls*)",
      "Bash(npm run lint*)",
      "Bash(npm run build*)",
      "Bash(npm run test*)",
      "Bash(dotnet build*)",
      "Bash(dotnet test*)"
    ]
  }
}
```

---

## Errores comunes

| Error | Consecuencia |
|-------|-------------|
| Auto-aprobar `Edit` | Claude edita cualquier archivo sin confirmar |
| Auto-aprobar `Bash(rm*)` | Puede borrar archivos sin preguntar |
| No separar settings.json de settings.local.json | Settings personales se comparten al equipo |
| Hooks muy pesados | Cada accion tarda mas (el hook bloquea) |
| No tener ningun permiso | Confirmar cada Read/Grep manualmente (lento) |
