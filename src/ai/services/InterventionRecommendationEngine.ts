import { StudentData, InterventionRecommendation } from '../types/ai.types';
import * as tf from '@tensorflow/tfjs';

export class InterventionRecommendationEngine {
  private studentProfiles: Map<string, number[]> = new Map();
  private interventionTypes: string[] = [
    'tutoring',
    'mentoring',
    'counseling',
    'parental_involvement',
    'academic_support',
    'behavioral_intervention',
  ];

  constructor() {
    this.initializeProfiles();
  }

  private initializeProfiles(): void {
    // Inicializar perfis com dados sintéticos para cold start
    this.interventionTypes.forEach(type => {
      this.studentProfiles.set(
        type,
        Array(10)
          .fill(0)
          .map(() => Math.random())
      );
    });
  }

  public async generateRecommendations(
    studentData: StudentData,
    historicalData: StudentData[]
  ): Promise<InterventionRecommendation[]> {
    const studentProfile = this.createStudentProfile(studentData);
    const similarStudents = this.findSimilarStudents(studentProfile, historicalData);

    return this.rankInterventions(studentProfile, similarStudents);
  }

  private createStudentProfile(studentData: StudentData): number[] {
    const profile: number[] = [];

    // Características acadêmicas
    const averageGrade =
      studentData.academicPerformance.grades.reduce((a, b) => a + b, 0) /
      studentData.academicPerformance.grades.length;
    profile.push(averageGrade / 10); // Normalizar para [0,1]
    profile.push(studentData.academicPerformance.attendance / 100);
    profile.push(studentData.academicPerformance.behavior / 10);

    // Características demográficas
    profile.push(studentData.demographicData.age / 18); // Normalizar para [0,1]
    profile.push(studentData.demographicData.grade / 12);
    profile.push(studentData.demographicData.socioeconomicStatus / 10);

    // Histórico de intervenções
    const interventionHistory = this.encodeInterventionHistory(studentData.interventionHistory);
    profile.push(...interventionHistory);

    return profile;
  }

  private encodeInterventionHistory(history: StudentData['interventionHistory']): number[] {
    const encoded = new Array(this.interventionTypes.length).fill(0);

    history.forEach(intervention => {
      const index = this.interventionTypes.indexOf(intervention.type);
      if (index !== -1) {
        encoded[index] = intervention.outcome / 10; // Normalizar para [0,1]
      }
    });

    return encoded;
  }

  private findSimilarStudents(
    targetProfile: number[],
    historicalData: StudentData[]
  ): { studentId: string; similarity: number; profile: number[] }[] {
    const similarities: { studentId: string; similarity: number; profile: number[] }[] = [];

    historicalData.forEach(student => {
      const profile = this.createStudentProfile(student);
      const similarity = this.calculateCosineSimilarity(targetProfile, profile);

      if (similarity > 0.5) {
        // Threshold de similaridade
        similarities.push({
          studentId: student.id,
          similarity,
          profile,
        });
      }
    });

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const norm1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const norm2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (norm1 * norm2);
  }

  private rankInterventions(
    targetProfile: number[],
    similarStudents: { studentId: string; similarity: number; profile: number[] }[]
  ): InterventionRecommendation[] {
    const interventionScores = new Map<string, number>();
    const interventionCounts = new Map<string, number>();

    // Calcular scores para cada tipo de intervenção
    similarStudents.forEach(({ similarity, profile }) => {
      const interventionIndices = this.getEffectiveInterventions(profile);

      interventionIndices.forEach(index => {
        const interventionType = this.interventionTypes[index];
        const currentScore = interventionScores.get(interventionType) || 0;
        const currentCount = interventionCounts.get(interventionType) || 0;

        interventionScores.set(interventionType, currentScore + similarity);
        interventionCounts.set(interventionType, currentCount + 1);
      });
    });

    // Calcular scores finais e gerar recomendações
    return Array.from(interventionScores.entries())
      .map(([type, score]) => {
        const count = interventionCounts.get(type) || 1;
        const averageScore = score / count;

        return {
          id: crypto.randomUUID(),
          studentId: targetProfile[0].toString(), // ID do estudante alvo
          interventionType: type,
          priority: this.determinePriority(averageScore),
          confidence: averageScore,
          explanation: this.generateExplanation(type, similarStudents),
          similarCases: similarStudents.map(s => ({
            studentId: s.studentId,
            similarity: s.similarity,
            outcome: this.getInterventionOutcome(s.profile, type),
          })),
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Retornar top 3 recomendações
  }

  private getEffectiveInterventions(profile: number[]): number[] {
    // Retornar índices das intervenções que tiveram sucesso
    return profile
      .slice(6)
      .map((score, index) => (score > 0.7 ? index : -1))
      .filter(i => i !== -1);
  }

  private determinePriority(score: number): 'high' | 'medium' | 'low' {
    if (score > 0.8) return 'high';
    if (score > 0.5) return 'medium';
    return 'low';
  }

  private generateExplanation(
    interventionType: string,
    similarStudents: { studentId: string; similarity: number; profile: number[] }[]
  ): string {
    const successRate =
      similarStudents.filter(s => this.getInterventionOutcome(s.profile, interventionType) > 0.7)
        .length / similarStudents.length;

    return (
      `Esta intervenção foi recomendada com base em ${similarStudents.length} casos similares, ` +
      `com uma taxa de sucesso de ${(successRate * 100).toFixed(1)}%. ` +
      `Estudantes com perfis similares mostraram melhoria significativa após esta intervenção.`
    );
  }

  private getInterventionOutcome(profile: number[], interventionType: string): number {
    const index = this.interventionTypes.indexOf(interventionType);
    return index !== -1 ? profile[6 + index] : 0;
  }

  public async updateModel(feedback: {
    studentId: string;
    interventionType: string;
    success: boolean;
  }): Promise<void> {
    // Atualizar o modelo com feedback sobre a efetividade das intervenções
    const profile = this.studentProfiles.get(feedback.interventionType);
    if (profile) {
      const index = Math.floor(Math.random() * profile.length); // Simular atualização de perfil
      profile[index] = feedback.success ? 1 : 0;
    }
  }
}
