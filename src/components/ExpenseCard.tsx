'use client';

import { Card, Group, Text, Badge, Box } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { Expense } from '@/lib/schema';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ExpenseCardProps {
  expense: Expense;
  expandable?: boolean;
  onClick?: () => void;
}

export function ExpenseCard({ expense, expandable = true, onClick }: ExpenseCardProps) {
  const [opened, { toggle }] = useDisclosure(false);

  // TODO: Remove +6h offset once backend stores dates as UTC (see README.md)
  const formattedDate = formatDate(expense.date);

  const formattedAmount = formatCurrency(expense.amount, expense.currency || 'USD');

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Group justify="space-between" wrap="nowrap">
        <Box>
          <Text size="sm" c="dimmed">{formattedDate}</Text>
          <Text fw={600} size="lg" truncate style={{ maxWidth: 200 }}>
            {expense.merchant || 'Unknown'}
          </Text>
          {expense.category && (
            <Badge size="sm" variant="light" mt={4}>
              {expense.category}
            </Badge>
          )}
        </Box>
        <Text fw={700} size="lg" c={expense.amount < 0 ? 'red' : 'inherit'}>
          {formattedAmount}
        </Text>
      </Group>

      {expandable && opened && (
        <Box mt="md" pt="sm" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
          <Group gap="xl">
            {expense.source && (
              <Box>
                <Text size="xs" c="dimmed">Source</Text>
                <Text size="sm">{expense.source}</Text>
              </Box>
            )}
            {expense.account && (
              <Box>
                <Text size="xs" c="dimmed">Account</Text>
                <Text size="sm">{expense.account}</Text>
              </Box>
            )}
          </Group>
          {expense.description && (
            <Box mt="sm">
              <Text size="xs" c="dimmed">Description</Text>
              <Text size="sm">{expense.description}</Text>
            </Box>
          )}
        </Box>
      )}
      {expandable && (
        <Text size="xs" c="blue" mt="xs" onClick={(e) => { e.stopPropagation(); toggle(); }} style={{ cursor: 'pointer' }}>
          {opened ? 'Less info' : 'More info'}
        </Text>
      )}
    </Card>
  );
}