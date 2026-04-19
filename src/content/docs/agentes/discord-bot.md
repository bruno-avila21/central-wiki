---
title: Discord Bot
description: Bot de Discord para automatización de tareas — queries SQL, recordatorios, reportes y envío de mails
wiki_managed: true
---

# Discord Bot

Bot de Discord para automatización de tareas del servidor. Permite ejecutar queries SQL guardadas,
enviar recibos PDF por mail, gestionar recordatorios programados y generar reportes.
Deploy en Railway. JavaScript plano, sin TypeScript.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | 18+ | Runtime |
| discord.js | 14.x | Bot framework |
| @anthropic-ai/sdk | 0.85+ | Anthropic Claude AI |
| pg | 8.x | PostgreSQL |
| nodemailer | 8.x | Envío de mails |
| node-cron | 3.x | Tareas programadas |
| docxtemplater + pizzip | — | Documentos Word |
| Railway | — | Deploy |

## Comandos

| Comando | Función |
|---------|---------|
| `/querys` | Ejecuta queries SQL guardadas en BD |
| `/agregarquery` | Agrega nueva query a la BD |
| `/agregar-tarea` | Agrega tarea a la BD |
| `/recibo` | Descarga PDF y lo envía por mail |
| `/reporte` | Genera reporte de tareas/Jira |
| `/git` | Muestra guía de flujo Git |

## Tareas programadas

| Archivo | Descripción |
|---------|-------------|
| `buenos-dias.js` | Mensaje de buen día en canal |
| `reminder.js` | Recordatorios desde BD |

## Estructura

```
src/
  commands/          # Un archivo por slash command
  scheduled/         # Tareas cron
  db.js              # Pool PostgreSQL — único punto de acceso
  index.js           # Entry point
  deploy-commands.js # Registra slash commands en Discord
```

## Variables de entorno

```env
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
DATABASE_URL=
ANTHROPIC_API_KEY=
MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
MAIL_RECIBO_TO=
```

## Correr localmente

```bash
npm install
npm run dev              # node --watch
npm run deploy-commands  # registrar slash commands en Discord
```
