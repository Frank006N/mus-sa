export type CommunityScope = 'school' | 'department' | 'class';

export interface Community {
  id: string;
  name: string;
  scope: CommunityScope;
  parentId?: string; // Null for School level
  description?: string;
}

export const MOCK_COMMUNITIES: Community[] = [
  { id: 'sch-business', name: 'School of Business', scope: 'school' },
  { 
    id: 'dept-accounting', 
    name: 'Department of Accounting', 
    scope: 'department', 
    parentId: 'sch-business',
    description: 'ACCT courses and student resources'
  },
  { 
    id: 'dept-marketing', 
    name: 'Department of Marketing', 
    scope: 'department', 
    parentId: 'sch-business',
    description: 'MKT courses and industry updates'
  },
  { 
    id: 'class-acct101', 
    name: 'ACCT101 - Intro to Accounting', 
    scope: 'class', 
    parentId: 'dept-accounting',
    description: 'Year 1 Semester 1 cohort'
  },
  { 
    id: 'class-mkt201', 
    name: 'MKT201 - Digital Marketing', 
    scope: 'class', 
    parentId: 'dept-marketing',
    description: 'Year 2 Semester 2 cohort'
  },
];

export function getCommunitiesForStudent(regNo: string): Community[] {
  // Mock: SB123/2024 belongs to ACCT101 hierarchy
  if (regNo.toLowerCase().includes('sb123')) {
    return MOCK_COMMUNITIES.filter(c => 
      c.id === 'sch-business' || 
      c.id === 'dept-accounting' || 
      c.id === 'class-acct101'
    );
  }
  // Mock: SB456/2024 belongs to MKT201 hierarchy  
  if (regNo.toLowerCase().includes('sb456')) {
    return MOCK_COMMUNITIES.filter(c => 
      c.id === 'sch-business' || 
      c.id === 'dept-marketing' || 
      c.id === 'class-mkt201'
    );
  }
  return [];
}
