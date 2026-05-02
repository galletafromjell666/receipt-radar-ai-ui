'use client';

import { Select } from '@mantine/core';

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
  const handleChange = (value: string | null) => {
    const newMonth = value || currentMonth;
    if (onMonthChange) {
      onMonthChange(newMonth);
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
