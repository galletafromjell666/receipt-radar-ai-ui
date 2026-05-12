import { NextRequest, NextResponse } from 'next/server';
import { deleteRecurrentExpense } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const expenseId = parseInt(id, 10);

  if (isNaN(expenseId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    const deleted = await deleteRecurrentExpense(expenseId);
    if (!deleted) {
      return NextResponse.json({ error: 'Recurring expense not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete' },
      { status: 500 }
    );
  }
}
