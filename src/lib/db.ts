import { drizzle } from 'drizzle-orm/neon-http';
import { expenses } from './schema';
import { eq, ilike, desc, asc, count, sum, avg, max, gte, lte, and } from 'drizzle-orm';

const db = drizzle(process.env.NEON_DATABASE_URL!);

export interface MonthlyStats {
  totalSpend: number;
  transactionCount: number;
  topCategory: string | null;
  averageAmount: number;
  monthName: string;
}

export interface GetExpensesParams {
  search?: string;
  sort?: 'date' | 'amount' | 'merchant';
  dir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  month?: string; // format: "YYYY-MM"
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

export async function getExpensesByMonth(month: string, search?: string, sort: 'date' | 'amount' | 'merchant' = 'date', dir: 'asc' | 'desc' = 'desc'): Promise<Expense[]> {
  try {
    const [year, monthNum] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

    const orderByFn = sort === 'amount'
      ? dir === 'desc' ? desc(expenses.amount) : asc(expenses.amount)
      : sort === 'merchant'
      ? dir === 'desc' ? desc(expenses.merchant) : asc(expenses.merchant)
      : dir === 'desc' ? desc(expenses.date) : asc(expenses.date);

    let whereCondition = and(gte(expenses.date, startOfMonth), lte(expenses.date, endOfMonth));

    if (search) {
      const searchCondition = and(
        ilike(expenses.merchant, `%${search}%`),
        ilike(expenses.category, `%${search}%`),
        ilike(expenses.source, `%${search}%`)
      );
      whereCondition = and(whereCondition, searchCondition);
    }

    const result = await db.select().from(expenses).where(whereCondition).orderBy(orderByFn);
    return result.map(rowToExpense);
  } catch (e) {
    console.error('getExpensesByMonth error:', e);
    return [];
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
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthName = now.toLocaleString('en-US', { month: 'long' });

    const result = await db.select({
      totalSpend: sum(expenses.amount),
      transactionCount: count(),
      topCategory: max(expenses.category),
      averageAmount: avg(expenses.amount),
    })
    .from(expenses)
    .where(gte(expenses.date, startOfMonth));

    const row = result[0];
    return {
      totalSpend: Number(row?.totalSpend) || 0,
      transactionCount: Number(row?.transactionCount) || 0,
      topCategory: row?.topCategory || null,
      averageAmount: Number(row?.averageAmount) || 0,
      monthName,
    };
  } catch (e) {
    console.error('getMonthlyStats error:', e);
    return {
      totalSpend: 0,
      transactionCount: 0,
      topCategory: null,
      averageAmount: 0,
      monthName: new Date().toLocaleString('en-US', { month: 'long' }),
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

export async function getMonthsWithData(): Promise<string[]> {
  try {
    const result = await db.select({ date: expenses.date }).from(expenses);
    
    const monthsSet = new Set<string>();
    for (const row of result) {
      if (row.date) {
        const d = new Date(row.date);
        const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthsSet.add(monthStr);
      }
    }

    return Array.from(monthsSet).sort().reverse();
  } catch (e) {
    console.error('getMonthsWithData error:', e);
    return [];
  }
}