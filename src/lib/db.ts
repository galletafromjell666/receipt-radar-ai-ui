import { drizzle } from 'drizzle-orm/neon-http';
import { expenses } from './schema';
import { eq, ilike, desc, asc, count, sum, avg, max } from 'drizzle-orm';

const db = drizzle(process.env.NEON_DATABASE_URL!);

export interface MonthlyStats {
  totalSpend: number;
  transactionCount: number;
  topCategory: string | null;
  averageAmount: number;
}

export interface GetExpensesParams {
  search?: string;
  sort?: 'date' | 'amount' | 'merchant';
  dir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Expense {
  id: number;
  emailId: string | null;
  amount: number;
  currency: string;
  category: string | null;
  merchant: string | null;
  source: string | null;
  account: string | null;
  description: string | null;
  date: Date | null;
  createdAt: Date | null;
}

function rowToExpense(row: typeof expenses.$inferSelect): Expense {
  return {
    id: row.id,
    emailId: row.emailId,
    amount: row.amount,
    currency: row.currency || 'USD',
    category: row.category,
    merchant: row.merchant,
    source: row.source,
    account: row.account,
    description: row.description,
    date: row.date,
    createdAt: row.createdAt,
  };
}

export async function getExpenses(params: GetExpensesParams = {}) {
  try {
    const { search, sort = 'date', dir = 'desc', page = 1, limit = 20 } = params;
    const offset = (page - 1) * limit;

    const orderByFn = sort === 'amount'
      ? dir === 'desc' ? desc(expenses.amount) : asc(expenses.amount)
      : sort === 'merchant'
      ? dir === 'desc' ? desc(expenses.merchant) : asc(expenses.merchant)
      : dir === 'desc' ? desc(expenses.date) : asc(expenses.date);

    const conditions = search
      ? [ilike(expenses.merchant, `%${search}%`), ilike(expenses.category, `%${search}%`), ilike(expenses.source, `%${search}%`)]
      : undefined;

    const [expenseList, countResult] = await Promise.all([
      db.select().from(expenses).where(conditions?.[0]).orderBy(orderByFn).limit(limit).offset(offset),
      db.select({ count: count() }).from(expenses).where(conditions?.[0]),
    ]);

    return {
      expenses: expenseList.map(rowToExpense),
      total: countResult[0]?.count || 0,
    };
  } catch (e) {
    console.error('getExpenses error:', e);
    return { expenses: [], total: 0 };
  }
}

export async function getExpenseById(id: number): Promise<Expense | null> {
  try {
    const result = await db.select().from(expenses).where(eq(expenses.id, id));
    if (result.length === 0) return null;
    return rowToExpense(result[0]);
  } catch (e) {
    console.error('getExpenseById error:', e);
    return null;
  }
}

export async function updateExpense(id: number, data: {
  merchant?: string;
  category?: string;
  amount?: number;
  currency?: string;
  source?: string;
  account?: string;
  description?: string;
}): Promise<Expense | null> {
  try {
    const updateData: Partial<typeof expenses.$inferInsert> = {};
    
    if (data.merchant !== undefined) updateData.merchant = data.merchant;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.source !== undefined) updateData.source = data.source;
    if (data.account !== undefined) updateData.account = data.account;
    if (data.description !== undefined) updateData.description = data.description;

    if (Object.keys(updateData).length === 0) {
      throw new Error('No fields to update');
    }

    const result = await db.update(expenses).set(updateData).where(eq(expenses.id, id)).returning();
    if (result.length === 0) return null;
    return rowToExpense(result[0]);
  } catch (e) {
    console.error('updateExpense error:', e);
    return null;
  }
}

export async function getMonthlyStats(): Promise<MonthlyStats> {
  try {
    const result = await db.select({
      totalSpend: sum(expenses.amount),
      transactionCount: count(),
      topCategory: max(expenses.category),
      averageAmount: avg(expenses.amount),
    }).from(expenses);

    const row = result[0];
    return {
      totalSpend: Number(row?.totalSpend) || 0,
      transactionCount: Number(row?.transactionCount) || 0,
      topCategory: row?.topCategory || null,
      averageAmount: Number(row?.averageAmount) || 0,
    };
  } catch (e) {
    console.error('getMonthlyStats error:', e);
    return {
      totalSpend: 0,
      transactionCount: 0,
      topCategory: null,
      averageAmount: 0,
    };
  }
}

export async function getRecentExpenses(limit: number = 10): Promise<Expense[]> {
  try {
    const result = await db.select().from(expenses).orderBy(desc(expenses.date)).limit(limit);
    return result.map(rowToExpense);
  } catch (e) {
    console.error('getRecentExpenses error:', e);
    return [];
  }
}