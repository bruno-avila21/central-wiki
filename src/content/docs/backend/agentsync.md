---
title: AgentSync
description: Documentación de AgentSync
---

# AgentSync

Aplicación de bandeja del sistema (Windows) que sincroniza un repositorio central de prompts/MCPs con las máquinas de desarrollo, y además gestiona la instalación, versionado y configuración de servidores **MCP (Model Context Protocol)** por proyecto.

## Características

- **Sincronización automática** del repo de prompts (polling + disparos manuales).
- **Descubrimiento de proyectos** `.NET` en rutas configuradas.
- **Catálogo de MCPs declarativo**: cada MCP se define en un `install-manifest.yaml` dentro del repo de prompts.
- **Instalación reproducible**: pasos declarativos (`clone`, `shell`, `copy`, `add_to_path`, etc.) por plataforma.
- **Detección de versión** por MCP con múltiples fuentes (archivo, comando, npm, PyPI, GitHub/Gitea releases, git tags…).
- **Verificación de actualizaciones** manual: compara la versión instalada contra la última disponible y permite actualizar in-place.
- **Configuración de variables de entorno** por MCP, integrada en cada tarjeta del catálogo (colapsable).
- **Modo desarrollo** para iterar sobre prompts/MCPs sin pushear al repo.

## Tech stack

- .NET 9.0 (WinExe) · WPF + WinForms · YamlDotNet · Git CLI.

## Requisitos

- Windows 10/11 con .NET 9.0 Runtime.
- Instancia Gitea (o equivalente) con acceso al repo de prompts.
- Token de acceso personal (PAT) para Gitea.
- Herramientas requeridas por los MCPs que vayas a instalar (git, python, go, node, etc.). El instalador chequea y avisa qué falta antes de correr.

## Configuración inicial

Al primer arranque se abre el asistente. Datos a ingresar:

| Campo | Descripción |
|---|---|
| URL remota | URL del repo Gitea de prompts |
| Token | PAT de Gitea |
| Ruta local | Carpeta donde clonar el repo de prompts |
| Rutas de escaneo | Directorios donde buscar proyectos locales |

Se guarda en `config.yaml` (junto al ejecutable) y podés re-abrir el asistente desde el menú de la bandeja.

## Uso desde la bandeja

Click derecho en el ícono:

- **Sincronizar** — pull del repo + distribución de `.mcp.json` a los proyectos habilitados.
- **Sync Local** — solo re-distribuye; no toca el remoto.
- **Configurar** — abre el asistente (pestañas *General* y *MCPs*).
- **Salir**.

## Pestaña *MCPs*

### Catálogo

Lista cada MCP declarado en `<repo-prompts>/mcps/catalog.yaml`. Por tarjeta:

- **Estado**: `✓ Instalado` / `○ No instalado` / `↑ Actualizable`.
- **Versión**: `Versión: X.Y.Z` (resuelta en vivo — ver abajo).
- **⚙ N/M** — botón con contador de variables faltantes. Click → expande las tarjetas de env vars de ese MCP inline.
- **Instalar / Reinstalar / Actualizar** — ejecuta los `steps` del manifest, con ventana de progreso.

Botones de cabecera:

- **⟳ Verificar actualizaciones** — consulta la fuente remota de cada MCP, compara con la instalada, y marca las tarjetas actualizables.
- **↻ Recargar** — relee el catálogo desde disco (útil si editaste manifests a mano).

## Cómo escribir un manifest

Estructura de carpetas esperada en el repo de prompts:

```
<repo-prompts>/
└── mcps/
    ├── catalog.yaml              # lista los MCPs del catálogo
    ├── atlassian/
    │   ├── install-manifest.yaml
    │   └── .mcp.json.template
    ├── gitea/
    │   ├── install-manifest.yaml
    │   └── .mcp.json.template
    └── figma/
        └── …
```

### `install-manifest.yaml` — campos principales

```yaml
name: gitea
display_name: "Gitea (interno)"
description: "Acceso a repos, PRs, issues, releases del Gitea interno."
manifest_version: "1.0"
mcp_version: "1.2.0"   # fallback si version_source no resuelve

# Cómo leer la versión INSTALADA (en la máquina del usuario).
version_source:
  type: file_text
  path: "%LOCALAPPDATA%\\Gitea-MCP\\VERSION"
  trim: true

# Cómo saber la ÚLTIMA versión publicada (fuente remota).
latest_version_source:
  type: url_text
  url: "https://git.tu-org/.../gitea-mcp/raw/branch/main/VERSION"
  trim: true

binary_check:
  type: command_in_path
  command: gitea-mcp

requirements:
  - type: command
    name: go
    display_name: Go (Golang)
    min_version: "1.24"
    version_command: ["version"]
    version_regex: "go(\\d+\\.\\d+)"
    download_url: "https://go.dev/dl/"

steps:
  - type: clone
    url: "https://git.tu-org/.../gitea-mcp.git"
    to: "%TEMP%\\gitea-mcp-build"
    depth: 1
  - type: shell
    cwd: "%TEMP%\\gitea-mcp-build"
    command: go
    args: ["build", "-o", "gitea-mcp.exe"]
  - type: copy
    from: "%TEMP%\\gitea-mcp-build\\gitea-mcp.exe"
    to: "%LOCALAPPDATA%\\Gitea-MCP\\gitea-mcp.exe"
    overwrite: true
  - type: copy
    from: "%TEMP%\\gitea-mcp-build\\VERSION"
    to: "%LOCALAPPDATA%\\Gitea-MCP\\VERSION"
    overwrite: true
  - type: add_to_path
    path: "%LOCALAPPDATA%\\Gitea-MCP"
  - type: cleanup
    path: "%TEMP%\\gitea-mcp-build"

verify_steps:
  - type: detect_command_path
    command: gitea-mcp
    save_to_env: GITEA_MCP_PATH
```

### Fuentes de versión soportadas

`version_source` (instalada) — la leés de algo que quedó en la máquina:

| `type` | Campos | Uso típico |
|---|---|---|
| `file_text` | `path`, `trim` | Archivo `VERSION` plano |
| `file_json` | `path`, `json_path` | `package.json`, etc. |
| `command` | `command`, `args`, `regex` | Binario con `--version` |
| `npm_local` | `package` | Paquete npm global |

`latest_version_source` (última disponible) — el manifest **no guarda la versión**, solo dónde buscarla. La URL/package es estable; en cada release solo se bumpea el artefacto remoto:

| `type` | Campos | Dónde consulta |
|---|---|---|
| `url_text` | `url`, `trim` | HTTP GET a un archivo `VERSION` |
| `url_json` | `url`, `json_path` | HTTP GET a un JSON |
| `npm_registry` | `package` | `registry.npmjs.org` |
| `pypi` | `package` | `pypi.org` |
| `crates_io` | `package` | `crates.io` |
| `nuget` | `package` | `api.nuget.org` |
| `go_proxy` | `package` | `proxy.golang.org` |
| `github_release` | `url` | API `/releases/latest` |
| `gitea_release` | `url` | API `/releases/latest` (Gitea) |
| `git_ls_remote_tag` | `url` | `git ls-remote --tags` |

Si `version_source` no resuelve, se usa `mcp_version` como fallback. Si el MCP no declara `latest_version_source`, el botón "Verificar actualizaciones" lo ignora (caso típico: MCPs remotos tipo Figma).

### Variables de entorno por MCP

En `catalog.yaml`, por MCP:

```yaml
env_vars:
  - name: JIRA_URL
    description: "URL de la instancia de Jira"
    url: "https://docs.tu-org/confluence"
  - name: JIRA_PERSONAL_TOKEN
    description: "Personal Access Token de Jira"
    secret: true
    url: "https://jira.tu-org/secure/ViewProfile.jspa?selectedTab=com.atlassian.pats.pats-plugin:jira-user-personal-access-tokens"
```

Se guardan a nivel **Usuario** en Windows (`setx`). La UI muestra `secret: true` con input tipo password y botón ojo.

### Template `.mcp.json.template`

Se mergea con los demás y se escribe como `.mcp.json` en cada proyecto habilitado. Puede referenciar env vars; el merger resuelve `${VAR}`.

## Modo desarrollo de manifests

Para probar cambios en manifests sin pushear al repo de prompts, seteá:

```powershell
setx AGENTSYNC_PROMPTS_OVERRIDE "C:\ruta\a\tu\repo\prompts\local"
```

La ruta debe apuntar a la **raíz** del repo (que contiene la carpeta `mcps/`), no a `mcps/` directamente. Reiniciá AgentSync para que la tome.

## Estructura del proyecto

```
AgentSync/
├── Config/                      # config.yaml + conversión TOML
├── Services/                    # SyncService, GitService, UpdateService
├── Mcp/
│   ├── McpOrchestrator.cs       # entrada unificada para MCPs
│   ├── Detection/
│   │   ├── BinaryDetector.cs    # ¿está instalado?
│   │   ├── RequirementChecker.cs # git/python/go/… con min_version
│   │   └── VersionResolver.cs   # version_source / latest_version_source
│   ├── Models/                  # InstallManifest, McpCatalog, VersionSource…
│   ├── Runtime/                 # IconLoader, McpJsonMerger
│   └── Steps/                   # Clone, Shell, Copy, AddToPath, Cleanup…
├── UI/                          # TrayApplication, SetupWindow, InstallProgressWindow
├── Logging/Logger.cs
├── Program.cs
└── icon.ico
```

## Build

```bash
dotnet build
dotnet run
```
