import { Container, Title } from '@mantine/core';
import { getExpensesByMonth, getMonthsWithData } from '@/lib/db';
import { ExpensesClient } from '@/components/ExpensesClient';

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const month = params.month || getCurrentMonth();

  const [monthsWithData, allExpenses] = await Promise.all([
    getMonthsWithData(),
    getExpensesByMonth(month),
  ]);

  return (
    <Container size="lg">
      <Title order={2} mb="md">All Expenses</Title>
      <ExpensesClient
        initialExpenses={allExpenses}
        monthsWithData={monthsWithData}
        currentMonth={month}
        basePath="/expenses"
      />
    </Container>
  );
}