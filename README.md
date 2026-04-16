# 🗺️ Wander

> Carte interactive de Paris avec donnees temps reel et suggestions de parcours assistees par IA.

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![NestJS](https://img.shields.io/badge/API-NestJS-ea2845?logo=nestjs)
![React](https://img.shields.io/badge/Web-React-61dafb?logo=react&logoColor=222)
![Vite](https://img.shields.io/badge/Build-Vite-646cff?logo=vite)
![PNPM](https://img.shields.io/badge/Monorepo-pnpm-f69220?logo=pnpm&logoColor=fff)
![Redis](https://img.shields.io/badge/Cache-Redis-dc382d?logo=redis&logoColor=fff)
![Docker](https://img.shields.io/badge/Dev-Docker-2496ed?logo=docker&logoColor=fff)

---

## ✨ Vision

Wander agrege plusieurs APIs publiques pour afficher des infos utiles en direct (mobilite, evenements, meteo, etc.) sur une carte de Paris, puis genere des idees de parcours personnalisees.

Le projet est pense comme un portfolio **propre, type strict, et production-ready**.

---

## 🏗️ Architecture

```txt
wander/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend React + Vite
└── packages/
    └── types/        # Types TypeScript partages (@wander/types)
```

---

## 🧰 Stack

| Couche         | Technologie                      |
| -------------- | -------------------------------- |
| Frontend       | React, TypeScript, Vite, Leaflet |
| Backend        | NestJS, TypeScript               |
| Cache          | Redis                            |
| Types partages | `@wander/types` (workspace pnpm) |
| Conteneurs     | Docker + Docker Compose          |
| CI/CD          | GitHub Actions                   |
| Deploiement    | Vercel (web), Render (api)       |
| IA             | Claude API                       |

---

## 🌍 APIs externes (prevues / integrees)

- 🚲 Velib API
- 🎭 Que Faire a Paris
- 🗓️ OpenAgenda IDF
- 🏛️ Paris Musees
- 🏋️ Equipements sportifs IDF
- 🚴 Pistes cyclables Paris
- 🍽️ DATAtourisme
- 🌤️ Open-Meteo

---

## ⚙️ Variables d'environnement

### `apps/api/.env`

```env
REDIS_URL=redis://localhost:6379
CLAUDE_API_KEY=
PORT=3000
```

### `apps/web/.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## 🚀 Commandes utiles

```bash
# A la racine
pnpm install
pnpm lint
pnpm format

# API
cd apps/api
pnpm start:dev
pnpm test

# Web
cd apps/web
pnpm dev
pnpm test
```

---

## 🐳 Docker (dev)

```bash
docker-compose up -d
docker-compose down
```

### Redis dockerise (local dev)

- Service lance via `docker-compose.yml` avec l'image `redis:7-alpine`
- Container local: `wander-redis`
- Port expose: `6379:6379`
- Donnees persistantes via le volume Docker `redis_data`
- Variable API: `REDIS_URL=redis://localhost:6379`

---
