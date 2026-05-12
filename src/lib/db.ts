import { drizzle } from 'drizzle-orm/neon-http';
import { expenses, categories, recurrentExpenses } from './schema';
import { eq, desc, count, sum, avg, gte, lte, and, sql } from 'drizzle-orm';
import type { Expense, Category, RecurrentExpense } from './schema';

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

export type ExpenseWithCategory = Expense & { categoryName: string | null };

export type RecurrentExpenseWithCategory = RecurrentExpense & { categoryName: string | null };

export type { Expense, Category, RecurrentExpense };

export async function getCategories(): Promise<Category[]> {
  try {
    return await db.select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);
  } catch (e) {
    console.error('getCategories error:', e);
    return [];
  }
}

export async function getExpensesByMonth(month: string): Promise<ExpenseWithCategory[]> {
  try {
    const [year, monthNum] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNum - 1, 1);
    const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

    const rows = await db.select()
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(and(gte(expenses.date, startOfMonth), lte(expenses.date, endOfMonth)))
      .orderBy(desc(expenses.date));

    return rows.map(row => ({
      ...row.expenses,
      categoryName: row.categories?.name ?? null,
    }));
  } catch (e) {
    console.error('getExpensesByMonth error:', e);
    return [];
  }
}

export async function getExpenseById(id: number): Promise<ExpenseWithCategory | null> {
  try {
    const rows = await db.select()
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(eq(expenses.id, id));

    const row = rows[0];
    if (!row) return null;

    return {
      ...row.expenses,
      categoryName: row.categories?.name ?? null,
    };
  } catch (e) {
    console.error('getExpenseById error:', e);
    return null;
  }
}

export async function updateExpense(id: number, data: {
  date?: Date | string | null;
  merchant?: string;
  categoryId?: number | null;
  amount?: number;
  currency?: string;
  source?: string;
  account?: string;
  description?: string;
}): Promise<Expense | null> {
  try {
    const updateData: Record<string, unknown> = {};

    if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;
    if (data.merchant !== undefined) updateData.merchant = data.merchant;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
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
        categoryName: categories.name,
        catSum: sum(expenses.amount),
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(gte(expenses.date, startOfMonth))
      .groupBy(categories.name)
      .orderBy(desc(sum(expenses.amount)))
      .limit(1),
    ]);

    const agg = aggResult[0];
    return {
      totalSpend: Number(agg?.totalSpend) || 0,
      transactionCount: Number(agg?.transactionCount) || 0,
      topCategory: topCatResult[0]?.categoryName || null,
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

export async function insertExpense(data: {
  date: Date | null;
  merchant: string;
  categoryId: number | null;
  amount: number;
  source: string;
  account: string;
  description: string;
}): Promise<Expense | null> {
  try {
    const result = await db.insert(expenses).values({
      date: data.date ? new Date(data.date) : new Date(),
      merchant: data.merchant || null,
      categoryId: data.categoryId,
      amount: data.amount,
      currency: 'USD',
      source: data.source || null,
      account: data.account || null,
      description: data.description || null,
    }).returning();
    return result[0] || null;
  } catch (e) {
    console.error('insertExpense error:', e);
    return null;
  }
}

export async function getRecentExpenses(limit: number = 10): Promise<ExpenseWithCategory[]> {
  try {
    const rows = await db.select()
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .orderBy(desc(expenses.date))
      .limit(limit);

    return rows.map(row => ({
      ...row.expenses,
      categoryName: row.categories?.name ?? null,
    }));
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

export async function getRecurrentExpenses(): Promise<RecurrentExpenseWithCategory[]> {
  try {
    const rows = await db.select()
      .from(recurrentExpenses)
      .leftJoin(categories, eq(recurrentExpenses.categoryId, categories.id))
      .orderBy(desc(recurrentExpenses.createdAt));

    return rows.map(row => ({
      ...row.recurrent_expenses,
      categoryName: row.categories?.name ?? null,
    }));
  } catch (e) {
    console.error('getRecurrentExpenses error:', e);
    return [];
  }
}

export async function insertRecurrentExpense(data: {
  merchant: string;
  categoryId: number | null;
  amount: number;
  source: string;
  account: string;
  description: string;
}): Promise<RecurrentExpense | null> {
  try {
    const result = await db.insert(recurrentExpenses).values({
      merchant: data.merchant || null,
      categoryId: data.categoryId,
      amount: data.amount,
      currency: 'USD',
      source: data.source || null,
      account: data.account || null,
      description: data.description || null,
    }).returning();
    return result[0] || null;
  } catch (e) {
    console.error('insertRecurrentExpense error:', e);
    return null;
  }
}

export async function deleteRecurrentExpense(id: number): Promise<boolean> {
  try {
    const result = await db.delete(recurrentExpenses).where(eq(recurrentExpenses.id, id)).returning();
    return result.length > 0;
  } catch (e) {
    console.error('deleteRecurrentExpense error:', e);
    return false;
  }
}

export async function applyRecurrentExpense(id: number): Promise<Expense | null> {
  try {
    const rows = await db.select().from(recurrentExpenses).where(eq(recurrentExpenses.id, id));
    const template = rows[0];
    if (!template) return null;

    const result = await db.insert(expenses).values({
      date: new Date(),
      merchant: template.merchant,
      categoryId: template.categoryId,
      amount: template.amount,
      currency: template.currency || 'USD',
      source: template.source,
      account: template.account,
      description: template.description,
    }).returning();

    return result[0] || null;
  } catch (e) {
    console.error('applyRecurrentExpense error:', e);
    return null;
  }
}
