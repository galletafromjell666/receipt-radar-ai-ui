'use client';

import { Card, Group, Text, Badge, ActionIcon } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Expense } from '@/lib/db';

export function ExpenseCard({ expense }: { expense: Expense }) {
  return (
    <Card component="a" href={`/expenses/${expense.id}`} p="md" withBorder className="expense-card">
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Text size="sm" c="dimmed">{formatDate(expense.date)}</Text>
          <Text fw={600} size="lg" truncate maw={200}>
            {expense.merchant || 'Unknown'}
          </Text>
          <Group gap="xs" mt={4}>
            {expense.category && (
              <Badge size="sm" variant="light">{expense.category}</Badge>
            )}
            {expense.source && (
              <Text size="xs" c="dimmed">{expense.source}</Text>
            )}
            {expense.account && (
              <Text size="xs" c="dimmed">••{expense.account}</Text>
            )}
          </Group>
        </div>
        <Group gap="xs" wrap="nowrap">
          <Text fw={700} size="lg" c={expense.amount < 0 ? 'red' : 'inherit'}>
            {formatCurrency(expense.amount, expense.currency || 'USD')}
          </Text>
          <ActionIcon variant="light" size="md" className="expense-card-edit">
            <IconPencil size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}
