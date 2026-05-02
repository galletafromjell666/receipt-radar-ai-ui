# Receipt Radar AI Frontend

AI-powered expense tracker. Connects directly to NeonDB via Drizzle ORM — no API layer, Server Components fetch DB on render.

## Tech Stack

- **Next.js 16** + **React 19**
- **Mantine v9** — UI, charts, dark mode default
- **Drizzle ORM** — typed queries via neon-http driver
- **Neon PostgreSQL** — serverless, direct from server components

## Routes

| Route | Description |
|---|---|
| `/` | Overview — monthly stats cards + last 10 expenses |
| `/expenses` | Filterable list — month picker, search, sort, stacked bar chart, category donut chart, pagination |
| `/expenses/[id]` | Edit form with isDirty validation, toast notifications, back navigation |

## Key Architecture

- **No API layer** — Server Components query NeonDB directly via Drizzle
- **Client-side filtering** — `/expenses` fetches all rows for a month, then search/sort/charts run in JS for instant reactivity
- **Deterministic chart colors** — categories get stable 12-color palette, consistent across charts
- **Dark mode only** — hard-set via `data-mantine-color-scheme` + MantineProvider

## Quick Start

```bash
pnpm install
pnpm dev
```

Create a `.env` file:

```
NEON_DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```
