import { NextResponse } from 'next/server';

const MOCK_COMMUNITIES = [
  { id: '1', name: 'School of Computing & IT', description: 'Official hub for SCIT students.', type: 'school', memberCount: 1200, parentId: null },
  { id: '2', name: 'Computer Science Dept', description: 'BSc CS, BIT programs.', type: 'department', memberCount: 450, parentId: '1' },
  { id: '3', name: 'Cybersecurity Club', description: 'CTF competitions & security workshops.', type: 'club', memberCount: 85, parentId: '2' },
  { id: '4', name: 'School of Business', description: 'Commerce & entrepreneurship hub.', type: 'school', memberCount: 980, parentId: null },
  { id: '5', name: 'Accounting & Finance Dept', description: 'BCom Accounting & Finance.', type: 'department', memberCount: 320, parentId: '4' },
];

export async function GET() {
  try {
    return NextResponse.json({ data: MOCK_COMMUNITIES });
  } catch (error) {
    console.error('Communities API Error:', error);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
