import { getCategories } from '@/lib/db';
import { AddExpenseClient } from '@/components/AddExpenseClient';

export default async function NewExpensePage() {
  const categories = await getCategories();
  return <AddExpenseClient categories={categories} />;
}
