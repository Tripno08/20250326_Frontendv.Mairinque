import { StudentData, EducationalPattern } from '../types/ai.types';
import * as tf from '@tensorflow/tfjs';

export class PatternRecognitionDashboard {
  private anomalyThreshold: number = 2.0; // Desvios padrão para detecção de anomalias
  private timeWindow: number = 30; // Janela de tempo em dias para análise
  private patterns: EducationalPattern[] = [];

  constructor(anomalyThreshold: number = 2.0, timeWindow: number = 30) {
    this.anomalyThreshold = anomalyThreshold;
    this.timeWindow = timeWindow;
  }

  public async analyzePatterns(students: StudentData[]): Promise<EducationalPattern[]> {
    this.patterns = [];

    // Detectar anomalias
    const anomalies = await this.detectAnomalies(students);
    this.patterns.push(...anomalies);

    // Analisar tendências
    const trends = await this.analyzeTrends(students);
    this.patterns.push(...trends);

    // Identificar correlações
    const correlations = await this.identifyCorrelations(students);
    this.patterns.push(...correlations);

    return this.patterns;
  }

  private async detectAnomalies(students: StudentData[]): Promise<EducationalPattern[]> {
    const anomalies: EducationalPattern[] = [];

    // Analisar notas
    const gradeAnomalies = this.detectGradeAnomalies(students);
    anomalies.push(...gradeAnomalies);

    // Analisar frequência
    const attendanceAnomalies = this.detectAttendanceAnomalies(students);
    anomalies.push(...attendanceAnomalies);

    // Analisar comportamento
    const behaviorAnomalies = this.detectBehaviorAnomalies(students);
    anomalies.push(...behaviorAnomalies);

    return anomalies;
  }

  private detectGradeAnomalies(students: StudentData[]): EducationalPattern[] {
    const anomalies: EducationalPattern[] = [];
    const grades = students.map(
      student =>
        student.academicPerformance.grades.reduce((a, b) => a + b, 0) /
        student.academicPerformance.grades.length
    );

    const mean = grades.reduce((a, b) => a + b, 0) / grades.length;
    const stdDev = Math.sqrt(
      grades.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / grades.length
    );

    students.forEach((student, index) => {
      const grade = grades[index];
      if (Math.abs(grade - mean) > this.anomalyThreshold * stdDev) {
        anomalies.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          description: `Nota média anormal detectada: ${grade.toFixed(1)}`,
          confidence: this.calculateConfidence(Math.abs(grade - mean) / stdDev),
          affectedStudents: [student.id],
          metrics: [
            {
              name: 'averageGrade',
              value: grade,
              threshold: mean + this.anomalyThreshold * stdDev,
            },
          ],
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    return anomalies;
  }

  private detectAttendanceAnomalies(students: StudentData[]): EducationalPattern[] {
    const anomalies: EducationalPattern[] = [];
    const attendance = students.map(student => student.academicPerformance.attendance);

    const mean = attendance.reduce((a, b) => a + b, 0) / attendance.length;
    const stdDev = Math.sqrt(
      attendance.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / attendance.length
    );

    students.forEach((student, index) => {
      const attendanceValue = attendance[index];
      if (Math.abs(attendanceValue - mean) > this.anomalyThreshold * stdDev) {
        anomalies.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          description: `Frequência anormal detectada: ${attendanceValue}%`,
          confidence: this.calculateConfidence(Math.abs(attendanceValue - mean) / stdDev),
          affectedStudents: [student.id],
          metrics: [
            {
              name: 'attendance',
              value: attendanceValue,
              threshold: mean + this.anomalyThreshold * stdDev,
            },
          ],
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    return anomalies;
  }

  private detectBehaviorAnomalies(students: StudentData[]): EducationalPattern[] {
    const anomalies: EducationalPattern[] = [];
    const behavior = students.map(student => student.academicPerformance.behavior);

    const mean = behavior.reduce((a, b) => a + b, 0) / behavior.length;
    const stdDev = Math.sqrt(
      behavior.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / behavior.length
    );

    students.forEach((student, index) => {
      const behaviorValue = behavior[index];
      if (Math.abs(behaviorValue - mean) > this.anomalyThreshold * stdDev) {
        anomalies.push({
          id: crypto.randomUUID(),
          type: 'anomaly',
          description: `Comportamento anormal detectado: ${behaviorValue}`,
          confidence: this.calculateConfidence(Math.abs(behaviorValue - mean) / stdDev),
          affectedStudents: [student.id],
          metrics: [
            {
              name: 'behavior',
              value: behaviorValue,
              threshold: mean + this.anomalyThreshold * stdDev,
            },
          ],
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    return anomalies;
  }

  private async analyzeTrends(students: StudentData[]): Promise<EducationalPattern[]> {
    const trends: EducationalPattern[] = [];

    // Analisar tendência de notas
    const gradeTrend = this.analyzeGradeTrend(students);
    if (gradeTrend) {
      trends.push(gradeTrend);
    }

    // Analisar tendência de frequência
    const attendanceTrend = this.analyzeAttendanceTrend(students);
    if (attendanceTrend) {
      trends.push(attendanceTrend);
    }

    // Analisar tendência de comportamento
    const behaviorTrend = this.analyzeBehaviorTrend(students);
    if (behaviorTrend) {
      trends.push(behaviorTrend);
    }

    return trends;
  }

  private analyzeGradeTrend(students: StudentData[]): EducationalPattern | null {
    const grades = students.map(
      student =>
        student.academicPerformance.grades.reduce((a, b) => a + b, 0) /
        student.academicPerformance.grades.length
    );

    const trend = this.calculateTrend(grades);
    if (Math.abs(trend) > 0.1) {
      return {
        id: crypto.randomUUID(),
        type: 'trend',
        description: `Tendência de notas ${trend > 0 ? 'crescente' : 'decrescente'} detectada`,
        confidence: this.calculateConfidence(Math.abs(trend)),
        affectedStudents: students.map(s => s.id),
        metrics: [
          {
            name: 'gradeTrend',
            value: trend,
            threshold: 0.1,
          },
        ],
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return null;
  }

  private analyzeAttendanceTrend(students: StudentData[]): EducationalPattern | null {
    const attendance = students.map(student => student.academicPerformance.attendance);
    const trend = this.calculateTrend(attendance);

    if (Math.abs(trend) > 0.1) {
      return {
        id: crypto.randomUUID(),
        type: 'trend',
        description: `Tendência de frequência ${trend > 0 ? 'crescente' : 'decrescente'} detectada`,
        confidence: this.calculateConfidence(Math.abs(trend)),
        affectedStudents: students.map(s => s.id),
        metrics: [
          {
            name: 'attendanceTrend',
            value: trend,
            threshold: 0.1,
          },
        ],
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return null;
  }

  private analyzeBehaviorTrend(students: StudentData[]): EducationalPattern | null {
    const behavior = students.map(student => student.academicPerformance.behavior);
    const trend = this.calculateTrend(behavior);

    if (Math.abs(trend) > 0.1) {
      return {
        id: crypto.randomUUID(),
        type: 'trend',
        description: `Tendência de comportamento ${trend > 0 ? 'melhorando' : 'piorando'} detectada`,
        confidence: this.calculateConfidence(Math.abs(trend)),
        affectedStudents: students.map(s => s.id),
        metrics: [
          {
            name: 'behaviorTrend',
            value: trend,
            threshold: 0.1,
          },
        ],
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return null;
  }

  private calculateTrend(values: number[]): number {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private async identifyCorrelations(students: StudentData[]): Promise<EducationalPattern[]> {
    const correlations: EducationalPattern[] = [];

    // Correlação entre notas e frequência
    const gradeAttendanceCorrelation = this.calculateCorrelation(
      students.map(
        s =>
          s.academicPerformance.grades.reduce((a, b) => a + b, 0) /
          s.academicPerformance.grades.length
      ),
      students.map(s => s.academicPerformance.attendance)
    );

    if (Math.abs(gradeAttendanceCorrelation) > 0.5) {
      correlations.push({
        id: crypto.randomUUID(),
        type: 'correlation',
        description: `Correlação ${gradeAttendanceCorrelation > 0 ? 'positiva' : 'negativa'} forte entre notas e frequência`,
        confidence: this.calculateConfidence(Math.abs(gradeAttendanceCorrelation)),
        affectedStudents: students.map(s => s.id),
        metrics: [
          {
            name: 'gradeAttendanceCorrelation',
            value: gradeAttendanceCorrelation,
            threshold: 0.5,
          },
        ],
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Correlação entre comportamento e notas
    const behaviorGradeCorrelation = this.calculateCorrelation(
      students.map(s => s.academicPerformance.behavior),
      students.map(
        s =>
          s.academicPerformance.grades.reduce((a, b) => a + b, 0) /
          s.academicPerformance.grades.length
      )
    );

    if (Math.abs(behaviorGradeCorrelation) > 0.5) {
      correlations.push({
        id: crypto.randomUUID(),
        type: 'correlation',
        description: `Correlação ${behaviorGradeCorrelation > 0 ? 'positiva' : 'negativa'} forte entre comportamento e notas`,
        confidence: this.calculateConfidence(Math.abs(behaviorGradeCorrelation)),
        affectedStudents: students.map(s => s.id),
        metrics: [
          {
            name: 'behaviorGradeCorrelation',
            value: behaviorGradeCorrelation,
            threshold: 0.5,
          },
        ],
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return correlations;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return numerator / denominator;
  }

  private calculateConfidence(value: number): number {
    // Normalizar valor para [0,1]
    return Math.min(Math.max(value / this.anomalyThreshold, 0), 1);
  }

  public getPatternsByType(type: EducationalPattern['type']): EducationalPattern[] {
    return this.patterns.filter(pattern => pattern.type === type);
  }

  public getPatternsByStudent(studentId: string): EducationalPattern[] {
    return this.patterns.filter(pattern => pattern.affectedStudents.includes(studentId));
  }

  public getPatternsByMetric(metricName: string): EducationalPattern[] {
    return this.patterns.filter(pattern =>
      pattern.metrics.some(metric => metric.name === metricName)
    );
  }
}
