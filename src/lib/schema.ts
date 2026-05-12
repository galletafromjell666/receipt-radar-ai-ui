import { pgTable, serial, varchar, real, text, timestamp, integer, boolean, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  isEditable: boolean('is_editable').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Category = typeof categories.$inferSelect;

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  emailId: varchar('email_id', { length: 255 }).unique(),
  amount: real('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  categoryId: integer('category_id').references(() => categories.id),
  merchant: varchar('merchant', { length: 255 }),
  source: varchar('source', { length: 255 }),
  account: varchar('account', { length: 50 }),
  description: text('description'),
  date: timestamp('date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const expensesRelations = relations(expenses, ({ one }) => ({
  category: one(categories, {
    fields: [expenses.categoryId],
    references: [categories.id],
  }),
}));

export type Expense = typeof expenses.$inferSelect;

export const recurrentExpenses = pgTable('recurrent_expenses', {
  id: serial('id').primaryKey(),
  amount: doublePrecision('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  categoryId: integer('category_id').references(() => categories.id),
  merchant: varchar('merchant', { length: 255 }),
  source: varchar('source', { length: 255 }),
  account: varchar('account', { length: 50 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const recurrentExpensesRelations = relations(recurrentExpenses, ({ one }) => ({
  category: one(categories, {
    fields: [recurrentExpenses.categoryId],
    references: [categories.id],
  }),
}));

export type RecurrentExpense = typeof recurrentExpenses.$inferSelect;
