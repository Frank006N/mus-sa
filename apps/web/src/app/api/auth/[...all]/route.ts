import { NextResponse } from 'next/server';

// TEMPORARY STUB: Bypasses broken Lucia v3 implementation
// TODO: Re-implement with correct validateSession types when Lucia is fixed
export async function GET() {
  return NextResponse.json({ user: null, message: 'Auth temporarily disabled' }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ success: false, message: 'Auth temporarily disabled' }, { status: 200 });
}
