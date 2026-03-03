# Cebstore Frontend (Next.js 14)

## Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

App: `http://localhost:3000`

## Auth model
- Cookies HttpOnly: `cebstore_access`, `cebstore_refresh`
- Le navigateur appelle les **Route Handlers** Next (`/api/*`) qui proxy vers l’API NestJS.

## Typed client (OpenAPI)
```bash
npm run generate:api
```

Cela lit `../api/openapi.json` et génère `src/types/openapi.ts`.

## Branding
- Base color: `#2cc197`
