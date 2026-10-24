// Blueprint Section 3.2: Institutional units with stable IDs
export type CommunityScope = 'school' | 'department' | 'class';

export interface Community {
  id: string;
  name: string;
  scope: CommunityScope;
  parentId?: string; // Null for School level
  description?: string;
  isActive: boolean;
}

// Blueprint Section 5.2: Narrow, scoped roles
export type UserRole = 
  | 'student_member'      // Read + post in joined communities
  | 'class_rep'           // Manage class notices + submit drafts
  | 'dept_admin'          // Publish/approve dept-level official content
  | 'school_admin'        // Publish/approve school-level official content  
  | 'welfare_staff'       // Access restricted welfare cases only
  | 'platform_operator';  // Infrastructure only, no welfare access

export interface Membership {
  userId: string;
  communityId: string;
  role: UserRole;
  grantedAt: string;
  expiresAt?: string; // Roles can be time-bound
  grantedBy: string;  // Audit trail
}
