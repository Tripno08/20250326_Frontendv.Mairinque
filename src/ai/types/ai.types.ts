import { BaseEntity } from '@/types/base';

// Tipos para dados de entrada do modelo
export interface StudentData extends BaseEntity {
  academicPerformance: {
    grades: number[];
    attendance: number;
    behavior: number;
  };
  demographicData: {
    age: number;
    grade: number;
    socioeconomicStatus: number;
  };
  interventionHistory: {
    type: string;
    date: Date;
    outcome: number;
  }[];
}

// Tipos para previsões do modelo
export interface RiskPrediction extends BaseEntity {
  studentId: string;
  riskScore: number;
  confidence: number;
  factors: {
    factor: string;
    weight: number;
    impact: number;
  }[];
  timestamp: Date;
}

// Tipos para recomendações
export interface InterventionRecommendation extends BaseEntity {
  studentId: string;
  interventionType: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  explanation: string;
  similarCases: {
    studentId: string;
    similarity: number;
    outcome: number;
  }[];
  timestamp: Date;
}

// Tipos para clusters
export interface StudentCluster extends BaseEntity {
  clusterId: number;
  students: string[];
  characteristics: {
    feature: string;
    value: number;
    importance: number;
  }[];
  recommendations: string[];
  size: number;
}

// Tipos para padrões detectados
export interface EducationalPattern extends BaseEntity {
  type: 'anomaly' | 'trend' | 'correlation';
  description: string;
  confidence: number;
  affectedStudents: string[];
  metrics: {
    name: string;
    value: number;
    threshold: number;
  }[];
  timestamp: Date;
}

// Tipos para configuração do modelo
export interface ModelConfig {
  learningRate: number;
  epochs: number;
  batchSize: number;
  validationSplit: number;
  features: string[];
  targetVariable: string;
}

// Tipos para métricas de performance
export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  rocCurve: {
    tpr: number[];
    fpr: number[];
  };
}

// Tipos para feedback do modelo
export interface ModelFeedback extends BaseEntity {
  predictionId: string;
  actualOutcome: number;
  predictedOutcome: number;
  feedback: 'correct' | 'incorrect';
  notes?: string;
  timestamp: Date;
}
