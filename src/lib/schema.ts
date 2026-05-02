import { pgTable, serial, varchar, real, text, timestamp } from 'drizzle-orm/pg-core';

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  emailId: varchar('email_id', { length: 255 }).unique(),
  amount: real('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  category: varchar('category', { length: 100 }),
  merchant: varchar('merchant', { length: 255 }),
  source: varchar('source', { length: 255 }),
  account: varchar('account', { length: 50 }),
  description: text('description'),
  date: timestamp('date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;