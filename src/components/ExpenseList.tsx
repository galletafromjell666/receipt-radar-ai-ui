'use client';

import { Stack, Pagination, Card, Group, Text, Badge, Anchor } from '@mantine/core';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { Expense } from '@/lib/db';
import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface ExpenseListProps {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  basePath: string;
}

export function ExpenseList({ expenses, total, page, limit, basePath }: ExpenseListProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Stack gap="sm" mt="md">
        {expenses.map((expense) => (
          <Card
            key={expense.id}
            component="a"
            href={`/expenses/${expense.id}`}
            p="md"
            withBorder
            style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', cursor: 'pointer' }}
            className="expense-card"
          >
            <Group justify="space-between" wrap="nowrap">
              <div>
                <Text size="sm" c="dimmed">{formatDate(expense.date)}</Text>
                <Text fw={600} size="lg" truncate style={{ maxWidth: 200 }}>
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
              <Text fw={700} size="lg" c={expense.amount < 0 ? 'red' : 'inherit'}>
                {formatCurrency(expense.amount, expense.currency || 'USD')}
              </Text>
            </Group>
          </Card>
        ))}
      </Stack>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Anchor
              key={p}
              href={`${basePath}?page=${p}`}
              c={p === page ? 'blue' : undefined}
            >
              {p}
            </Anchor>
          ))}
        </Group>
      )}
    </>
  );
}