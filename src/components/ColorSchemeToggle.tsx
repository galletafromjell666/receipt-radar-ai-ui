'use client';

import { ActionIcon, useMantineColorScheme, Group } from '@mantine/core';

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Group justify="flex-end">
      <ActionIcon
        variant="subtle"
        onClick={() => toggleColorScheme()}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        size="lg"
      >
        {dark ? '☀️' : '🌙'}
      </ActionIcon>
    </Group>
  );
}