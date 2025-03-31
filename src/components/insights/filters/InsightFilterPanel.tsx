import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Chip,
  FormControlLabel,
  Switch,
  Slider,
  Typography,
  Button,
  IconButton,
  Tooltip,
  SelectChangeEvent,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { AlertLevel, InsightFilters, UserProfile } from '@/types/actionable-insights';

interface InsightFilterPanelProps {
  filters: InsightFilters;
  onFilterChange: (filters: InsightFilters) => void;
  activeProfile: UserProfile;
  onProfileChange: (profile: UserProfile) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Opções para filtros
const alertLevelOptions: AlertLevel[] = ['low', 'moderate', 'high', 'critical'];
const categoryOptions = [
  'Acadêmico',
  'Comportamental',
  'Atendimento',
  'Administrativo',
  'Financeiro',
];
const impactAreaOptions = [
  'Desempenho',
  'Engajamento',
  'Frequência',
  'Comportamento',
  'Leitura',
  'Matemática',
  'Escrita',
  'Socioemocional',
  'Avaliação',
];
const profileOptions: UserProfile[] = [
  'teacher',
  'specialist',
  'coordinator',
  'principal',
  'administrator',
];

// Mapeamento de nomes para perfis
const profileNames: Record<UserProfile, string> = {
  teacher: 'Professor',
  specialist: 'Especialista',
  coordinator: 'Coordenador',
  principal: 'Diretor',
  administrator: 'Administrador',
};

/**
 * Componente para filtrar insights acionáveis.
 */
export const InsightFilterPanel: React.FC<InsightFilterPanelProps> = ({
  filters,
  onFilterChange,
  activeProfile,
  onProfileChange,
  className,
  style,
}) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [localFilters, setLocalFilters] = useState<InsightFilters>(filters);
  const [startDate, setStartDate] = useState<Date | null>(
    filters.dateRange?.[0] ? new Date(filters.dateRange[0]) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    filters.dateRange?.[1] ? new Date(filters.dateRange[1]) : null
  );

  // Sincroniza os filtros locais quando os filtros externos mudam
  useEffect(() => {
    setLocalFilters(filters);
    setStartDate(filters.dateRange?.[0] ? new Date(filters.dateRange[0]) : null);
    setEndDate(filters.dateRange?.[1] ? new Date(filters.dateRange[1]) : null);
  }, [filters]);

  // Manipula mudanças nos filtros de nível de alerta
  const handleAlertLevelChange = (event: SelectChangeEvent<AlertLevel[]>) => {
    const value = event.target.value as unknown as AlertLevel[];
    setLocalFilters({
      ...localFilters,
      alertLevel: value.length > 0 ? value : undefined,
    });
  };

  // Manipula mudanças nos filtros de categoria
  const handleCategoryChange = (event: React.SyntheticEvent, value: string[]) => {
    setLocalFilters({
      ...localFilters,
      categories: value.length > 0 ? value : undefined,
    });
  };

  // Manipula mudanças nos filtros de área de impacto
  const handleImpactAreaChange = (event: React.SyntheticEvent, value: string[]) => {
    setLocalFilters({
      ...localFilters,
      impactAreas: value.length > 0 ? value : undefined,
    });
  };

  // Manipula mudanças na data inicial
  const handleStartDateChange = (newDate: Date | null) => {
    setStartDate(newDate);

    const dateRange = newDate
      ? ([newDate.toISOString(), endDate ? endDate.toISOString() : new Date().toISOString()] as [
          string,
          string,
        ])
      : undefined;

    setLocalFilters({
      ...localFilters,
      dateRange,
    });
  };

  // Manipula mudanças na data final
  const handleEndDateChange = (newDate: Date | null) => {
    setEndDate(newDate);

    const dateRange = endDate
      ? ([
          startDate ? startDate.toISOString() : new Date(0).toISOString(),
          newDate ? newDate.toISOString() : new Date().toISOString(),
        ] as [string, string])
      : undefined;

    setLocalFilters({
      ...localFilters,
      dateRange,
    });
  };

  // Manipula mudanças no switch de mostrar resolvidos
  const handleShowResolvedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      showResolved: event.target.checked,
    });
  };

  // Manipula mudanças no switch de mostrar reconhecidos
  const handleShowAcknowledgedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters({
      ...localFilters,
      showAcknowledged: event.target.checked,
    });
  };

  // Manipula mudanças no slider de relevância
  const handleRelevanceChange = (event: Event, newValue: number | number[]) => {
    setLocalFilters({
      ...localFilters,
      relevanceThreshold: newValue as number,
    });
  };

  // Manipula mudanças no perfil ativo
  const handleProfileChange = (event: SelectChangeEvent<UserProfile>) => {
    const newProfile = event.target.value as UserProfile;
    onProfileChange(newProfile);
  };

  // Aplica os filtros
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  // Reseta os filtros
  const handleResetFilters = () => {
    const defaultFilters: InsightFilters = {
      alertLevel: undefined,
      categories: undefined,
      impactAreas: undefined,
      dateRange: undefined,
      showResolved: false,
      showAcknowledged: true,
      relevanceThreshold: 0,
    };

    setLocalFilters(defaultFilters);
    setStartDate(null);
    setEndDate(null);
    onFilterChange(defaultFilters);
  };

  return (
    <Box className={className} style={style}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Filtros</Typography>
        </Box>

        <Box>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="profile-select-label">Perfil Ativo</InputLabel>
            <Select
              labelId="profile-select-label"
              id="profile-select"
              value={activeProfile}
              label="Perfil Ativo"
              onChange={handleProfileChange}
              size="small"
            >
              {profileOptions.map(profile => (
                <MenuItem key={profile} value={profile}>
                  {profileNames[profile]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title={expanded ? 'Menos filtros' : 'Mais filtros'}>
            <IconButton
              onClick={() => setExpanded(!expanded)}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Limpar filtros">
            <IconButton onClick={handleResetFilters} color="error" size="small">
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="alert-level-label">Nível de Alerta</InputLabel>
            <Select
              labelId="alert-level-label"
              id="alert-level"
              multiple
              value={localFilters.alertLevel || []}
              onChange={handleAlertLevelChange}
              label="Nível de Alerta"
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as AlertLevel[]).map(value => (
                    <Chip
                      key={value}
                      label={
                        value === 'low'
                          ? 'Baixo'
                          : value === 'moderate'
                            ? 'Moderado'
                            : value === 'high'
                              ? 'Alto'
                              : 'Crítico'
                      }
                      size="small"
                    />
                  ))}
                </Box>
              )}
            >
              {alertLevelOptions.map(level => (
                <MenuItem key={level} value={level}>
                  {level === 'low'
                    ? 'Baixo'
                    : level === 'moderate'
                      ? 'Moderado'
                      : level === 'high'
                        ? 'Alto'
                        : 'Crítico'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Autocomplete
            multiple
            id="categories"
            options={categoryOptions}
            value={localFilters.categories || []}
            onChange={handleCategoryChange}
            renderInput={params => (
              <TextField {...params} variant="outlined" label="Categorias" size="small" />
            )}
            size="small"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={localFilters.showResolved || false}
                onChange={handleShowResolvedChange}
                color="primary"
              />
            }
            label="Mostrar Resolvidos"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={localFilters.showAcknowledged || false}
                onChange={handleShowAcknowledgedChange}
                color="primary"
              />
            }
            label="Mostrar Reconhecidos"
          />
        </Grid>

        {expanded && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                multiple
                id="impact-areas"
                options={impactAreaOptions}
                value={localFilters.impactAreas || []}
                onChange={handleImpactAreaChange}
                renderInput={params => (
                  <TextField {...params} variant="outlined" label="Áreas de Impacto" size="small" />
                )}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                <DatePicker
                  label="Data Inicial"
                  value={startDate}
                  onChange={handleStartDateChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
                <DatePicker
                  label="Data Final"
                  value={endDate}
                  onChange={handleEndDateChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Typography id="relevance-slider" gutterBottom>
                Relevância Mínima: {localFilters.relevanceThreshold}%
              </Typography>
              <Slider
                aria-labelledby="relevance-slider"
                value={localFilters.relevanceThreshold || 0}
                onChange={handleRelevanceChange}
                valueLabelDisplay="auto"
                valueLabelFormat={value => `${value}%`}
                step={5}
                marks
                min={0}
                max={100}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={handleApplyFilters} size="small">
            Aplicar Filtros
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
