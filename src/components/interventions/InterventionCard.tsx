import { forwardRef } from 'react';
import type { Intervention } from '@/types/intervention';
import { motion } from 'framer-motion';

interface InterventionCardProps {
  intervention: Intervention;
  onClick: (intervention: Intervention) => void;
  className?: string;
}

export const InterventionCard = forwardRef<HTMLDivElement, InterventionCardProps>(
  ({ intervention, onClick, className = '' }, ref) => {
    const {
      title,
      description,
      tier,
      domain,
      evidenceLevel,
      duration,
      effectiveness,
      imageUrl,
      tags,
    } = intervention;

    const getEvidenceColor = (level: string) => {
      switch (level) {
        case 'Alta Evidência':
          return 'bg-green-100 text-green-800';
        case 'Média Evidência':
          return 'bg-yellow-100 text-yellow-800';
        case 'Baixa Evidência':
          return 'bg-orange-100 text-orange-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    const getTierColor = (tier: string) => {
      switch (tier) {
        case 'Tier 1':
          return 'bg-blue-100 text-blue-800';
        case 'Tier 2':
          return 'bg-purple-100 text-purple-800';
        case 'Tier 3':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(intervention)}
        className={`
          relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm
          transition-all duration-200 hover:shadow-md cursor-pointer
          ${className}
        `}
        data-testid="intervention-card"
      >
        {imageUrl && (
          <div className="aspect-w-16 aspect-h-9">
            <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTierColor(tier)}`}
            >
              {tier}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEvidenceColor(evidenceLevel)}`}
            >
              {evidenceLevel}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {duration}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {effectiveness.rating}/5
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
);

InterventionCard.displayName = 'InterventionCard';
