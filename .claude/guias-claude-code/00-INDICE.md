# Guias para Configurar Claude Code en Cualquier Proyecto

Estas guias documentan la estructura completa de configuracion de Claude Code
para que puedas replicarla en cualquier proyecto nuevo.

## Archivos de esta guia

| # | Archivo | Que cubre |
|---|---------|-----------|
| 1 | [01-CLAUDE-MD.md](01-CLAUDE-MD.md) | Como crear el `CLAUDE.md` raiz del proyecto |
| 2 | [02-AGENTS-MD.md](02-AGENTS-MD.md) | Como crear los `AGENTS.md` por aplicacion/modulo |
| 3 | [03-AGENTES.md](03-AGENTES.md) | Como crear agentes en `.claude/agents/` |
| 4 | [04-COMMANDS.md](04-COMMANDS.md) | Como crear commands en `.claude/commands/` |
| 5 | [05-SKILLS.md](05-SKILLS.md) | Como crear skills en `.claude/skills/` |
| 6 | [06-ARQUITECTURA-COMPLETA.md](06-ARQUITECTURA-COMPLETA.md) | Vision general: como se conecta todo |
| 7 | [07-MEJORAS-SUGERIDAS.md](07-MEJORAS-SUGERIDAS.md) | Mejoras detectadas sobre tu setup actual |
| 8 | [08-CLAUDEIGNORE.md](08-CLAUDEIGNORE.md) | `.claudeignore`: que excluir, templates por stack |
| 9 | [09-OPTIMIZACION-TOKENS.md](09-OPTIMIZACION-TOKENS.md) | Optimizacion de tokens: DRY, skills index, lectura selectiva |
| 10 | [10-SETTINGS-JSON.md](10-SETTINGS-JSON.md) | `settings.json`, permisos, hooks, 3 niveles de config |
| 11 | [11-MEMORY-SYSTEM.md](11-MEMORY-SYSTEM.md) | Sistema de memoria persistente entre sesiones |
| 12 | [12-SCAFFOLD-SCRIPT.md](12-SCAFFOLD-SCRIPT.md) | Script bash para generar toda la estructura en un proyecto nuevo |
| 13 | [13-PASO-A-PASO-PROYECTO-NUEVO.md](13-PASO-A-PASO-PROYECTO-NUEVO.md) | Playbook completo: como usar todo esto en un proyecto desde cero |

## Estructura final de `.claude/` en un proyecto

```
.claude/
  agents/           # Agentes especializados (subagentes del orquestador)
    agente-backend.md
    agente-frontend.md
    agente-compilacion.md
    orquestador.md
  commands/         # Slash commands del usuario (/nombre)
    desarrollo.md
    code-review.md
    testing.md
  skills/           # Logica reutilizable invocada por commands
    code-review/
      SKILL.md
    desarrollo/
      SKILL.md
    testing/
      SKILL.md
      plantillas/
        PLANTILLA_CRUD.md
```

## Flujo de invocacion

```
Usuario escribe: /desarrollo docs/feature.md
       |
       v
  commands/desarrollo.md          <-- Define parametros, ejemplos, que skill invocar
       |
       v
  skills/desarrollo/SKILL.md     <-- Logica detallada paso a paso
       |
       v
  agents/orquestador.md          <-- Coordina subagentes
       |
       v
  agents/agente-backend.md       <-- Ejecuta la parte backend
  agents/agente-frontend.md      <-- Ejecuta la parte frontend (en paralelo)
  agents/agente-compilacion.md   <-- Valida compilacion
```

## Regla de oro

> **CLAUDE.md** = contexto global del proyecto (arquitectura, convenciones, reglas)
> **AGENTS.md** = reglas especificas por app/modulo (patrones de codigo, forbidden patterns)
> **agents/** = ejecutores especializados con instrucciones de implementacion
> **commands/** = interfaz del usuario (slash commands)
> **skills/** = cerebro logico (workflows detallados paso a paso)
