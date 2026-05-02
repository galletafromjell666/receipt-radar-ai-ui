import { drizzle } from 'drizzle-orm/neon-http';
import { expenses } from './schema';
import { eq, desc, count, sum, avg, gte, lte, and, sql } from 'drizzle-orm';
import type { Expense } from './schema';

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL environment variable is not set');
}

const db = drizzle(process.env.NEON_DATABASE_URL);

export interface MonthlyStats {
  totalSpend: number;
  transactionCount: number;
  topCategory: string | null;
  averageAmount: number;
  monthName: string;
}

export type { Expense };

export async function getExpensesByMonth(month: string): Promise<Expense[]> {
  try {
    const [year, monthNum] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

    const result = await db.select()
      .from(expenses)
      .where(and(gte(expenses.date, startOfMonth), lte(expenses.date, endOfMonth)))
      .orderBy(desc(expenses.date));

    return result;
  } catch (e) {
    console.error('getExpensesByMonth error:', e);
    return [];
  }
}

export async function getExpenseById(id: number): Promise<Expense | null> {
  try {
    const result = await db.select().from(expenses).where(eq(expenses.id, id));
    return result[0] || null;
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
    return result[0] || null;
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

    const [aggResult, topCatResult] = await Promise.all([
      db.select({
        totalSpend: sum(expenses.amount),
        transactionCount: count(),
        averageAmount: avg(expenses.amount),
      })
      .from(expenses)
      .where(gte(expenses.date, startOfMonth)),

      db.select({
        category: expenses.category,
        catCount: count(),
      })
      .from(expenses)
      .where(gte(expenses.date, startOfMonth))
      .groupBy(expenses.category)
      .orderBy(desc(count()))
      .limit(1),
    ]);

    const agg = aggResult[0];
    return {
      totalSpend: Number(agg?.totalSpend) || 0,
      transactionCount: Number(agg?.transactionCount) || 0,
      topCategory: topCatResult[0]?.category || null,
      averageAmount: Number(agg?.averageAmount) || 0,
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
    return result;
  } catch (e) {
    console.error('getRecentExpenses error:', e);
    return [];
  }
}

export async function getMonthsWithData(): Promise<string[]> {
  try {
    const result = await db.selectDistinct({
      month: sql<string>`DATE_TRUNC('month', ${expenses.date})::date`,
    })
    .from(expenses)
    .orderBy(desc(sql`DATE_TRUNC('month', ${expenses.date})::date`));

    return result.map(row => {
      const [year, month] = row.month.split('-').map(Number);
      return `${year}-${String(month).padStart(2, '0')}`;
    });
  } catch (e) {
    console.error('getMonthsWithData error:', e);
    return [];
  }
}
