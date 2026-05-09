<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Receipt Radar AI — Frontend

AI-powered expense tracker. Next.js 16 + Mantine v9 + Drizzle ORM → NeonDB PostgreSQL. Dark mode only.

## Architecture

```
Server Components (page.tsx) → db.ts (Drizzle) → NeonDB
                                     ↑
Client Components (use client) → API routes (PATCH/POST only)
```

- **Server Components read DB directly** — no API layer for reads
- **API routes exist ONLY for mutations**: `POST /api/expenses`, `PATCH /api/expenses/[id]`
- **Client components** handle form state, charts, search/sort, pagination

## Database

| Table | Key columns |
|---|---|
| `categories` | `id PK`, `name UNIQUE`, `is_active`, `is_editable`, `created_at` |
| `expenses` | `id PK`, `category_id FK→categories.id`, `amount`, `merchant`, `source`, `account`, `description`, `date`, `email_id UNIQUE` |

- **Python script owns DDL** — do NOT create/alter tables from this repo
- **Drizzle schema mirrors tables** — keep `schema.ts` in sync with actual DB
- **Currency hardcoded to `'USD'`** — never shown in UI, always added server-side
- **`ExpenseWithCategory` type** — extends `Expense` with `categoryName` from LEFT JOIN

### Gotchas
- **Date fields**: `request.json()` deserializes dates as strings. Always wrap with `new Date(data.date)` before passing to Drizzle (see `insertExpense` / `updateExpense` in `db.ts`)
- **`updateExpense`** uses `Record<string, unknown>` for the set data to avoid Drizzle type narrowing issues

## File Map

| Path | Role |
|---|---|
| `src/lib/schema.ts` | Drizzle table definitions + types + relations |
| `src/lib/db.ts` | All DB query/mutation functions |
| `src/lib/chart-utils.ts` | Chart data builders, 12-color palette |
| `src/lib/utils.ts` | `formatCurrency`, `formatDate` |
| `src/app/layout.tsx` | Root layout, CSS imports, MantineProvider |
| `src/app/page.tsx` | Overview dashboard (stats + recent expenses) |
| `src/app/expenses/page.tsx` | Expenses list page (server fetch → client) |
| `src/app/expenses/new/page.tsx` | New expense form page |
| `src/app/expenses/[id]/page.tsx` | Edit expense form page |
| `src/app/api/expenses/route.ts` | POST handler |
| `src/app/api/expenses/[id]/route.ts` | PATCH handler |
| `src/components/AppShellWrapper.tsx` | Header nav + MantineProvider shell |
| `src/components/ExpenseForm.tsx` | Shared form (add + edit), validation rules, `ExpenseFormValues` |
| `src/components/AddExpenseClient.tsx` | Add form client logic |
| `src/components/EditExpenseClient.tsx` | Edit form client logic |
| `src/components/ExpenseCard.tsx` | Clickable card, hover pencil icon |
| `src/components/ExpenseList.tsx` | Stack of ExpenseCards + pagination |
| `src/components/ExpensesClient.tsx` | Search, sort, month filter, charts, pagination |
| `src/components/DailySpendingChart.tsx` | Stacked BarChart by day |
| `src/components/CategoryBreakdownChart.tsx` | DonutChart with legend |
| `src/components/MonthFilter.tsx` | Month dropdown selector |

## Conventions

- **Component naming**: server-rendered pages are `page.tsx`; interactive logic extracted to client components with `Client` suffix
- **Form flow**: `useForm` with `getExpenseFormValidation()`, submit converts `categoryId` string→number, redirects to `/expenses` on success
- **Cards over tables** — mobile-friendly, every card is a full `<a>` link
- **No `useEffect` for data fetching** — categories pass from Server Component props, no client-side API calls
- **Immutable state** — `useMemo` for filtered/sorted arrays, don't mutate in place
- **Toast notifications** — green on success, red on error
- **Skeletons** — `loading.tsx` per route (stats, form, list variants)

## Anti-Patterns

- **Never `form.reset()` before redirect** — causes flash of old values. Just redirect.
- **Never pass raw JSON strings to timestamp columns** — use `new Date()`
- **Never destructure `expenses` parameter from route in ISR** — use `await params`
- **Never add comments unless asked** — code should be self-documenting

## Rules for LLM Agents

- **When debugging and unable to determine root cause after one attempt**: ask the user for console logs, network payloads, or error output — do NOT cycle through repeated fixes without new information
- **When you change your mind about an approach mid-implementation**: pause, explain the tradeoff, and ask the user which direction to take
- **Before committing**: verify with `npm run build`
- **Never commit unless explicitly asked**
- **Never run destructive commands without user confirmation**: this includes `rm`, `git reset`, `git revert`, `git push --force`, `npm uninstall`, and any other irreversible file or git operation

