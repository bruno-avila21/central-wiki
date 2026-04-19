---
title: Discord Bot
description: Bot de Discord para automatización y utilidades del servidor
wiki_managed: true
---

# Discord Bot

Bot de Discord desarrollado en Node.js con discord.js. Automatiza tareas del servidor: respuestas automáticas, comandos de utilidad y gestión de canales.

## Stack

| Capa | Tecnología |
|------|------------|
| Runtime | Node.js 18+ |
| Librería | discord.js v14 |
| Lenguaje | JavaScript (ESM) |
| Deploy | VPS / Railway / Render |

## Qué hace

- Slash commands personalizados (`/comando`)
- Respuestas automáticas a palabras clave
- Gestión de roles y permisos
- Logs de actividad del servidor
- Sistema de bienvenida a nuevos miembros

## Variables de entorno

```env
DISCORD_TOKEN=tu_bot_token_aqui
DISCORD_CLIENT_ID=id_de_la_aplicacion
GUILD_ID=id_del_servidor_para_dev
```

### Cómo obtener el token

1. Ir a `https://discord.com/developers/applications`
2. Crear una aplicación → Bot → copiar el Token
3. En OAuth2 → URL Generator: scopes `bot` + `applications.commands`
4. Invitar el bot al servidor con la URL generada

## Correr localmente

```bash
git clone git@github.com:bruno-avila21/discord-bot.git
cd discord-bot
npm install
cp .env.example .env
# Completar .env con el token
npm run dev
```

## Registrar slash commands

```bash
# Solo hace falta correrlo cuando cambian los comandos
npm run deploy-commands
```

## Deploy en producción

```bash
# En el servidor
npm install --production
npm start

# Con PM2 para que corra como servicio
pm2 start src/index.js --name discord-bot
pm2 save
pm2 startup
```

## Estructura

```
discord-bot/
├── src/
│   ├── commands/          # un archivo por comando slash
│   ├── events/            # handlers de eventos Discord
│   ├── handlers/          # loader automático de commands/events
│   └── index.js           # entrypoint
├── scripts/
│   └── deploy-commands.js # registra los slash commands en Discord
├── .env.example
└── package.json
```
