import { NextResponse } from 'next/server';
export async function GET() { return NextResponse.json([]); }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ success: true, id: 'mock-' + Date.now(), ...body }, { status: 201 });
}
