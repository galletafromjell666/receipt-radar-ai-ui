'use client';

import { MantineProvider, AppShell, Group, Text, Button, Burger, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome, IconReceipt, IconPlus, IconRepeat } from '@tabler/icons-react';
import { Notifications } from '@mantine/notifications';

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider defaultColorScheme="dark">
      <Notifications position="top-right" />
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 220, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
            <Text size="lg" fw={700}>Receipt Radar AI</Text>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Stack gap="xs">
            <Button component="a" href="/" variant="light" leftSection={<IconHome size={16} />} onClick={toggle} fullWidth justify="start">Overview</Button>
            <Button component="a" href="/expenses" variant="light" leftSection={<IconReceipt size={16} />} onClick={toggle} fullWidth justify="start">Expenses</Button>
            <Button component="a" href="/recurring" variant="light" leftSection={<IconRepeat size={16} />} onClick={toggle} fullWidth justify="start">Recurring</Button>
            <Button component="a" href="/expenses/new" variant="filled" leftSection={<IconPlus size={16} />} onClick={toggle} fullWidth justify="start">New Expense</Button>
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
