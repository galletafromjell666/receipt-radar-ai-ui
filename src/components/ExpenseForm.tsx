'use client';

import { TextInput, NumberInput, Textarea, Button, Group, Stack, Paper } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

export interface ExpenseFormValues {
  date: Date | null;
  merchant: string;
  category: string;
  amount: number;
  source: string;
  account: string;
  description: string;
}

interface ExpenseFormProps {
  form: {
    getInputProps: (field: keyof ExpenseFormValues) => any;
    isDirty: () => boolean;
    onSubmit: (handler: (values: ExpenseFormValues) => void) => any;
  };
  loading: boolean;
  submitLabel: string;
  onCancel: () => void;
  disableSubmitWhenClean?: boolean;
}

export function ExpenseForm({ form, loading, submitLabel, onCancel, disableSubmitWhenClean }: ExpenseFormProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Stack>
        <DatePickerInput label="Date" {...form.getInputProps('date')} />
        <TextInput label="Merchant" {...form.getInputProps('merchant')} />
        <TextInput label="Category" {...form.getInputProps('category')} />
        <NumberInput label="Amount" {...form.getInputProps('amount')} />
        <TextInput label="Source" {...form.getInputProps('source')} />
        <TextInput label="Account" {...form.getInputProps('account')} />
        <Textarea label="Description" {...form.getInputProps('description')} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={loading} disabled={disableSubmitWhenClean && !form.isDirty()}>
            {submitLabel}
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
