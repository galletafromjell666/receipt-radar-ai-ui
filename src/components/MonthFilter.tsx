'use client';

import { Select } from '@mantine/core';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface MonthFilterProps {
  currentMonth: string;
  monthsWithData: string[];
  onMonthChange?: (month: string) => void;
}

function getMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function MonthFilter({ currentMonth, monthsWithData, onMonthChange }: MonthFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (value: string | null) => {
    const newMonth = value || currentMonth;
    if (onMonthChange) {
      onMonthChange(newMonth);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('month', newMonth);
      params.delete('page');
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const options = monthsWithData.map(m => ({
    value: m,
    label: getMonthLabel(m),
  }));

  return (
    <Select
      value={currentMonth}
      onChange={handleChange}
      data={options}
      w={200}
    />
  );
}