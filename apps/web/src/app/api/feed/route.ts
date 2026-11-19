import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: '1', author: 'Dean of Students', content: 'Graduation clearance updates now live on portal', timestamp: new Date().toISOString() },
    { id: '2', author: 'CS Department', content: 'Hackathon registration closes Friday', timestamp: new Date().toISOString() }
  ]);
}
