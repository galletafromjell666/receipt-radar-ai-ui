import { Container, Title, Text, Alert, Stack, Card, SimpleGrid, Anchor } from '@mantine/core';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { getMonthlyStats, getRecentExpenses, Expense } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import { ExpenseCard } from '@/components/ExpenseCard';

export default async function Home() {
  let stats = null;
  let recentExpenses: Expense[] = [];
  let error = null;

  try {
    [stats, recentExpenses] = await Promise.all([
      getMonthlyStats(),
      getRecentExpenses(10),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load expenses';
  }

  if (error) {
    return (
      <AppShellWrapper>
        <Container size="lg">
          <Alert title="Error" color="red" mt="md">
            {error}
          </Alert>
        </Container>
      </AppShellWrapper>
    );
  }

  return (
    <AppShellWrapper>
      <Container size="lg">
        <Title order={2} mb="md">Overview</Title>

        {stats && (
          <SimpleGrid cols={{ base: 2, sm: 4 }} mb="lg">
            <Card p="md" withBorder>
              <Text size="xs" c="dimmed">Total {stats.monthName}</Text>
              <Text size="xl" fw={700}>{formatCurrency(stats.totalSpend)}</Text>
            </Card>
            <Card p="md" withBorder>
              <Text size="xs" c="dimmed">Transactions</Text>
              <Text size="xl" fw={700}>{stats.transactionCount}</Text>
            </Card>
            <Card p="md" withBorder>
              <Text size="xs" c="dimmed">Top Category</Text>
              <Text size="lg" fw={700} truncate>{stats.topCategory || 'N/A'}</Text>
            </Card>
            <Card p="md" withBorder>
              <Text size="xs" c="dimmed">Average</Text>
              <Text size="xl" fw={700}>{formatCurrency(stats.averageAmount)}</Text>
            </Card>
          </SimpleGrid>
        )}

        <Title order={3} mb="md">Recent Expenses</Title>

        {recentExpenses.length === 0 ? (
          <Text c="dimmed">No expenses found</Text>
        ) : (
          <>
            <Stack gap="sm">
              {recentExpenses.map((expense) => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </Stack>
            <Text mt="md">
              <Anchor href="/expenses">View all expenses</Anchor>
            </Text>
          </>
        )}
      </Container>
    </AppShellWrapper>
  );
}
