'use client';

import { MantineProvider, AppShell, Group, Text, Anchor } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="auto">
      <Notifications position="top-right" />
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header>
          <Group h="100%" px="md">
            <Text size="lg" fw={700}>Receipt Radar AI</Text>
            <Anchor href="/" ml="xl">Overview</Anchor>
            <Anchor href="/expenses">Expenses</Anchor>
          </Group>
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}