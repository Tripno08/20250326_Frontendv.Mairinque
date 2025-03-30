import { useState, useMemo } from 'react';
import type { Intervention, InterventionFilters } from '@/types/intervention';
import { InterventionCard } from './InterventionCard';
import { motion, AnimatePresence } from 'framer-motion';

interface InterventionGalleryProps {
  interventions: Intervention[];
  onInterventionSelect: (intervention: Intervention) => void;
  className?: string;
}

export function InterventionGallery({
  interventions,
  onInterventionSelect,
  className = '',
}: InterventionGalleryProps) {
  const [filters, setFilters] = useState<InterventionFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterventions = useMemo(() => {
    return interventions.filter((intervention) => {
      const matchesSearch = intervention.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intervention.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intervention.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTier = !filters.tier || intervention.tier === filters.tier;
      const matchesDomain = !filters.domain || intervention.domain === filters.domain;
      const matchesEvidence = !filters.evidenceLevel || intervention.evidenceLevel === filters.evidenceLevel;
      const matchesDuration = !filters.duration || intervention.duration === filters.duration;

      return matchesSearch && matchesTier && matchesDomain && matchesEvidence && matchesDuration;
    });
  }, [interventions, filters, searchTerm]);

  const handleFilterChange = (key: keyof InterventionFilters, value: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label htmlFor="tier-select" className="sr-only">Todos os Níveis</label>
            <select
              id="tier-select"
              value={filters.tier || ''}
              onChange={(e) => handleFilterChange('tier', e.target.value || undefined)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              aria-label="Todos os Níveis"
              data-testid="tier-select"
            >
              <option value="">Todos os Níveis</option>
              {['Tier 1', 'Tier 2', 'Tier 3'].map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="domain-select" className="sr-only">Todos os Domínios</label>
            <select
              id="domain-select"
              value={filters.domain || ''}
              onChange={(e) => handleFilterChange('domain', e.target.value || undefined)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              aria-label="Todos os Domínios"
              data-testid="domain-select"
            >
              <option value="">Todos os Domínios</option>
              {['Acadêmico', 'Comportamental', 'Social', 'Emocional', 'Cognitivo', 'Comunicação'].map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="evidence-select" className="sr-only">Todos os Níveis de Evidência</label>
            <select
              id="evidence-select"
              value={filters.evidenceLevel || ''}
              onChange={(e) => handleFilterChange('evidenceLevel', e.target.value || undefined)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              aria-label="Todos os Níveis de Evidência"
              data-testid="evidence-select"
            >
              <option value="">Todos os Níveis de Evidência</option>
              {['Alta Evidência', 'Média Evidência', 'Baixa Evidência', 'Em Estudo'].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <label htmlFor="search-input" className="sr-only">Buscar intervenções</label>
          <input
            id="search-input"
            type="text"
            placeholder="Buscar intervenções..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 pl-10"
            aria-label="Buscar intervenções"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lista de Intervenções */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredInterventions.map((intervention) => (
            <motion.div
              key={intervention.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <InterventionCard
                intervention={intervention}
                onClick={onInterventionSelect}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredInterventions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma intervenção encontrada com os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
