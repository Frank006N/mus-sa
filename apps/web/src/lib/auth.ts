export interface User { 
  email: string; 
  name: string; 
  role: 'student' | 'admin'; 
  regNo?: string;
  isAnonymous?: boolean; 
}

export const UNIVERSITY_OFFICES = [
  { id: 'dean-students', name: 'Dean of Students', email: 'dean.students@mut.ac.ke', icon: '🎓', description: 'Student welfare, discipline, and campus life' },
  { id: 'security', name: 'Campus Security', email: 'security@mut.ac.ke', icon: '️', description: 'Safety concerns, unauthorized access, theft' },
  { id: 'it-support', name: 'IT Support', email: 'itsupport@mut.ac.ke', icon: '💻', description: 'WiFi, portal, email, and technical issues' },
  { id: 'health', name: 'Health Services', email: 'clinic@mut.ac.ke', icon: '🏥', description: 'Medical emergencies, health complaints' },
  { id: 'accommodation', name: 'Accommodation Office', email: 'hostels@mut.ac.ke', icon: '', description: 'Room allocations, maintenance, hostel issues' },
  { id: 'academics', name: 'Academic Registrar', email: 'registrar@mut.ac.ke', icon: '📚', description: 'Grades, transcripts, course registration' },
] as const;

const REGNO_REGEX = /^[A-Z]{2}\d{3}\/\d{4}\/\d{4}$/;

export const authService = {
  login: (email: string, password: string, regNo?: string): User => {
    const isAdmin = email.toLowerCase().endsWith('@mut.ac.ke');
    
    if (!isAdmin && regNo && !REGNO_REGEX.test(regNo)) {
      throw new Error('Invalid Registration Number format. Use AB123/4567/2789');
    }

    const user: User = { 
      email, 
      name: email.split('@')[0].replace(/[._]/g, ' '), 
      role: isAdmin ? 'admin' : 'student',
      regNo: isAdmin ? undefined : regNo,
      isAnonymous: false 
    };
    
    sessionStorage.setItem('mut_session', JSON.stringify(user));
    return user;
  },
  
  getSession: (): User | null => {
    try { return JSON.parse(sessionStorage.getItem('mut_session') || 'null'); } 
    catch { return null; }
  },
  
  logout: () => sessionStorage.removeItem('mut_session'),
  
  toggleAnonymity: () => {
    const s = authService.getSession();
    if (s) { s.isAnonymous = !s.isAnonymous; sessionStorage.setItem('mut_session', JSON.stringify(s)); }
  },
  
  updateRegNo: (regNo: string): boolean => {
    if (!REGNO_REGEX.test(regNo)) return false;
    const s = authService.getSession();
    if (s && s.role === 'student') {
      s.regNo = regNo;
      sessionStorage.setItem('mut_session', JSON.stringify(s));
      return true;
    }
    return false;
  }
};
