# Project Context

## Goal
Build a Mantine UI frontend for an AI expense tracker that connects directly to NeonDB PostgreSQL.

## Constraints & Preferences
- Use Drizzle ORM (not raw SQL) for DB queries
- Direct Server Components connection to DB (no API layer yet)
- Card-based list instead of table (mobile-friendly)
- No commit without explicit permission

## Progress

### Done
- Setup Next.js 16 + Mantine v9 + Drizzle ORM + neon-http driver
- Created AppShell layout with Overview/Expenses navigation
- `/` Overview page with stats cards and recent expenses list
- `/expenses` with month filter, search, sort, and client-side pagination
- `/expenses/[id]` edit form with isDirty validation and toast notifications
- Date formatting fixed (backend stores UTC, removed +6h offset)
- Month filter that queries DB for months with data, defaults to current month
- Dark mode as default (no toggle)

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Fetch all month data at once, paginate in-page — avoids Drizzle date filtering bugs
- Stats calculated client-side from fetched data — simpler than DB aggregation
- Dark mode set via `data-mantine-color-scheme="dark"` in layout.html + `defaultColorScheme="dark"` in MantineProvider

## Next Steps
- (none)

## Critical Context
- (none)

## Relevant Files
- `src/app/layout.tsx` - Root layout with dark mode
- `src/components/AppShellWrapper.tsx` - Navbar layout
- `src/lib/db.ts` - DB queries (Drizzle ORM)
- `src/app/expenses/page.tsx` - Expenses page with client-side filtering/pagination