import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/routes/api/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const user = await createUser({});
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
