export type InterventionTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export type InterventionDomain =
  | 'Acadêmico'
  | 'Comportamental'
  | 'Social'
  | 'Emocional'
  | 'Cognitivo'
  | 'Comunicação';

export type EvidenceLevel = 'Alta Evidência' | 'Média Evidência' | 'Baixa Evidência' | 'Em Estudo';

export interface Intervention {
  id: string;
  title: string;
  description: string;
  tier: InterventionTier;
  domain: InterventionDomain;
  evidenceLevel: EvidenceLevel;
  duration: string;
  materials: string[];
  steps: string[];
  effectiveness: {
    rating: number;
    studies: number;
    description: string;
  };
  imageUrl?: string;
  tags: string[];
}

export interface InterventionFilters {
  tier?: InterventionTier;
  domain?: InterventionDomain;
  evidenceLevel?: EvidenceLevel;
  duration?: string;
  searchTerm?: string;
}
