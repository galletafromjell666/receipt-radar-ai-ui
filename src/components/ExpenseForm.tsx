'use client';

import { TextInput, NumberInput, Select, Textarea, Button, Group, Stack, Paper } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

export interface ExpenseFormValues {
  date: Date | null;
  merchant: string;
  categoryId: string | null;
  amount: number;
  source: string;
  account: string;
  description: string;
}

export function getExpenseFormValidation(opts?: { hideDate?: boolean }) {
  return {
    date: opts?.hideDate ? undefined : (v: Date | null) => (v ? null : 'Date is required'),
    merchant: (v: string) => (v.trim().length > 0 ? null : 'Merchant is required'),
    categoryId: (v: string | null) => (v ? null : 'Category is required'),
    amount: (v: number) => (v > 0 ? null : 'Amount is required'),
    source: (v: string) => (v.trim().length > 0 ? null : 'Source is required'),
    account: (v: string) => (v.trim().length > 0 ? null : 'Account is required'),
  };
}

interface ExpenseFormProps {
  form: {
    getInputProps: (field: keyof ExpenseFormValues) => any;
    isDirty: () => boolean;
    isValid: () => boolean;
    onSubmit: (handler: (values: ExpenseFormValues) => void) => any;
  };
  loading: boolean;
  submitLabel: string;
  onCancel: () => void;
  disableSubmitWhenClean?: boolean;
  categories: { id: number; name: string }[];
  hideDate?: boolean;
}

export function ExpenseForm({ form, loading, submitLabel, onCancel, disableSubmitWhenClean, categories, hideDate }: ExpenseFormProps) {
  const isDisabled = !form.isValid() || (disableSubmitWhenClean && !form.isDirty());

  return (
    <Paper withBorder p="md" radius="md">
      <Stack>
        {!hideDate && <DatePickerInput label="Date" {...form.getInputProps('date')} />}
        <TextInput label="Merchant" {...form.getInputProps('merchant')} />
        <Select
          label="Category"
          placeholder="Select a category"
          data={categories.map(c => ({ value: String(c.id), label: c.name }))}
          {...form.getInputProps('categoryId')}
        />
        <NumberInput label="Amount" {...form.getInputProps('amount')} />
        <TextInput label="Source" {...form.getInputProps('source')} />
        <TextInput label="Account" {...form.getInputProps('account')} />
        <Textarea label="Description" {...form.getInputProps('description')} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={isDisabled}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
