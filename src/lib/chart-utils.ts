import type { Expense } from './db';

const CATEGORY_COLORS = [
  'blue.6', 'teal.6', 'red.6', 'yellow.6',
  'grape.6', 'orange.6', 'cyan.6', 'pink.6',
  'lime.6', 'indigo.6', 'violet.6', 'green.6',
];

export type DayCategoryData = Record<string, number> & { day: number };

export interface CategoryTotal {
  name: string;
  value: number;
  color: string;
}

export function assignCategoryColors(categories: string[]): Record<string, string> {
  const unique = [...new Set(categories.filter(Boolean))].sort();
  const map: Record<string, string> = {};
  unique.forEach((cat, i) => {
    map[cat] = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
  });
  return map;
}

export function buildDailyCategoryData(
  expenses: Expense[],
  year: number,
  month: number
): { data: DayCategoryData[]; categories: string[] } {
  if (expenses.length === 0) return { data: [], categories: [] };

  const normalized = expenses.map(e => ({
    ...e,
    category: e.category || 'Uncategorized',
  }));

  const allCategories = [...new Set(normalized.map(e => e.category))].sort();

  const lastDay = new Date(year, month, 0).getDate();
  const dayMap = new Map<number, DayCategoryData>();

  for (let d = 1; d <= lastDay; d++) {
    const row: DayCategoryData = { day: d } as DayCategoryData;
    for (const cat of allCategories) row[cat] = 0;
    dayMap.set(d, row);
  }

  for (const exp of normalized) {
    if (!exp.date) continue;
    const expDay = exp.date.getDate();
    const entry = dayMap.get(expDay);
    if (entry && exp.category) {
      entry[exp.category] = (entry[exp.category] || 0) + exp.amount;
    }
  }

  return { data: Array.from(dayMap.values()), categories: allCategories };
}

export function buildCategoryTotals(
  expenses: Expense[],
  colorMap: Record<string, string>
): CategoryTotal[] {
  const totals: Record<string, number> = {};
  for (const exp of expenses) {
    const cat = exp.category || 'Uncategorized';
    totals[cat] = (totals[cat] || 0) + exp.amount;
  }

  return Object.entries(totals)
    .map(([name, value]) => ({
      name,
      value,
      color: colorMap[name] || 'gray.6',
    }))
    .sort((a, b) => b.value - a.value);
}
