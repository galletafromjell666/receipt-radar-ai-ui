import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import type { Metadata } from 'next';
import { AppShellWrapper } from '@/components/AppShellWrapper';

export const metadata: Metadata = {
  title: 'Receipt Radar AI',
  description: 'AI-powered expense tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <body>
        <AppShellWrapper>{children}</AppShellWrapper>
      </body>
    </html>
  );
}
