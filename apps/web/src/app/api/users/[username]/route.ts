import { NextRequest, NextResponse } from 'next/server';
// Adjust these imports based on YOUR actual project structure
import { db } from '@/db'; 
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    const user = await db.query.users.findFirst({
      where: eq(users.email, `${username}@student.mut.ac.ke`),
      columns: { id: true, displayName: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('User lookup failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
