// Tipos base para respostas da API
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}

// Tipos para autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'teacher' | 'student';

// Tipos para avaliações
export interface Assessment {
  id: string;
  title: string;
  description: string;
  type: AssessmentType;
  status: AssessmentStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  questions: Question[];
}

export type AssessmentType = 'quiz' | 'exam' | 'project';
export type AssessmentStatus = 'draft' | 'published' | 'closed';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  correctAnswer?: string;
  points: number;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Tipos para resultados
export interface AssessmentResult {
  id: string;
  assessmentId: string;
  userId: string;
  score: number;
  maxScore: number;
  answers: Answer[];
  submittedAt: string;
}

export interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  points: number;
}

// Tipos para paginação
export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para filtros
export interface AssessmentFilters {
  type?: AssessmentType;
  status?: AssessmentStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Tipos para estatísticas
export interface AssessmentStats {
  totalAssessments: number;
  totalStudents: number;
  averageScore: number;
  completionRate: number;
  recentResults: AssessmentResult[];
} 