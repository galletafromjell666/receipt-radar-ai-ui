'use client';

import { useMemo } from 'react';
import { Card, Text, Group, Box } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import type { Expense } from '@/lib/db';
import { buildCategoryTotals, assignCategoryColors } from '@/lib/chart-utils';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownChartProps {
  expenses: Expense[];
}

export function CategoryBreakdownChart({ expenses }: CategoryBreakdownChartProps) {
  const categories = useMemo(
    () => [...new Set(expenses.map(e => e.category || 'Uncategorized'))].sort(),
    [expenses]
  );

  const colorMap = useMemo(() => assignCategoryColors(categories), [categories]);

  const data = useMemo(() => buildCategoryTotals(expenses, colorMap), [expenses, colorMap]);

  if (data.length === 0) {
    return (
      <Card p="md" withBorder>
        <Text size="sm" c="dimmed" mb="xs">By Category</Text>
        <Text c="dimmed" size="sm">No data for this month</Text>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card p="md" withBorder>
      <Text size="sm" c="dimmed" mb="sm">By Category</Text>
      <Group justify="center" align="center" gap="xl">
        <Box>
          {data.map(({ name, value, color }) => (
            <Group key={name} gap="xs" mb={4} wrap="nowrap">
              <Box w={10} h={10} bg={color} style={{ borderRadius: '50%' }} />
              <Text size="sm">{name}</Text>
              <Text size="sm" c="dimmed">{formatCurrency(value)}</Text>
            </Group>
          ))}
        </Box>
        <DonutChart
          data={data}
          chartLabel={formatCurrency(total)}
          withLabels
          withLabelsLine
          size={220}
          thickness={25}
          valueFormatter={(v) => formatCurrency(v)}
          labelsType="percent"
        />
      </Group>
    </Card>
  );
}
