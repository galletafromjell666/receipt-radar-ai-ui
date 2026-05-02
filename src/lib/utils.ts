// TODO: Remove +6h offset once backend stores dates as UTC (see README.md)
export function formatDate(date: Date | null): string {
  if (!date) return 'N/A';
  const localDate = new Date(date.getTime() + (6 * 60 * 60 * 1000));
  return localDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}