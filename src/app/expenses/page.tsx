import { Container, Title, Text, Alert } from '@mantine/core';
import { AppShellWrapper } from '@/components/AppShellWrapper';
import { getExpenses } from '@/lib/db';
import { ExpenseList } from '@/components/ExpenseList';
import { SearchSort } from '@/components/SearchSort';

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string; dir?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.q || '';
  const sort = (params.sort as 'date' | 'amount' | 'merchant') || 'date';
  const dir = (params.dir as 'asc' | 'desc') || 'desc';
  const page = parseInt(params.page || '1', 10);
  const limit = 20;

  let result = null;
  let error = null;

  try {
    result = await getExpenses({ search, sort, dir, page, limit });
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
        <Title order={2} mb="md">All Expenses</Title>
        
        <SearchSort 
          search={search} 
          sort={sort} 
          dir={dir} 
          basePath="/expenses" 
        />

        {result?.expenses.length === 0 ? (
          <Text c="dimmed" mt="md">No expenses found</Text>
        ) : (
          <ExpenseList
            expenses={result?.expenses || []}
            total={result?.total || 0}
            page={page}
            limit={limit}
            basePath="/expenses"
          />
        )}
      </Container>
    </AppShellWrapper>
  );
}