import { getRecurrentExpenses, getCategories } from '@/lib/db';
import { RecurringClient } from '@/components/RecurringClient';

export default async function RecurringPage() {
  const [expenses, categories] = await Promise.all([
    getRecurrentExpenses(),
    getCategories(),
  ]);

  return <RecurringClient initialExpenses={expenses} categories={categories} />;
}
