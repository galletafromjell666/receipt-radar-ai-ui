'use client';

import { Container, Title, Stack, Text, Button, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ExpenseForm, getExpenseFormValidation, type ExpenseFormValues } from '@/components/ExpenseForm';
import { RecurrentExpenseCard } from '@/components/RecurrentExpenseCard';
import type { RecurrentExpenseWithCategory } from '@/lib/db';

interface RecurringClientProps {
  initialExpenses: RecurrentExpenseWithCategory[];
  categories: { id: number; name: string }[];
}

export function RecurringClient({ initialExpenses, categories }: RecurringClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  const form = useForm({
    initialValues: {
      date: null,
      merchant: '',
      categoryId: null,
      amount: 0,
      source: '',
      account: '',
      description: '',
    } satisfies ExpenseFormValues,
    validate: getExpenseFormValidation({ hideDate: true }),
  });

  const handleAddSubmit = async (values: ExpenseFormValues) => {
    setLoadingAdd(true);

    try {
      const res = await fetch('/api/recurring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          categoryId: values.categoryId ? Number(values.categoryId) : null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create recurring expense');
      }

      notifications.show({
        title: 'Success',
        message: 'Recurring expense created',
        color: 'green',
      });

      setShowForm(false);
      router.refresh();
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: e instanceof Error ? e.message : 'Failed to create',
        color: 'red',
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleApply = async (id: number) => {
    setApplyingId(id);

    try {
      const res = await fetch(`/api/recurring/${id}/apply`, { method: 'POST' });

      if (!res.ok) {
        throw new Error('Failed to apply');
      }

      notifications.show({
        title: 'Success',
        message: 'Expense applied',
        color: 'green',
      });

      router.refresh();
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: e instanceof Error ? e.message : 'Failed to apply',
        color: 'red',
      });
    } finally {
      setApplyingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/recurring/${id}`, { method: 'DELETE' });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      notifications.show({
        title: 'Success',
        message: 'Recurring expense removed',
        color: 'green',
      });

      router.refresh();
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: e instanceof Error ? e.message : 'Failed to delete',
        color: 'red',
      });
    }
  };

  return (
    <Container size="sm">
      <Group justify="space-between" mb="md">
        <Title order={2}>Recurring Expenses</Title>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Recurring'}
        </Button>
      </Group>

      {showForm && (
        <form onSubmit={form.onSubmit(handleAddSubmit)}>
          <ExpenseForm
            form={form}
            loading={loadingAdd}
            submitLabel="Add Recurring"
            onCancel={() => setShowForm(false)}
            categories={categories}
            hideDate
          />
        </form>
      )}

      {!showForm && initialExpenses.length === 0 && (
        <Text c="dimmed">No recurring expenses yet</Text>
      )}

      {!showForm && (
        <Stack gap="sm">
          {initialExpenses.map((expense) => (
            <RecurrentExpenseCard
              key={expense.id}
              expense={expense}
              onApply={handleApply}
              onDelete={handleDelete}
              loading={applyingId === expense.id}
            />
          ))}
        </Stack>
      )}
    </Container>
  );
}
