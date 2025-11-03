import { NextRequest, NextResponse } from 'next/server';
import { createSession, listSessions } from '@/routes/api/server';

export const runtime = 'edge';

export async function GET() {
  try {
    const result = await listSessions({});
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createSession({ body });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

