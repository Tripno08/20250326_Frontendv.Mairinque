export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'SPECIALIST' | 'COORDINATOR';
  institutionId?: string;
  token?: string;
  createdAt: string;
  updatedAt: string;
} 