import { StudentData, StudentCluster } from '../types/ai.types';
import * as tf from '@tensorflow/tfjs';

export class StudentClusteringAnalysis {
  private numClusters: number = 5;
  private embeddingDimension: number = 2;
  private clusters: StudentCluster[] = [];
  private model: tf.LayersModel | null = null;

  constructor(numClusters: number = 5, embeddingDimension: number = 2) {
    this.numClusters = numClusters;
    this.embeddingDimension = embeddingDimension;
  }

  public async analyzeStudents(students: StudentData[]): Promise<StudentCluster[]> {
    // Preparar dados
    const features = this.prepareFeatures(students);

    // Reduzir dimensionalidade
    const embeddings = await this.reduceDimensionality(features);

    // Realizar clustering
    const clusterLabels = await this.performClustering(embeddings);

    // Gerar clusters com insights
    this.clusters = this.generateClusters(students, clusterLabels, embeddings);

    return this.clusters;
  }

  private prepareFeatures(students: StudentData[]): tf.Tensor {
    const features = students.map(student => {
      const profile: number[] = [];

      // Características acadêmicas
      const averageGrade =
        student.academicPerformance.grades.reduce((a, b) => a + b, 0) /
        student.academicPerformance.grades.length;
      profile.push(averageGrade / 10);
      profile.push(student.academicPerformance.attendance / 100);
      profile.push(student.academicPerformance.behavior / 10);

      // Características demográficas
      profile.push(student.demographicData.age / 18);
      profile.push(student.demographicData.grade / 12);
      profile.push(student.demographicData.socioeconomicStatus / 10);

      // Histórico de intervenções
      const interventionScores = this.calculateInterventionScores(student.interventionHistory);
      profile.push(...interventionScores);

      return profile;
    });

    return tf.tensor2d(features);
  }

  private calculateInterventionScores(history: StudentData['interventionHistory']): number[] {
    const scores = new Array(6).fill(0); // 6 tipos de intervenção
    const counts = new Array(6).fill(0);

    history.forEach(intervention => {
      const index = this.getInterventionIndex(intervention.type);
      if (index !== -1) {
        scores[index] += intervention.outcome;
        counts[index]++;
      }
    });

    return scores.map((score, i) => (counts[i] > 0 ? score / counts[i] / 10 : 0));
  }

  private getInterventionIndex(type: string): number {
    const types = [
      'tutoring',
      'mentoring',
      'counseling',
      'parental_involvement',
      'academic_support',
      'behavioral_intervention',
    ];
    return types.indexOf(type);
  }

  private async reduceDimensionality(features: tf.Tensor): Promise<tf.Tensor> {
    if (!this.model) {
      const inputDim = features.shape[1];
      if (typeof inputDim !== 'number') {
        throw new Error('Invalid input dimension');
      }
      this.model = this.buildAutoencoder(inputDim);
    }

    const encoder = tf.sequential({
      layers: this.model.layers.slice(0, Math.floor(this.model.layers.length / 2)),
    });

    return encoder.predict(features) as tf.Tensor;
  }

  private buildAutoencoder(inputDim: number): tf.LayersModel {
    const model = tf.sequential();

    // Encoder
    model.add(
      tf.layers.dense({
        units: 32,
        activation: 'relu',
        inputShape: [inputDim],
      })
    );
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: this.embeddingDimension, activation: 'linear' }));

    // Decoder
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: inputDim, activation: 'linear' }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
    });

    return model;
  }

  private async performClustering(embeddings: tf.Tensor): Promise<number[]> {
    // Implementar K-means clustering
    const centroids = this.initializeCentroids(embeddings);
    const labels = new Array(embeddings.shape[0]).fill(0);

    for (let i = 0; i < 100; i++) {
      // Atualizar labels
      const distances = this.calculateDistances(embeddings, centroids);
      const newLabels = this.assignLabels(distances);

      // Verificar convergência
      if (this.areLabelsEqual(labels, newLabels)) {
        break;
      }

      labels.splice(0, labels.length, ...newLabels);

      // Atualizar centroids
      centroids.forEach((_, index) => {
        const clusterPoints = embeddings.gather(
          tf.tensor1d(labels.map((l, i) => (l === index ? i : -1)).filter(i => i !== -1))
        );
        if (clusterPoints.shape[0] > 0) {
          centroids[index] = clusterPoints.mean(0);
        }
      });
    }

    return labels;
  }

  private initializeCentroids(embeddings: tf.Tensor): tf.Tensor[] {
    const centroids: tf.Tensor[] = [];
    const indices = tf.util.createShuffledIndices(embeddings.shape[0]);

    for (let i = 0; i < this.numClusters; i++) {
      centroids.push(embeddings.gather(tf.tensor1d([indices[i]])));
    }

    return centroids;
  }

  private calculateDistances(embeddings: tf.Tensor, centroids: tf.Tensor[]): tf.Tensor {
    const distances = centroids.map(centroid => {
      const diff = embeddings.sub(centroid);
      return diff.square().sum(1);
    });

    return tf.stack(distances);
  }

  private assignLabels(distances: tf.Tensor): number[] {
    const minDistances = distances.min(0);
    return Array.from(minDistances.dataSync()).map((_, i) => {
      const row = distances.slice([0, i], [-1, 1]);
      return Array.from(row.dataSync()).indexOf(minDistances.dataSync()[i]);
    });
  }

  private areLabelsEqual(labels1: number[], labels2: number[]): boolean {
    return labels1.every((label, i) => label === labels2[i]);
  }

  private generateClusters(
    students: StudentData[],
    labels: number[],
    embeddings: tf.Tensor
  ): StudentCluster[] {
    const clusters: StudentCluster[] = [];

    for (let i = 0; i < this.numClusters; i++) {
      const clusterStudents = students.filter((_, index) => labels[index] === i);
      const clusterEmbeddings = embeddings.gather(
        tf.tensor1d(labels.map((l, idx) => (l === i ? idx : -1)).filter(idx => idx !== -1))
      );

      clusters.push({
        id: crypto.randomUUID(),
        clusterId: i,
        students: clusterStudents.map(s => s.id),
        characteristics: this.analyzeClusterCharacteristics(clusterStudents),
        recommendations: this.generateClusterRecommendations(clusterStudents),
        size: clusterStudents.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return clusters;
  }

  private analyzeClusterCharacteristics(
    students: StudentData[]
  ): StudentCluster['characteristics'] {
    const characteristics: StudentCluster['characteristics'] = [];

    // Analisar características acadêmicas
    const avgGrades = students.map(
      s =>
        s.academicPerformance.grades.reduce((a, b) => a + b, 0) /
        s.academicPerformance.grades.length
    );
    characteristics.push({
      feature: 'averageGrade',
      value: avgGrades.reduce((a, b) => a + b, 0) / avgGrades.length,
      importance: 0.8,
    });

    // Analisar características demográficas
    const avgAge = students.map(s => s.demographicData.age);
    characteristics.push({
      feature: 'averageAge',
      value: avgAge.reduce((a, b) => a + b, 0) / avgAge.length,
      importance: 0.6,
    });

    // Analisar histórico de intervenções
    const interventionSuccess = this.calculateInterventionSuccess(students);
    characteristics.push({
      feature: 'interventionSuccess',
      value: interventionSuccess,
      importance: 0.7,
    });

    return characteristics;
  }

  private calculateInterventionSuccess(students: StudentData[]): number {
    let totalSuccess = 0;
    let totalInterventions = 0;

    students.forEach(student => {
      student.interventionHistory.forEach(intervention => {
        totalSuccess += intervention.outcome;
        totalInterventions++;
      });
    });

    return totalInterventions > 0 ? totalSuccess / totalInterventions / 10 : 0;
  }

  private generateClusterRecommendations(students: StudentData[]): string[] {
    const recommendations: string[] = [];

    // Analisar padrões de sucesso nas intervenções
    const interventionTypes = new Map<string, number>();
    const interventionCounts = new Map<string, number>();

    students.forEach(student => {
      student.interventionHistory.forEach(intervention => {
        const currentScore = interventionTypes.get(intervention.type) || 0;
        const currentCount = interventionCounts.get(intervention.type) || 0;

        interventionTypes.set(intervention.type, currentScore + intervention.outcome);
        interventionCounts.set(intervention.type, currentCount + 1);
      });
    });

    // Gerar recomendações baseadas nas intervenções mais bem-sucedidas
    Array.from(interventionTypes.entries())
      .sort(
        (a, b) =>
          b[1] / (interventionCounts.get(b[0]) || 1) - a[1] / (interventionCounts.get(a[0]) || 1)
      )
      .slice(0, 3)
      .forEach(([type, _]) => {
        recommendations.push(`Implementar ${type} como intervenção principal`);
      });

    return recommendations;
  }

  public getClusterVisualization(): { x: number[]; y: number[]; labels: number[] } {
    if (!this.model) {
      throw new Error('Model not trained');
    }

    const embeddings = this.model.predict(this.prepareFeatures([])) as tf.Tensor;
    const embeddingData = embeddings.dataSync();

    return {
      x: Array.from(embeddingData).filter((_, i) => i % 2 === 0),
      y: Array.from(embeddingData).filter((_, i) => i % 2 === 1),
      labels: this.clusters.flatMap(cluster =>
        Array(cluster.students.length).fill(cluster.clusterId)
      ),
    };
  }
}
