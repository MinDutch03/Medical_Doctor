import { NextRequest, NextResponse } from 'next/server';
import { suggestDoctors } from '@/routes/api/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await suggestDoctors({ body });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

