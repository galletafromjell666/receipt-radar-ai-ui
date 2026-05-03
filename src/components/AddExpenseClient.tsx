'use client';

import { Container, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ExpenseForm, type ExpenseFormValues } from '@/components/ExpenseForm';

export function AddExpenseClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      date: new Date(),
      merchant: '',
      category: 'other',
      amount: 0,
      source: '',
      account: '',
      description: '',
    } satisfies ExpenseFormValues,
  });

  const handleSubmit = async (values: ExpenseFormValues) => {
    setLoading(true);

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to create expense');
      }

      notifications.show({
        title: 'Success',
        message: 'Expense created successfully',
        color: 'green',
      });

      router.push('/expenses');
    } catch (e) {
      notifications.show({
        title: 'Error',
        message: e instanceof Error ? e.message : 'Failed to create expense',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm">
      <Title order={2} mb="md">New Expense</Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <ExpenseForm
          form={form}
          loading={loading}
          submitLabel="Add Expense"
          onCancel={() => router.push('/expenses')}
        />
      </form>
    </Container>
  );
}
