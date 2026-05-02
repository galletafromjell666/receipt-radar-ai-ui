'use client';

import { Container, Alert, Button, Text } from '@mantine/core';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container size="sm" py="xl">
      <Alert title="Something went wrong" color="red">
        <Text mb="md">{error.message || 'Failed to load expenses'}</Text>
        <Button onClick={reset}>Try again</Button>
      </Alert>
    </Container>
  );
}
