import { Container, Title, Text, Alert, Stack, Card, SimpleGrid, Group, Button } from '@mantine/core';
import { getMonthlyStats, getRecentExpenses, type Expense } from '@/lib/db';
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
      <Container size="lg">
        <Alert title="Error" color="red" mt="md">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Title order={2} mb="md">Overview{stats ? ` ${stats.monthName}` : ''}</Title>

      {stats && (
        <SimpleGrid cols={{ base: 2, sm: 4 }} mb="lg">
          <Card p="md" withBorder>
            <Text size="xs" c="dimmed">Total</Text>
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

      <Title order={3} mb="md">Last 10 Expenses</Title>

      {recentExpenses.length === 0 ? (
        <Text c="dimmed">No expenses found</Text>
      ) : (
        <>
          <Stack gap="sm">
            {recentExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))}
          </Stack>
          <Group justify="center" mt="md">
            <Button component="a" href="/expenses" variant="light">View all expenses</Button>
          </Group>
        </>
      )}
    </Container>
  );
}
