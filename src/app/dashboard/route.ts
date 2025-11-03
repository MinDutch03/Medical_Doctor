import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Explicitly reject POST requests to /dashboard
// All API calls should go to /api/* routes
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method Not Allowed. Use /api/sessions instead.' },
    { status: 405 }
  );
}

