'use client';

import { Stack, Pagination, Group } from '@mantine/core';
import { ExpenseCard } from './ExpenseCard';
import type { Expense } from '@/lib/db';

interface ExpenseListProps {
  expenses: Expense[];
  total: number;
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
}

export function ExpenseList({ expenses, total, page, limit, onPageChange }: ExpenseListProps) {
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <Stack gap="sm" mt="md">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination total={totalPages} value={page} onChange={onPageChange} />
        </Group>
      )}
    </>
  );
}
