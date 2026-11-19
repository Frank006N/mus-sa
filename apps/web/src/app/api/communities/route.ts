import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json([
    { id: '1', name: 'Computer Science', members: 120, description: 'Official CS community' },
    { id: '2', name: 'Engineering', members: 85, description: 'School of Engineering hub' },
    { id: '3', name: 'Innovation Hub', members: 45, description: 'Student startups & projects' }
  ]);
}
