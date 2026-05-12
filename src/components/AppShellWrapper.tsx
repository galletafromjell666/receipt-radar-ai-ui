'use client';

import { MantineProvider, AppShell, Group, Text, Button } from '@mantine/core';
import { IconHome, IconReceipt, IconPlus, IconRepeat } from '@tabler/icons-react';
import { Notifications } from '@mantine/notifications';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications position="top-right" />
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Text size="lg" fw={700}>Receipt Radar AI</Text>
            <Button component="a" href="/" variant="light" ml="xl" leftSection={<IconHome size={16} />}>Overview</Button>
            <Button component="a" href="/expenses" variant="light" leftSection={<IconReceipt size={16} />}>Expenses</Button>
            <Button component="a" href="/recurring" variant="light" leftSection={<IconRepeat size={16} />}>Recurring</Button>
            <Button component="a" href="/expenses/new" variant="filled" leftSection={<IconPlus size={16} />}>New Expense</Button>
          </Group>
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}