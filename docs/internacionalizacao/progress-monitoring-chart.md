# Internacionalização - ProgressMonitoringChart

## Visão Geral

Este documento descreve as implementações de internacionalização (i18n) para o componente `ProgressMonitoringChart`, garantindo suporte a múltiplos idiomas e formatos regionais.

## Implementações

### 1. Configuração do i18n
```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      chart: {
        title: 'Monitoramento de Progresso',
        zoom: 'Zoom',
        date: 'Data',
        value: 'Valor',
        intervention: 'Intervenção',
        notes: 'Notas',
      },
    },
  },
  en: {
    translation: {
      chart: {
        title: 'Progress Monitoring',
        zoom: 'Zoom',
        date: 'Date',
        value: 'Value',
        intervention: 'Intervention',
        notes: 'Notes',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### 2. Hooks de Tradução
```typescript
// src/hooks/useTranslation.ts
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useChartTranslation = () => {
  const { t, i18n } = useTranslation();

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }, [i18n.language]);

  const formatNumber = useCallback((value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }, [i18n.language]);

  return {
    t,
    formatDate,
    formatNumber,
    currentLanguage: i18n.language,
  };
};
```

### 3. Componentes Internacionalizados
```typescript
// src/components/ChartTitle.tsx
import { useChartTranslation } from '../hooks/useTranslation';

export const ChartTitle = () => {
  const { t } = useChartTranslation();
  
  return (
    <h2 className="chart-title">
      {t('chart.title')}
    </h2>
  );
};

// src/components/ChartTooltip.tsx
import { useChartTranslation } from '../hooks/useTranslation';

export const ChartTooltip = ({ data }: { data: ChartData }) => {
  const { t, formatDate, formatNumber } = useChartTranslation();
  
  return (
    <div className="chart-tooltip">
      <div>{t('chart.date')}: {formatDate(data.date)}</div>
      <div>{t('chart.value')}: {formatNumber(data.value)}</div>
      {data.intervention && (
        <div>{t('chart.intervention')}: {data.intervention}</div>
      )}
      {data.notes && (
        <div>{t('chart.notes')}: {data.notes}</div>
      )}
    </div>
  );
};
```

## Formatos Regionais

### 1. Formato de Data
```typescript
// src/formats/date.ts
export const dateFormats = {
  pt: {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
  },
  en: {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
  },
};
```

### 2. Formato de Números
```typescript
// src/formats/number.ts
export const numberFormats = {
  pt: {
    decimal: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    percent: { style: 'percent', minimumFractionDigits: 1 },
  },
  en: {
    decimal: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    percent: { style: 'percent', minimumFractionDigits: 1 },
  },
};
```

### 3. Formato de Unidades
```typescript
// src/formats/unit.ts
export const unitFormats = {
  pt: {
    length: 'metros',
    weight: 'quilogramas',
    time: 'minutos',
  },
  en: {
    length: 'meters',
    weight: 'kilograms',
    time: 'minutes',
  },
};
```

## Componentes de Idioma

### 1. Seletor de Idioma
```typescript
// src/components/LanguageSelector.tsx
import { useChartTranslation } from '../hooks/useTranslation';

export const LanguageSelector = () => {
  const { i18n } = useChartTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div className="language-selector">
      <button
        onClick={() => changeLanguage('pt')}
        className={i18n.language === 'pt' ? 'active' : ''}
      >
        Português
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        English
      </button>
    </div>
  );
};
```

### 2. Formatador de Valores
```typescript
// src/components/ValueFormatter.tsx
import { useChartTranslation } from '../hooks/useTranslation';

export const ValueFormatter = ({ value, unit }: { value: number; unit: string }) => {
  const { formatNumber, t } = useChartTranslation();
  
  return (
    <span className="value-formatter">
      {formatNumber(value)} {t(`units.${unit}`)}
    </span>
  );
};
```

## Boas Práticas

1. **Traduções**
   - Use chaves descritivas
   - Mantenha consistência
   - Evite strings hardcoded

2. **Formatos**
   - Use APIs nativas
   - Considere localização
   - Mantenha consistência

3. **Performance**
   - Memoize formatadores
   - Lazy load traduções
   - Otimize bundles

4. **Acessibilidade**
   - Use atributos lang
   - Forneça alternativas
   - Mantenha contraste

5. **Manutenção**
   - Organize traduções
   - Documente mudanças
   - Teste idiomas

## Exemplos de Uso

### 1. Tradução de Textos
```typescript
// src/components/Chart.tsx
import { useChartTranslation } from '../hooks/useTranslation';

export const Chart = () => {
  const { t } = useChartTranslation();
  
  return (
    <div className="chart">
      <h2>{t('chart.title')}</h2>
      <div className="controls">
        <button>{t('chart.zoom')}</button>
      </div>
    </div>
  );
};
```

### 2. Formatação de Data
```typescript
// src/components/DateDisplay.tsx
import { useChartTranslation } from '../hooks/useTranslation';

export const DateDisplay = ({ date }: { date: Date }) => {
  const { formatDate } = useChartTranslation();
  
  return (
    <span className="date-display">
      {formatDate(date)}
    </span>
  );
};
```

### 3. Formatação de Números
```typescript
// src/components/NumberDisplay.tsx
import { useChartTranslation } from '../hooks/useTranslation';

export const NumberDisplay = ({ value }: { value: number }) => {
  const { formatNumber } = useChartTranslation();
  
  return (
    <span className="number-display">
      {formatNumber(value)}
    </span>
  );
};
```

## Referências

- [i18next](https://www.i18next.com/)
- [React i18next](https://react.i18next.com/)
- [Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [RTL Support](https://rtlstyling.com/)
- [ICU Message Format](http://userguide.icu-project.org/formatparse/messages) 