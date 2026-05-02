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

## Timezone Fix (IMPORTANT)

**Issue**: Dates from the database are stored in local time (CST/GMT-6, El Salvador) but JavaScript parses them as UTC, causing dates to show as the previous day.

**Current Workaround**: Frontend adds +6 hours offset when formatting dates.

**Proper Fix**: Update the Python backend to store dates as UTC:
- In `src/models.py`, change the date column to use timezone-aware timestamps:
```python
from datetime import datetime, timezone

date = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
```

Once the backend is fixed, remove the `+ (6 * 60 * 60 * 1000)` offset in:
- `src/app/page.tsx` (formatDate function)
- `src/components/ExpenseCard.tsx` (formatDate function)

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