import { NextRequest, NextResponse } from 'next/server';
import { insertExpense } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const expense = await insertExpense(body);
    if (!expense) {
      return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create expense' },
      { status: 500 }
    );
  }
}
