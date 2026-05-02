'use client';

import { useMemo } from 'react';
import { Card, Text } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import type { Expense } from '@/lib/db';
import { buildDailyCategoryData, assignCategoryColors } from '@/lib/chart-utils';
import { formatCurrency } from '@/lib/utils';

interface DailySpendingChartProps {
  expenses: Expense[];
  month: string;
}

export function DailySpendingChart({ expenses, month }: DailySpendingChartProps) {
  const [year, monthNum] = month.split('-').map(Number);

  const { data, categories } = useMemo(
    () => buildDailyCategoryData(expenses, year, monthNum),
    [expenses, year, monthNum]
  );

  const colorMap = useMemo(() => assignCategoryColors(categories), [categories]);

  const series = categories.map(cat => ({
    name: cat,
    color: colorMap[cat],
  }));

  if (data.length === 0 || categories.length === 0) {
    return (
      <Card p="md" withBorder>
        <Text size="sm" c="dimmed" mb="xs">Daily Spending</Text>
        <Text c="dimmed" size="sm">No data for this month</Text>
      </Card>
    );
  }

  return (
    <Card p="md" withBorder h="100%">
      <Text size="sm" c="dimmed" mb="sm">Daily Spending</Text>
      <BarChart
        h={300}
        data={data}
        dataKey="day"
        type="stacked"
        series={series}
        withLegend
        tickLine="y"
        gridAxis="y"
        xAxisLabel="Day"
        yAxisLabel="Amount"
        valueFormatter={(v) => formatCurrency(v)}
        legendProps={{ verticalAlign: 'bottom' }}
      />
    </Card>
  );
}
