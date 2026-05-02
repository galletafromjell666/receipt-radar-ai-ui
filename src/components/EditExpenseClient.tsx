'use client';

import { Container, Title, TextInput, NumberInput, Select, Textarea, Button, Group, Stack, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Expense } from '@/lib/schema';
import { notifications } from '@mantine/notifications';

interface EditExpensePageProps {
  expense: Expense;
}

export function EditExpenseClient({ expense }: EditExpensePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      merchant: expense.merchant || '',
      category: expense.category || '',
      amount: expense.amount,
      currency: expense.currency || 'USD',
      source: expense.source || '',
      account: expense.account || '',
      description: expense.description || '',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/expenses/${expense.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to update expense');
      }

      notifications.show({
        title: 'Success',
        message: 'Expense updated successfully',
        color: 'green',
      });

      form.reset();
      router.push(`/expenses/${expense.id}`);
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
        <Paper withBorder p="md" radius="md">
          <Stack>
            <TextInput
              label="Merchant"
              {...form.getInputProps('merchant')}
            />
            <TextInput
              label="Category"
              {...form.getInputProps('category')}
            />
            <NumberInput
              label="Amount"
              {...form.getInputProps('amount')}
            />
            <Select
              label="Currency"
              data={['USD', 'EUR', 'GBP', 'CAD', 'AUD']}
              {...form.getInputProps('currency')}
            />
            <TextInput
              label="Source"
              {...form.getInputProps('source')}
            />
            <TextInput
              label="Account"
              {...form.getInputProps('account')}
            />
            <Textarea
              label="Description"
              {...form.getInputProps('description')}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={loading}
                disabled={!form.isDirty()}
              >
                Save
              </Button>
            </Group>
          </Stack>
        </Paper>
      </form>
    </Container>
  );
}