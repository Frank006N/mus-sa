export interface RosterEntry {
  regNo: string;
  name: string;
  school: string;
  dept: string;
  classCode: string;
  studentEmail?: string; // Official MUT email
  personalEmail?: string; // Verified personal email
}

export const MOCK_ROSTER: RosterEntry[] = [
  { 
    regNo: 'SB123/2024', 
    name: 'John Doe', 
    school: 'Business', 
    dept: 'Accounting', 
    classCode: 'ACCT101',
    studentEmail: 'sb123@mut.ac.ke',
    personalEmail: 'john.doe@gmail.com'
  },
  { 
    regNo: 'SB456/2024', 
    name: 'Jane Smith', 
    school: 'Business', 
    dept: 'Marketing', 
    classCode: 'MKT201',
    studentEmail: 'sb456@mut.ac.ke'
  },
];

export function verifyIdentity(identifier: string): RosterEntry | null {
  const normalized = identifier.toLowerCase().trim();
  return MOCK_ROSTER.find(r => 
    r.regNo.toLowerCase() === normalized ||
    r.studentEmail?.toLowerCase() === normalized ||
    r.personalEmail?.toLowerCase() === normalized
  ) || null;
}
