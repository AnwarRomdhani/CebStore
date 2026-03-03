# Cebstore — Plateforme E-commerce Intelligente

Implémentation du cahier des charges (Février 2026) pour une plateforme e-commerce moderne avec **API NestJS + PostgreSQL/Prisma** et **Frontend Next.js 14 + TailwindCSS**.

## Stack
- **Backend**: NestJS, Prisma, PostgreSQL, Swagger/OpenAPI, JWT + refresh, RBAC, throttling, Helmet.
- **Frontend**: Next.js 14 (App Router), TailwindCSS, cookie-based auth proxy, typed client (OpenAPI).
- **IA & workflows**: OpenAI + pgvector (knowledge base), n8n webhooks (workflows).

## Structure
- **API**: `nestjs/e-commerce-cebstore/api`
- **Frontend**: `nestjs/e-commerce-cebstore/frontend`
- **Docs**: `nestjs/e-commerce-cebstore/docs`

## Démarrage rapide (local)

### 1) Backend (API)
```bash
cd nestjs/e-commerce-cebstore/api
npm install
cp .env.example .env
```

Configure `DATABASE_URL`, `JWT_SECRET`, `REFRESH_SECRET` dans `.env`, puis:

```bash
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

- Swagger UI: `http://localhost:3001/api/docs`
- OpenAPI JSON: `http://localhost:3001/api/docs-json`

### 2) Frontend (Next.js)
```bash
cd nestjs/e-commerce-cebstore/frontend
npm install
cp .env.example .env.local
npm run dev
```

App: `http://localhost:3000`

## Génération du client typé (OpenAPI)
Sans dépendre de la DB, on génère un `openapi.json` à partir des decorators NestJS:

```bash
cd nestjs/e-commerce-cebstore/api
npm run generate:openapi

cd ../frontend
npm run generate:api
```

## Branding
- **Couleur de base**: `#2cc197` (configurée via variables CSS + Tailwind)

## Docs
- Roadmap: `docs/ROADMAP.md`
- Sécurité: `docs/SECURITY.md`
