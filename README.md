# 🎯 nest-prisma-react-template-ts

A TypeScript monorepo boilerplate for building fullstack apps with:

- 🚀 **NestJS** (backend)
- 🧬 **Prisma** (PostgreSQL ORM)
- ⚛️ **React + Vite** (frontend)
- 🧹 **ESLint v9** (Flat Config)
- 🎨 **Prettier** (shared)
- 📦 **PNPM workspaces**
- 🛠️ Shared **TypeScript config**

---

## 🗂️ Project structure

```
.
├── apps/
│   ├── api/       # NestJS backend
│   │   └── .env   # Environment variables for backend
│   └── web/       # React + Vite frontend
│       └── .env   # Environment variables for frontend
├── prisma/        # Prisma schema
├── tsconfig.base.json
├── eslint.config.js
├── prettier.config.cjs
├── .eslintignore
├── .prettierignore
├── pnpm-workspace.yaml
```

---

## 📦 Install dependencies

```bash
pnpm install
cd apps/api && pnpm install
cd ../web && pnpm install
```

---

## 🔐 Environment variables

Create the following files:

**`apps/api/.env`**
```
DATABASE_URL=postgresql://user:password@localhost:5432/your-db
```

**`apps/web/.env`**
```
VITE_API_URL=http://localhost:3000
```

## 🧹 Lint & Format

```bash
pnpm lint       # Check code quality
pnpm format     # Format codebase with Prettier
```

---

✨ Ready to build, extend and ship.
