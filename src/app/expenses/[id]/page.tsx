import { Container, Alert } from '@mantine/core';
import { getExpenseById, getCategories } from '@/lib/db';
import { EditExpenseClient } from '@/components/EditExpenseClient';
import { notFound } from 'next/navigation';

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expenseId = parseInt(id, 10);

  if (isNaN(expenseId)) {
    notFound();
  }

  let expense = null;
  let error = null;

  try {
    [expense] = await Promise.all([
      getExpenseById(expenseId),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load expense';
  }

  if (error) {
    return (
      <Container size="sm">
        <Alert title="Error" color="red" mt="md">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!expense) {
    notFound();
  }

  const categories = await getCategories();

  return <EditExpenseClient expense={expense} categories={categories} />;
}
