import { NextRequest, NextResponse } from 'next/server';
import { postSessionMessage } from '@/routes/api/server';

export const runtime = 'edge';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await postSessionMessage({ body }, params.id);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

