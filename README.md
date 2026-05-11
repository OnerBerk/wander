# Wander

> Carte interactive de Paris avec données temps réel et suggestions de parcours assistées par IA.

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![NestJS](https://img.shields.io/badge/API-NestJS-ea2845?logo=nestjs)
![React](https://img.shields.io/badge/Web-React-61dafb?logo=react&logoColor=222)
![Vite](https://img.shields.io/badge/Build-Vite-646cff?logo=vite)
![PNPM](https://img.shields.io/badge/Monorepo-pnpm-f69220?logo=pnpm&logoColor=fff)
![Redis](https://img.shields.io/badge/Cache-Redis-dc382d?logo=redis&logoColor=fff)
![Docker](https://img.shields.io/badge/Dev-Docker-2496ed?logo=docker&logoColor=fff)

---

## Vision

Wander regroupe plusieurs sources publiques pour afficher sur une même carte de Paris des infos utiles en direct (mobilité, événements, météo, etc.). Tu te déplaces, tu filtres : les données suivent la zone et les réglages choisis. Le projet est typé strictement, et déployé.

---

## Ce que tu y trouves (côté produit)

- Une **carte** (MapLibre) pour naviguer dans Paris.
- Des **marqueurs** et panneaux selon les couches activées : événements, Vélib, Space Invaders, métro/RER, météo, etc.
- Des **filtres** (période, catégories d’événements, activation ou non des événements sur la carte).
- Des **modales** de détail au clic sur un marqueur.

---

## Architecture du dépôt

```txt
wander/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend React + Vite
├── packages/
│   └── types/        # Types TypeScript partagés (@wander/types)
├── learn.md          # Guide technique détaillé (tout le projet)
├── CLAUDE.md         # Règles et conventions pour les contributeurs / agents
└── README.md         # Ce fichier
```

---

## Stack

| Couche         | Technologie                                     |
| -------------- | ----------------------------------------------- |
| Frontend       | React, TypeScript, Vite, **MapLibre GL**        |
| Backend        | NestJS, TypeScript                              |
| Cache          | Redis (local Docker ; Upstash possible en prod) |
| Types partagés | `@wander/types` (workspace pnpm)                |
| Conteneurs     | Docker + Compose (dev)                          |
| CI/CD          | GitHub Actions                                  |
| Déploiement    | Vercel (web), Render (api)                      |
| IA             | Claude API (parcours / suggestions côté API)    |

---

## APIs externes (intégrées ou prévues)

| Source            | Données                | TTL cache Redis (cible) |
| ----------------- | ---------------------- | ----------------------- |
| Vélib API         | Disponibilité stations | 60 s                    |
| Que Faire à Paris | Événements temps réel  | 300 s                   |
| Open-Meteo        | Météo (sans clé API)   | 900 s                   |

---

## Variables d’environnement

Copier les exemples puis ajuster si besoin :

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

---

## Lancer l’application en local

Prérequis : **Node.js**, **pnpm**, **Docker** (pour Redis).

1. Installer les dépendances à la racine du monorepo :

   ```bash
   pnpm install
   ```

2. Démarrer **Redis** (depuis la racine, fichier `docker-compose.yml`) :

   ```bash
   docker compose up -d
   ```

   Pour arrêter : `docker compose down`.  
   Service : image `redis:7-alpine`, conteneur local `wander-redis`, port `6379`, volume persistant `redis_data`.  
   L’API doit avoir `REDIS_URL=redis://localhost:6379`.

3. Créer les fichiers `.env` (voir la section **Variables d’environnement** plus haut dans ce fichier).

4. **Terminal 1 — API** :

   ```bash
   cd apps/api && pnpm start:dev
   ```

5. **Terminal 2 — Web** :

   ```bash
   cd apps/web && pnpm dev
   ```

6. Ouvrir l’URL affichée par Vite (souvent `http://localhost:5173`).

### Autres commandes utiles

```bash
# Racine
pnpm lint
pnpm format

# API (depuis apps/api)
pnpm test
pnpm run build

# Web (depuis apps/web)
pnpm test
pnpm build
```

---

## Git et qualité

- Branche `main` protégée ; travail sur `dev` ou branches `feat/…` avec PR.
- Husky / lint en pre-push selon la config du dépôt (voir `.husky/` et `CLAUDE.md`).

---

## Licence

Les licences des dépendances suivent chaque package ; le dépôt Wander précise sa licence dans les fichiers habituels du projet (`LICENSE` si présent).
