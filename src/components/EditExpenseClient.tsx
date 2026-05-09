'use client';

import { Container, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Expense } from '@/lib/schema';
import { notifications } from '@mantine/notifications';
import { ExpenseForm, getExpenseFormValidation, type ExpenseFormValues } from '@/components/ExpenseForm';

interface EditExpensePageProps {
  expense: Expense;
  categories: { id: number; name: string }[];
}

export function EditExpenseClient({ expense, categories }: EditExpensePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      date: expense.date ? new Date(expense.date) : new Date(),
      merchant: expense.merchant || '',
      categoryId: expense.categoryId ? String(expense.categoryId) : null,
      amount: expense.amount,
      source: expense.source || '',
      account: expense.account || '',
      description: expense.description || '',
    } satisfies ExpenseFormValues,
    validate: getExpenseFormValidation(),
  });

  const handleSubmit = async (values: ExpenseFormValues) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          categoryId: values.categoryId ? Number(values.categoryId) : null,
          currency: 'USD',
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update expense');
      }

      notifications.show({
        title: 'Success',
        message: 'Expense updated successfully',
        color: 'green',
      });

      router.push('/expenses');
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: e instanceof Error ? e.message : 'Failed to update',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm">
      <Title order={2} mb="md">Edit Expense</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <ExpenseForm
          form={form}
          loading={loading}
          submitLabel="Save"
          onCancel={() => router.back()}
          disableSubmitWhenClean
          categories={categories}
        />
      </form>
    </Container>
  );
}
