import { NextRequest, NextResponse } from 'next/server';
import { applyRecurrentExpense } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const expenseId = parseInt(id, 10);

  if (isNaN(expenseId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const applied = await applyRecurrentExpense(expenseId);
    if (!applied) {
      return NextResponse.json({ error: 'Recurring expense not found' }, { status: 404 });
    }
    return NextResponse.json(applied);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to apply' },
      { status: 500 }
    );
  }
}
