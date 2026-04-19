# 14 — Guía de Skills e instalación para proyectos Front-End

> **Regla:** Instalá lo que usás. No acumules MCPs ni skills que no van a ser invocados — cada herramienta cargada en contexto cuesta tokens.

---

## 1. MCPs obligatorios (instalación global)

### n8n-expert
**Para qué:** Crear, testear y deployar workflows de automatización desde Claude.
```bash
npm install @n8n/mcp-server-n8n
```
**Verificación:** `Ejecutá n8n_health_check ahora.`
**Regla de uso:** Solo se carga cuando la tarea es de automatización. No lo invocás para front.

---

### Context7 (Documentación en tiempo real)
**Para qué:** Traer docs actualizadas de librerías (React, Next.js, Tailwind, etc.) sin que Claude alucine APIs viejas.
```bash
npx @upstash/context7-mcp
```
**Cuándo usarlo:** Siempre que trabajes con una librería que tiene versiones activas. Especialmente React 19+, Next 15+.

---

### Magic / UI (Diseño generativo)
**Para qué:** Generar componentes UI, aplicar sistema de diseño, buscar patrones (Bento Grid, Dashboard, etc.).
```bash
npm install -g uipro-cli
uipro init --ai Claude
```
**Verificación:** `Usá la skill UI/UX Pro Max para buscar el estilo 'Bento Grid'.`

---

### Figma MCP *(opcional, solo si tenés diseños en Figma)*
**Para qué:** Leer tokens de diseño, colores, tipografías y espaciados directamente desde el archivo de Figma.
**Cuándo usarlo:** Cuando el diseño ya está definido en Figma y querés que Claude lo traslade a código sin inventar valores.

---

## 2. Skills de Cowork (por carpeta de proyecto)

Estas skills van en `.claude/skills/` de cada proyecto. No son globales.

### `pptx` / `docx` / `xlsx` / `pdf`
**Para qué:** Generación de documentos de entrega, reportes, especificaciones técnicas.
**Front-end relevante:** Exportar especificaciones de componentes o handoffs.

### `skill-creator`
**Para qué:** Crear nuevas skills customizadas para tu proyecto.
**Usalo cuando** tengas un flujo repetitivo que le querés enseñar a Claude de una vez.

---

## 3. Skills de Obsidian (si usás vault de notas)

Instalación:
```bash
npx skills add https://github.com/kepano/obsidian-skills.git
```

| Skill | Para qué |
|-------|----------|
| `obsidian-markdown` | Documentar componentes, decisiones de arquitectura |
| `json-canvas` | Mapear flujos de datos / arquitectura visual |
| `obsidian-bases` | Trackear tareas, features, bugs en formato base |
| `defuddle` | Limpiar docs de librerías para leerlas sin ruido |

**Tip:** Combinalo con Context7. Defuddle raspa la doc, Context7 la enriquece con la versión exacta.

### `get-shit-done` (GSD)
**Para qué:** Plugin de productividad que le da a Claude un sistema de tareas, contexto de proyecto y seguimiento de progreso dentro de la sesión.
```bash
npx get-shit-done-cc@latest
```
**Cuándo usarlo:** Al inicio de cualquier sesión de desarrollo. Le da estructura a Claude para ejecutar tareas largas sin perder el hilo.

---

### `superpowers`
**Para qué:** Plugin oficial con capacidades extendidas para Claude Code — comandos adicionales, herramientas de contexto y shortcuts de flujo de trabajo.
```bash
claude plugin install superpowers@claude-plugins-official
```
**Cuándo usarlo:** Instalación global, una sola vez. Siempre activo.

---

### `emilkowalski/skill` — Animaciones
**Para qué:** Animaciones de UI de alta calidad (motion, transiciones, micro-interacciones). Basada en el trabajo de Emil Kowalski, referente de animaciones en React.
```bash
npx skills add emilkowalski/skill
```
**Cuándo usarlo:** Siempre que necesites animaciones en el front. Antes de escribir cualquier CSS de transición o usar Framer Motion a mano, invocá esta skill primero.
**Verificación:** `Usá la skill de animaciones de Emilkowalski para hacer una transición de entrada para este componente.`

---

## 4. Setup rápido para un proyecto Front nuevo

```bash
# 1. Ir a la carpeta del proyecto
cd ~/proyectos/mi-front

# 2. Correr el script de setup (copia toda la estructura .claudecode/)
bash ~/Desktop/Desarrollo/Skills/setup-project.sh .

# 3. Verificar que los MCPs responden
# En Claude: "Ejecutá n8n_health_check ahora."
# En Claude: "Usá Context7 para traer la doc de React 19 hooks."
```

El script `setup-project.sh` genera automáticamente:
- `.claudecodeconfig` con ignores agresivos
- `CLAUDE.md` con naming conventions y protocolo
- `.claudecode/instructions/` con manuales de n8n y diseño
- `.claudecode/MCP_INDEX.md` como índice de herramientas

---

## 5. Lo que NO instalás para un proyecto Front

| Herramienta | Por qué no |
|-------------|-----------|
| MCPs de base de datos | Es responsabilidad del back |
| Skills de PDF/DOCX en el proyecto | Las usás desde Cowork global, no desde el repo |
| Obsidian CLI | Solo si hacés mantenimiento del vault, no es del flujo de dev |

---

## 6. Diagnóstico rápido si algo no funciona

**Claude dice "no tengo esa skill":**
```
"Leé tu configuración local en .claude/skills/ e incorporá las herramientas que encuentres ahí."
```

**MCP de n8n no conecta:**
- URL sin `/` al final: `https://n8nwhatjob.online`
- Verificar que `N8N_API_KEY` en `.env` sea el actual

**UI/UX Pro Max da error de Python:**
```bash
winget install Python.Python.3.12
# Reiniciar terminal
```

---

## 7. Protocolo de carga bajo demanda (CLAUDE.md)

Nunca dejés que Claude cargue todos los manuales por defecto. El router en `CLAUDE.md` debe decir:

```
Si la tarea es sobre N8N → Lee .claudecode/instructions/n8n-expert.md
Si la tarea es sobre UI/UX → Lee .claudecode/instructions/obsidian-design.md
NO leas archivos de instrucciones que no competen a la tarea actual.
```

Esto evita quemar contexto en instrucciones irrelevantes.

---

## 8. Referencia rápida — Stack .NET 8 / React

Para este stack específico, el orden de prioridad de herramientas es:

1. **Context7** → Documentación de React / librerías actualizadas
2. **UI/UX Pro Max** → Generación y revisión de componentes
3. **n8n-expert** → Solo cuando hay automatizaciones de backend involucradas
4. **Obsidian** → Documentación y arquitectura (fuera del repo)
5. **Figma MCP** → Si el diseño viene de Figma

---

*Generado en base a los archivos de configuración de la carpeta Skills. Revisarlo cada vez que se agregue un MCP nuevo al entorno global.*
