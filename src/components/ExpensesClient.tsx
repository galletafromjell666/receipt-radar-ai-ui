'use client';

import { useState, useMemo } from 'react';
import { TextInput, Group, Select, Text, Box } from '@mantine/core';
import { Expense } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { ExpenseList } from '@/components/ExpenseList';
import { MonthFilter } from '@/components/MonthFilter';

interface ExpensesClientProps {
  initialExpenses: Expense[];
  monthsWithData: string[];
  currentMonth: string;
  basePath: string;
}

export function ExpensesClient({
  initialExpenses,
  monthsWithData,
  currentMonth,
  basePath,
}: ExpensesClientProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'date' | 'amount' | 'merchant'>('date');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState(currentMonth);

  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...initialExpenses];

    // Filter by search
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (exp) =>
          exp.merchant?.toLowerCase().includes(s) ||
          exp.category?.toLowerCase().includes(s) ||
          exp.source?.toLowerCase().includes(s) ||
          exp.description?.toLowerCase().includes(s)
      );
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      if (sort === 'date') {
        cmp = (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
      } else if (sort === 'amount') {
        cmp = a.amount - b.amount;
      } else if (sort === 'merchant') {
        cmp = (a.merchant || '').localeCompare(b.merchant || '');
      }
      return dir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [initialExpenses, search, sort, dir]);

  const limit = 20;
  const total = filteredAndSortedExpenses.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedExpenses = filteredAndSortedExpenses.slice(
    (page - 1) * limit,
    page * limit
  );

  // Reset page when search/sort/month changes
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: string | null) => {
    setSort((value as 'date' | 'amount' | 'merchant') || 'date');
    setPage(1);
  };

  const handleDirChange = (value: string | null) => {
    setDir((value as 'asc' | 'desc') || 'desc');
    setPage(1);
  };

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    setPage(1);
    window.location.href = `${basePath}?month=${newMonth}`;
  };

  // Stats
  const totalSpend = filteredAndSortedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const transactionCount = filteredAndSortedExpenses.length;
  const averageAmount = transactionCount > 0 ? totalSpend / transactionCount : 0;

  const categoryCounts: Record<string, number> = {};
  for (const exp of filteredAndSortedExpenses) {
    if (exp.category) {
      categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
    }
  }
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return (
    <>
      {/* Month Stats */}
      <Box mb="md">
        <Box
          p="md"
          style={{
            border: '1px solid var(--mantine-color-default-border)',
            borderRadius: '0.5rem',
            background: 'var(--mantine-color-gray-0)',
          }}
        >
          <Group justify="space-between" wrap="wrap" gap="md">
            <Box>
              <Text size="xs" c="dimmed">Total {month}</Text>
              <Text size="xl" fw={700}>{formatCurrency(totalSpend)}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">Transactions</Text>
              <Text size="lg" fw={700}>{transactionCount}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed">Average</Text>
              <Text size="lg" fw={700}>{formatCurrency(averageAmount)}</Text>
            </Box>
            {topCategory && (
              <Box>
                <Text size="xs" c="dimmed">Top Category</Text>
                <Text size="lg" fw={700}>{topCategory}</Text>
              </Box>
            )}
          </Group>
        </Box>
      </Box>

      <Group mb="md" justify="space-between">
        <Group>
          <TextInput
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            value={sort}
            onChange={handleSortChange}
            data={[
              { value: 'date', label: 'Date' },
              { value: 'amount', label: 'Amount' },
              { value: 'merchant', label: 'Merchant' },
            ]}
            w={120}
          />
          <Select
            value={dir}
            onChange={handleDirChange}
            data={[
              { value: 'desc', label: 'Descending' },
              { value: 'asc', label: 'Ascending' },
            ]}
            w={150}
          />
        </Group>
        <MonthFilter currentMonth={month} monthsWithData={monthsWithData} onMonthChange={handleMonthChange} />
      </Group>

      {paginatedExpenses.length === 0 ? (
        <Text c="dimmed" mt="md">No expenses found</Text>
      ) : (
        <ExpenseList
          expenses={paginatedExpenses}
          total={total}
          page={page}
          limit={limit}
          basePath={`${basePath}?month=${month}`}
        />
      )}
    </>
  );
}