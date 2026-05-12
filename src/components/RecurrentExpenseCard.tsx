'use client';

import { Card, Group, Text, Badge, ActionIcon } from '@mantine/core';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';
import type { RecurrentExpenseWithCategory } from '@/lib/db';

interface RecurrentExpenseCardProps {
  expense: RecurrentExpenseWithCategory;
  onApply: (id: number) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

export function RecurrentExpenseCard({ expense, onApply, onDelete, loading }: RecurrentExpenseCardProps) {
  return (
    <Card p="md" withBorder>
      <Group justify="space-between" wrap="nowrap">
        <div>
          <Text fw={600} size="lg" truncate maw={200}>
            {expense.merchant || 'Unknown'}
          </Text>
          {expense.description && (
            <Text size="sm" c="dimmed" truncate maw={200}>{expense.description}</Text>
          )}
          <Group gap="xs" mt={4}>
            {expense.categoryName && (
              <Badge size="sm" variant="light">{expense.categoryName}</Badge>
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
          <Text fw={700} size="lg">
            {formatCurrency(expense.amount, expense.currency || 'USD')}
          </Text>
          <ActionIcon variant="light" color="green" onClick={() => onApply(expense.id)} loading={loading}>
            <IconCheck size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="red" onClick={() => onDelete(expense.id)}>
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}
