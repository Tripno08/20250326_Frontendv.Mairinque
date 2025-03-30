import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import {
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CalendarMonth as CalendarMonthIcon,
  Sync as SyncIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { TeamMetrics, TeamPerformanceDashboardProps, CaseStatus, InterventionTier } from '@/types/team';
import { teamService } from '@/services/teamService';
import { format, subMonths, parseISO } from 'date-fns';

/**
 * Dashboard de métricas de desempenho da equipe
 */
export const TeamPerformanceDashboard: React.FC<TeamPerformanceDashboardProps> = ({
  className,
  style,
  teamId,
  metrics: propMetrics,
  width = 1000,
  height = 700,
  dateRange: propDateRange,
  onDateRangeChange
}) => {
  const theme = useTheme();

  // Estado para armazenar métricas e status de carregamento
  const [metrics, setMetrics] = useState<TeamMetrics | null>(propMetrics || null);
  const [isLoading, setIsLoading] = useState<boolean>(!propMetrics);
  const [error, setError] = useState<Error | null>(null);

  // Estado para controle de datas
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: propDateRange ? parseISO(propDateRange.start) : subMonths(new Date(), 3),
    end: propDateRange ? parseISO(propDateRange.end) : new Date()
  });

  // Carregar métricas se não forem fornecidas como prop
  useEffect(() => {
    if (propMetrics) {
      setMetrics(propMetrics);
      return;
    }

    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await teamService.getTeamMetrics(teamId);
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar métricas'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [teamId, propMetrics]);

  // Manipulador de mudança de intervalo de datas
  const handleDateRangeChange = (type: 'start' | 'end', newDate: Date | null) => {
    if (!newDate) return;

    const newDateRange = {
      ...dateRange,
      [type]: newDate
    };

    setDateRange(newDateRange);

    if (onDateRangeChange) {
      onDateRangeChange({
        start: format(newDateRange.start, 'yyyy-MM-dd'),
        end: format(newDateRange.end, 'yyyy-MM-dd')
      });
    }
  };

  // Cores para tiers
  const TIER_COLORS = {
    [InterventionTier.TIER1]: '#4CAF50', // Verde para Tier 1
    [InterventionTier.TIER2]: '#FFC107', // Amarelo para Tier 2
    [InterventionTier.TIER3]: '#F44336'  // Vermelho para Tier 3
  };

  // Cores para status de caso
  const STATUS_COLORS: Record<CaseStatus, string> = {
    [CaseStatus.OPEN]: theme.palette.info.main,
    [CaseStatus.ASSIGNED]: theme.palette.warning.light,
    [CaseStatus.IN_PROGRESS]: theme.palette.warning.main,
    [CaseStatus.UNDER_REVIEW]: theme.palette.info.dark,
    [CaseStatus.COMPLETED]: theme.palette.success.main,
    [CaseStatus.CLOSED]: theme.palette.success.dark
  };

  // Preparar dados para gráfico de distribuição por status
  const statusDistributionData = metrics
    ? Object.entries(metrics.casesByStatus).map(([status, count]) => ({
        name: status.replace('_', ' ').toLowerCase(),
        value: count,
        color: STATUS_COLORS[status as CaseStatus]
      }))
    : [];

  // Preparar dados para gráfico de distribuição por tier
  const tierDistributionData = metrics
    ? Object.entries(metrics.casesByTier).map(([tier, count]) => ({
        name: `Tier ${tier}`,
        value: count,
        color: TIER_COLORS[parseInt(tier) as InterventionTier]
      }))
    : [];

  // Preparar dados para gráfico de desempenho de membros
  const memberPerformanceData = metrics?.memberPerformance || [];

  // Renderizar métrica principal em um card
  const renderMetricCard = (
    title: string,
    value: number | string,
    subtitle: string,
    icon: React.ReactNode,
    color: string = theme.palette.primary.main
  ) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2, color }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1, color }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5, maxWidth: 250 }}>
          <Typography variant="subtitle2">{label || payload[0].name}</Typography>
          <Box sx={{ mt: 1 }}>
            {payload.map((entry: any, index: number) => (
              <Box key={`tooltip-${index}`} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: entry.color || entry.fill,
                    mr: 1
                  }}
                />
                <Typography variant="body2" component="span">
                  {entry.name}:
                </Typography>
                <Typography variant="body2" component="span" fontWeight="bold" sx={{ ml: 0.5 }}>
                  {entry.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      );
    }
    return null;
  };

  // Renderização principal do componente
  return (
    <Box
      sx={{
        width: width,
        ...(style || {})
      }}
      className={className}
    >
      {/* Cabeçalho com título e seletor de datas */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Dashboard de Desempenho da Equipe
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Data Inicial"
                value={dateRange.start}
                onChange={(newDate) => handleDateRangeChange('start', newDate)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="Data Final"
                value={dateRange.end}
                onChange={(newDate) => handleDateRangeChange('end', newDate)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.message}
        </Alert>
      ) : metrics ? (
        <>
          {/* Cards de métricas principais */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              {renderMetricCard(
                'Total de Casos',
                metrics.totalCases.toString(),
                'Casos gerenciados pela equipe',
                <AssignmentIcon fontSize="large" />,
                theme.palette.primary.main
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {renderMetricCard(
                'Tempo Médio de Resolução',
                `${metrics.averageResolutionTime.toFixed(1)} dias`,
                'Tempo médio para solução de casos',
                <ScheduleIcon fontSize="large" />,
                theme.palette.warning.main
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {renderMetricCard(
                'Reuniões Mensais',
                metrics.meetingsPerMonth.toString(),
                'Média de reuniões por mês',
                <CalendarMonthIcon fontSize="large" />,
                theme.palette.info.main
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              {renderMetricCard(
                'Eficácia de Intervenções',
                `${metrics.interventionEffectiveness}%`,
                'Taxa de sucesso das intervenções',
                <CheckCircleIcon fontSize="large" />,
                theme.palette.success.main
              )}
            </Grid>
          </Grid>

          {/* Gráficos */}
          <Grid container spacing={3}>
            {/* Distribuição por Status */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Distribuição por Status
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Distribuição por Tier */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Distribuição por Tier
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tierDistributionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="value" name="Casos" fill="#8884d8">
                        {tierDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Desempenho de Membros */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Desempenho de Membros da Equipe
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={memberPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="memberId" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="casesAssigned" name="Casos Atribuídos" fill={theme.palette.primary.main} />
                      <Bar dataKey="casesCompleted" name="Casos Concluídos" fill={theme.palette.success.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Estatísticas Adicionais */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" align="right">
              Dashboard atualizado em: {format(new Date(), 'dd/MM/yyyy HH:mm')}
            </Typography>
          </Box>
        </>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Sem dados disponíveis para o período selecionado.
        </Alert>
      )}
    </Box>
  );
};
