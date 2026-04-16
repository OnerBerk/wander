# Wander — CLAUDE.md

# Contexte du projet

Wander est une carte interactive de Paris qui agrège des données temps réel depuis plusieurs APIs publiques gratuites, avec des suggestions de parcours générées par IA.

Projet portfolio : le code doit être propre, typé strictement, et production-ready.

---

# Architecture

```
wander/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend React + Vite
└── packages/
    └── types/        # Types TypeScript partagés (@wander/types)
```

---

# Stack technique

| Couche          | Technologie                          |
| --------------- | ------------------------------------ |
| Frontend        | React 18, TypeScript, Vite, Leaflet  |
| Backend         | NestJS, TypeScript                   |
| Cache           | Redis (via Upstash en prod)          |
| Types partagés  | @wander/types (workspace pnpm)       |
| Package manager | pnpm workspaces                      |
| Conteneurs      | Docker + Docker Compose (dev)        |
| CI/CD           | GitHub Actions                       |
| Déploiement     | Vercel (web), Render (api)           |
| IA              | Claude API (suggestions de parcours) |

---

# APIs externes intégrées

| Source                   | Données                    | TTL Redis |
| ------------------------ | -------------------------- | --------- |
| Vélib API                | Disponibilité stations     | 60s       |
| Que Faire à Paris        | Événements temps réel      | 300s      |
| OpenAgenda IDF           | Événements publics         | 300s      |
| Paris Musées API         | Musées, expos, œuvres      | 3600s     |
| Équipements sportifs IDF | Salles, terrains, piscines | 3600s     |
| Pistes cyclables Paris   | Tracés cyclables           | 86400s    |
| DATAtourisme             | Restaurants, hébergements  | 3600s     |
| Open-Meteo               | Météo (sans clé API)       | 900s      |

---

# Conventions de code

### Général

- TypeScript strict partout (`strict: true` dans tous les tsconfig)
- Pas de `any` — utiliser `unknown` si le type est indéterminé
- Imports absolus uniquement (pas de `../../`)
- Nommage : camelCase pour les variables/fonctions, PascalCase pour les types/classes

### Backend (NestJS)

- Un module par domaine fonctionnel (`VelibModule`, `EventsModule`, etc.)
- Les controllers ne contiennent pas de logique métier — déléguer aux services
- Chaque appel API externe passe par le cache Redis avant de sortir
- DTOs validés avec `class-validator` sur toutes les entrées
- Tests unitaires obligatoires par module (`*.spec.ts`)

### Frontend (React)

- Composants fonctionnels uniquement
- Props typées explicitement (pas d'inférence implicite)
- Pas de logique métier dans les composants — extraire dans des hooks custom
- Tests composants avec Vitest

### Types partagés (@wander/types)

- Uniquement les types de réponse API consommés par le frontend
- Pas de DTOs, pas d'entités Prisma
- Tout export passe par `packages/types/index.ts`

---

# Variables d'environnement

### apps/api/.env

```
REDIS_URL=redis://localhost:6379
CLAUDE_API_KEY=
PORT=3000
```

### apps/web/.env

```
VITE_API_URL=http://localhost:3000
```

---

# Commandes utiles

```bash
# Depuis la racine
pnpm install              # installer toutes les dépendances
pnpm lint                 # lint global
pnpm format               # prettier global

# Backend
cd apps/api
pnpm start:dev            # dev avec hot reload
pnpm test                 # tests unitaires

# Frontend
cd apps/web
pnpm dev                  # dev Vite
pnpm test                 # tests Vitest

# Docker (dev)
docker compose up -d      # lance Redis en arrière-plan
docker compose down       # arrête tout
docker exec -it wander-redis redis-cli ping  # vérifie que Redis répond
```

# Git workflow

- Branche `main` : protégée, PR obligatoire avant merge
- Branche `dev` : branche de travail principale
- Branches features : `feat/nom-feature` → PR vers `dev`
- Ne jamais pousser directement sur `main`

# CI/CD

### GitHub Actions

- Pipeline sur chaque push : lint + tests + build
- Fichiers dans `.github/workflows/`

### Husky

- Lint bloquant avant chaque push local (`pre-push`)
- Tests bloquant
- Config dans `.husky/`

---

## Ce qui n'est PAS dans ce projet (pour l'instant)

- PostgreSQL / Prisma — pas de persistance, pas d'auth
- SDK client partagé — sera ajouté si mobile ajouté plus tard
- Rate limiting — géré côté cache Redis uniquement

---

## Règles absolues

1. Ne jamais exposer une clé API côté frontend
2. Tout appel API externe passe par le cache Redis
3. TypeScript strict — aucune exception
4. Un seul sujet à la fois, validation avant de passer à l'étape suivante
