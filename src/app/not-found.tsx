'use client';

import { Container, Title, Text, Button, Anchor } from '@mantine/core';

export default function NotFound() {
  return (
    <Container size="sm" py="xl">
      <Title order={1}>404</Title>
      <Text size="lg" mt="md">Page not found</Text>
      <Text c="dimmed" mt="sm">The page you&apos;re looking for doesn&apos;t exist.</Text>
      <Anchor href="/">
        <Button mt="xl">
          Go back home
        </Button>
      </Anchor>
    </Container>
  );
}