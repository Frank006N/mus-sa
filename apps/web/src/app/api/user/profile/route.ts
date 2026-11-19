import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ id: 'mock', name: 'Demo User', email: 'demo@mut.ac.ke', role: 'student' });
}
