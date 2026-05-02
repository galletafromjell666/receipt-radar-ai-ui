import { Container, Title, Stack, Card, SimpleGrid, Skeleton } from '@mantine/core';

export default function OverviewLoading() {
  return (
    <Container size="lg">
      <Skeleton height={28} width={200} mb="md" />

      <SimpleGrid cols={{ base: 2, sm: 4 }} mb="lg">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} p="md" withBorder>
            <Skeleton height={12} width={40} mb="xs" />
            <Skeleton height={28} width={80} />
          </Card>
        ))}
      </SimpleGrid>

      <Skeleton height={22} width={180} mb="md" />

      <Stack gap="sm">
        {Array.from({ length: 10 }).map((_, i) => (
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
