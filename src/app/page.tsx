import { Container, Title, Text, Alert, Stack, Group, Badge, Box, Anchor } from '@mantine/core';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { getMonthlyStats, getRecentExpenses, Expense } from '@/lib/db';
import { formatDate, formatCurrency } from '@/lib/utils';

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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Box p="md" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: '0.5rem' }}>
              <Text size="xs" c="dimmed">Total This Month</Text>
              <Text size="xl" fw={700}>{formatCurrency(stats.totalSpend)}</Text>
            </Box>
            <Box p="md" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: '0.5rem' }}>
              <Text size="xs" c="dimmed">Transactions</Text>
              <Text size="xl" fw={700}>{stats.transactionCount}</Text>
            </Box>
            <Box p="md" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: '0.5rem' }}>
              <Text size="xs" c="dimmed">Top Category</Text>
              <Text size="lg" fw={700} truncate>{stats.topCategory || 'N/A'}</Text>
            </Box>
            <Box p="md" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: '0.5rem' }}>
              <Text size="xs" c="dimmed">Average</Text>
              <Text size="xl" fw={700}>{formatCurrency(stats.averageAmount)}</Text>
            </Box>
          </div>
        )}

        <Title order={3} mb="md">Recent Expenses</Title>
        
        {recentExpenses.length === 0 ? (
          <Text c="dimmed">No expenses found</Text>
        ) : (
          <>
            <Stack gap="sm">
              {recentExpenses.map((expense) => (
                <Box 
                  key={expense.id}
                  component="a"
                  href={`/expenses/${expense.id}`}
                  p="md"
                  style={{ 
                    border: '1px solid var(--mantine-color-default-border)', 
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'block',
                    textDecoration: 'none',
                  }}
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
                          <Badge size="sm" variant="light">
                            {expense.category}
                          </Badge>
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
                </Box>
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