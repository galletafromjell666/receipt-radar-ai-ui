import { Container, Title, Group, Card, SimpleGrid, Skeleton, Stack } from '@mantine/core';

export default function ExpensesLoading() {
  return (
    <Container size="lg">
      <Skeleton height={28} width={200} mb="md" />

      <Group mb="md" justify="space-between">
        <Skeleton height={36} width={160} />
        <Group>
          <Skeleton height={36} width={200} />
          <Skeleton height={36} width={120} />
          <Skeleton height={36} width={150} />
        </Group>
      </Group>

      <Card p="md" withBorder mb="md">
        <SimpleGrid cols={{ base: 2, sm: 4 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton height={12} width={60} mb="xs" />
              <Skeleton height={28} width={100} />
            </div>
          ))}
        </SimpleGrid>
      </Card>

      <Skeleton height={280} mb="md" radius="md" />
      <Skeleton height={220} mb="md" radius="md" />

      <Stack gap="sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} p="md" withBorder>
            <Skeleton height={12} width={80} mb="xs" />
            <Skeleton height={16} width={140} mb="xs" />
            <Skeleton height={12} width={100} />
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
