'use client';

import { Card, Group, Text, SimpleGrid } from '@mantine/core';
import { IconCash, IconReceipt, IconCategory, IconTrendingUp } from '@tabler/icons-react';

interface StatsCardsProps {
  totalSpend: number;
  transactionCount: number;
  topCategory: string | null;
  averageAmount: number;
}

export function StatsCards({ totalSpend, transactionCount, topCategory, averageAmount }: StatsCardsProps) {
  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} mb="xl">
      <Card withBorder p="md" radius="md">
        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Total This Month</Text>
            <Text size="xl" fw={700}>${totalSpend.toFixed(2)}</Text>
          </div>
          <IconCash size={24} color="var(--mantine-color-blue-6)" />
        </Group>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Transactions</Text>
            <Text size="xl" fw={700}>{transactionCount}</Text>
          </div>
          <IconReceipt size={24} color="var(--mantine-color-blue-6)" />
        </Group>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Top Category</Text>
            <Text size="lg" fw={700} truncate>{topCategory || 'N/A'}</Text>
          </div>
          <IconCategory size={24} color="var(--mantine-color-blue-6)" />
        </Group>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Average</Text>
            <Text size="xl" fw={700}>${averageAmount.toFixed(2)}</Text>
          </div>
          <IconTrendingUp size={24} color="var(--mantine-color-blue-6)" />
        </Group>
      </Card>
    </SimpleGrid>
  );
}