# Receipt Radar AI Frontend

Frontend for the AI-powered expense tracker. Connects to NeonDB via Drizzle ORM.

## Quick Start

```bash
pnpm install
pnpm dev
```

Create a `.env` file:
```
NEON_DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

## Tech Stack

- Next.js 16
- React 19
- Mantine v9 (UI)
- Drizzle ORM (DB queries via neon-http)
- Neon PostgreSQL

## Routes

- `/` — Overview with stats and recent expenses
- `/expenses` — Full expense list with search/sort/pagination
- `/expenses/[id]` — Edit expense form