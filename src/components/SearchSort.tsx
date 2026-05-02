'use client';

import { TextInput, Group, Select } from '@mantine/core';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from '@mantine/hooks';

interface SearchSortProps {
  search: string;
  sort: string;
  dir: string;
  basePath: string;
}

export function SearchSort({ search, sort, dir, basePath }: SearchSortProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const createQueryString = useDebouncedCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete('page'); // Reset to page 1 on search/sort change
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Group>
      <TextInput
        placeholder="Search expenses..."
        defaultValue={search}
        onChange={(e) => createQueryString('q', e.currentTarget.value)}
        style={{ flex: 1 }}
      />
      <Select
        value={sort}
        onChange={(value) => createQueryString('sort', value || 'date')}
        data={[
          { value: 'date', label: 'Date' },
          { value: 'amount', label: 'Amount' },
          { value: 'merchant', label: 'Merchant' },
        ]}
        w={120}
      />
      <Select
        value={dir}
        onChange={(value) => createQueryString('dir', value || 'desc')}
        data={[
          { value: 'desc', label: 'Descending' },
          { value: 'asc', label: 'Ascending' },
        ]}
        w={120}
      />
    </Group>
  );
}