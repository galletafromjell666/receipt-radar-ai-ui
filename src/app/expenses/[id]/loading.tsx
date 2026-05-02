import { Container, Stack, Paper, Group, Skeleton } from '@mantine/core';

export default function EditExpenseLoading() {
  return (
    <Container size="sm">
      <Skeleton height={28} width={180} mb="md" />

      <Paper withBorder p="md" radius="md">
        <Stack>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <Skeleton height={12} width={60} mb="xs" />
              <Skeleton height={36} width="100%" />
            </div>
          ))}
          <div>
            <Skeleton height={12} width={80} mb="xs" />
            <Skeleton height={72} width="100%" />
          </div>
          <Group justify="flex-end">
            <Skeleton height={36} width={80} />
            <Skeleton height={36} width={80} />
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}
