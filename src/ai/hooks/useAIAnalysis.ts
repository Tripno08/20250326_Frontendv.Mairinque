import { useState, useEffect, useCallback } from 'react';
import {
  StudentData,
  RiskPrediction,
  InterventionRecommendation,
  StudentCluster,
  EducationalPattern,
} from '../types/ai.types';
import { PredictiveRiskModel } from '../services/PredictiveRiskModel';
import { InterventionRecommendationEngine } from '../services/InterventionRecommendationEngine';
import { StudentClusteringAnalysis } from '../services/StudentClusteringAnalysis';
import { PatternRecognitionDashboard } from '../services/PatternRecognitionDashboard';

interface AIAnalysisState {
  riskPredictions: RiskPrediction[];
  recommendations: InterventionRecommendation[];
  clusters: StudentCluster[];
  patterns: EducationalPattern[];
  isLoading: boolean;
  error: Error | null;
}

interface AIAnalysisConfig {
  riskModelConfig: {
    learningRate: number;
    epochs: number;
    batchSize: number;
    validationSplit: number;
    features: string[];
    targetVariable: string;
  };
  clusteringConfig: {
    numClusters: number;
    embeddingDimension: number;
  };
  patternConfig: {
    anomalyThreshold: number;
    timeWindow: number;
  };
}

export function useAIAnalysis(config: AIAnalysisConfig) {
  const [state, setState] = useState<AIAnalysisState>({
    riskPredictions: [],
    recommendations: [],
    clusters: [],
    patterns: [],
    isLoading: false,
    error: null,
  });

  const riskModel = new PredictiveRiskModel(config.riskModelConfig);
  const recommendationEngine = new InterventionRecommendationEngine();
  const clusteringAnalysis = new StudentClusteringAnalysis(
    config.clusteringConfig.numClusters,
    config.clusteringConfig.embeddingDimension
  );
  const patternDashboard = new PatternRecognitionDashboard(
    config.patternConfig.anomalyThreshold,
    config.patternConfig.timeWindow
  );

  const analyzeStudents = useCallback(
    async (students: StudentData[]) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Análise de risco
        const riskPredictions = await Promise.all(
          students.map(student => riskModel.predict(student))
        );

        // Recomendações de intervenção
        const recommendations = await Promise.all(
          students.map(student => recommendationEngine.generateRecommendations(student, students))
        );

        // Análise de clusters
        const clusters = await clusteringAnalysis.analyzeStudents(students);

        // Detecção de padrões
        const patterns = await patternDashboard.analyzePatterns(students);

        setState({
          riskPredictions,
          recommendations: recommendations.flat(),
          clusters,
          patterns,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Erro desconhecido na análise'),
        }));
      }
    },
    [riskModel, recommendationEngine, clusteringAnalysis, patternDashboard]
  );

  const updateModelFeedback = useCallback(
    async (studentId: string, interventionType: string, success: boolean) => {
      try {
        await recommendationEngine.updateModel({
          studentId,
          interventionType,
          success,
        });
      } catch (error) {
        console.error('Erro ao atualizar feedback do modelo:', error);
      }
    },
    [recommendationEngine]
  );

  const getStudentAnalysis = useCallback(
    (studentId: string) => {
      return {
        riskPrediction: state.riskPredictions.find(p => p.studentId === studentId),
        recommendations: state.recommendations.filter(r => r.studentId === studentId),
        cluster: state.clusters.find(c => c.students.includes(studentId)),
        patterns: patternDashboard.getPatternsByStudent(studentId),
      };
    },
    [state, patternDashboard]
  );

  const getClusterVisualization = useCallback(() => {
    return clusteringAnalysis.getClusterVisualization();
  }, [clusteringAnalysis]);

  const getPatternsByType = useCallback(
    (type: EducationalPattern['type']) => {
      return patternDashboard.getPatternsByType(type);
    },
    [patternDashboard]
  );

  const getPatternsByMetric = useCallback(
    (metricName: string) => {
      return patternDashboard.getPatternsByMetric(metricName);
    },
    [patternDashboard]
  );

  return {
    ...state,
    analyzeStudents,
    updateModelFeedback,
    getStudentAnalysis,
    getClusterVisualization,
    getPatternsByType,
    getPatternsByMetric,
  };
}
