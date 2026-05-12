import { Container, Stack, Skeleton, Group, Paper } from '@mantine/core';

export default function RecurringLoading() {
  return (
    <Container size="sm">
      <Group justify="space-between" mb="md">
        <Skeleton height={28} width={200} />
        <Skeleton height={36} width={140} />
      </Group>

      {Array.from({ length: 5 }).map((_, i) => (
        <Paper key={i} p="md" withBorder radius="md" mb="sm">
          <Group justify="space-between">
            <div>
              <Skeleton height={20} width={160} mb="xs" />
              <Group gap="xs">
                <Skeleton height={18} width={60} />
                <Skeleton height={14} width={40} />
              </Group>
            </div>
            <Group gap="xs">
              <Skeleton height={20} width={60} />
              <Skeleton height={28} width={28} radius="md" />
              <Skeleton height={28} width={28} radius="md" />
            </Group>
          </Group>
        </Paper>
      ))}
    </Container>
  );
}
