import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  useTheme,
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
  PolarRadiusAxis,
} from 'recharts';
import {
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  CalendarMonth as CalendarMonthIcon,
  Sync as SyncIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { CaseStatus, InterventionTier, TeamPerformanceDashboardProps } from '@/types/team';
import { TeamMetrics } from '@/types/team-dashboard';
import { teamService } from '@/services/teamService';
import { format, subMonths, parseISO } from 'date-fns';

// Mapeamento para cores do status de casos
const statusColors: Record<string, string> = {
  [CaseStatus.OPEN]: '#2196f3', // azul
  [CaseStatus.ASSIGNED]: '#9c27b0', // roxo
  [CaseStatus.IN_PROGRESS]: '#ff9800', // laranja
  [CaseStatus.UNDER_REVIEW]: '#1976d2', // azul escuro
  [CaseStatus.COMPLETED]: '#4caf50', // verde
  [CaseStatus.CLOSED]: '#9e9e9e', // cinza
};

// Mapeamento para cores das intervenções por tier
const tierColors: Record<number, string> = {
  [InterventionTier.TIER1]: '#4caf50', // verde
  [InterventionTier.TIER2]: '#ff9800', // laranja
  [InterventionTier.TIER3]: '#f44336', // vermelho
};

export const TeamPerformanceDashboard: React.FC<TeamPerformanceDashboardProps> = ({
  teamId,
  width = '100%',
  height,
  className,
  style,
}) => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: subMonths(new Date(), 3),
    end: new Date(),
  });

  // Busca dados da equipe quando o componente é carregado ou quando o filtro de datas é alterado
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teamService.getTeamMetrics(teamId, {
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString(),
        });
        setMetrics(data as unknown as TeamMetrics);
      } catch (err) {
        setError('Falha ao carregar métricas da equipe. Por favor, tente novamente.');
        console.error('Error fetching team metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, dateRange.start, dateRange.end]);

  // Manipula a alteração das datas no filtro
  const handleDateRangeChange = (field: 'start' | 'end', value: Date | null) => {
    if (value) {
      setDateRange(prev => ({ ...prev, [field]: value }));
    }
  };

  // Gera dados para o gráfico de status de casos
  const getCaseStatusChartData = () => {
    if (!metrics) return [];

    return Object.entries(metrics.casesByStatus || {}).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  };

  // Gera dados para o gráfico de distribuição de intervenções por tier
  const getTierDistributionChartData = () => {
    if (!metrics) return [];

    return Object.entries(metrics.casesByTier || {}).map(([tier, count]) => ({
      name: tier,
      value: count,
    }));
  };

  // Gera dados para o gráfico de progresso ao longo do tempo
  const getProgressChartData = () => {
    if (!metrics || !metrics.progressOverTime) return [];

    return (metrics.progressOverTime || []).map((point: { date: string; value: number }) => ({
      date: format(parseISO(point.date), 'dd/MM'),
      valor: point.value,
    }));
  };

  // Gera dados para o gráfico de radar de habilidades da equipe
  const getTeamSkillsRadarData = () => {
    if (!metrics || !metrics.teamSkillsDistribution) return [];

    return Object.entries(metrics.teamSkillsDistribution || {}).map(([skill, value]) => ({
      skill,
      value,
      fullMark: 100,
    }));
  };

  // Se estiver carregando, exibe o indicador de progresso
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: height || 400,
          width,
          ...(style || {}),
        }}
        className={className}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se houver erro, exibe a mensagem de erro
  if (error) {
    return (
      <Box
        sx={{
          width,
          ...(style || {}),
        }}
        className={className}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Se não houver dados, exibe mensagem adequada
  if (!metrics) {
    return (
      <Box
        sx={{
          width,
          ...(style || {}),
        }}
        className={className}
      >
        <Alert severity="info">Nenhum dado disponível para o período selecionado.</Alert>
      </Box>
    );
  }

  // Renderização principal do componente
  return (
    <Box
      sx={{
        width: width,
        ...(style || {}),
      }}
      className={className}
    >
      {/* Cabeçalho com título e seletor de datas */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2">
            Dashboard de Desempenho da Equipe
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <DatePicker
                label="Data Inicial"
                value={dateRange.start}
                onChange={newDate => handleDateRangeChange('start', newDate)}
                slotProps={{ textField: { size: 'small' } }}
              />
              <DatePicker
                label="Data Final"
                value={dateRange.end}
                onChange={newDate => handleDateRangeChange('end', newDate)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
          </LocalizationProvider>
        </Box>
      </Paper>

      {/* Cards de estatísticas */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon sx={{ mr: 1, color: '#3f51b5' }} />
                <Typography variant="h6">Membros</Typography>
              </Box>
              <Typography variant="h4">{metrics.teamSize || 0}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total de membros ativos
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentIcon sx={{ mr: 1, color: '#ff9800' }} />
                <Typography variant="h6">Casos</Typography>
              </Box>
              <Typography variant="h4">{metrics.totalCases}</Typography>
              <Typography variant="body2" color="text.secondary">
                Casos atribuídos à equipe
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="h6">Resolvidos</Typography>
              </Box>
              <Typography variant="h4">
                {Math.round(((metrics.resolvedCases || 0) / metrics.totalCases) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taxa de resolução de casos
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: '240px' }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SyncIcon sx={{ mr: 1, color: '#2196f3' }} />
                <Typography variant="h6">Progresso</Typography>
              </Box>
              <Typography variant="h4">{metrics.averageProgress || 0}%</Typography>
              <Typography variant="body2" color="text.secondary">
                Progresso médio dos casos
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Gráficos */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title="Status dos Casos" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getCaseStatusChartData()}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getCaseStatusChartData().map((entry, index) => {
                      // Conversão segura do status
                      const status = entry.name;
                      return (
                        <Cell key={`cell-${index}`} fill={statusColors[status] || '#000000'} />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: '300px' }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardHeader title="Distribuição por Tier" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getTierDistributionChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Quantidade">
                    {getTierDistributionChartData().map((entry, index) => {
                      // Conversão segura do tier
                      const tier = Number(entry.name);
                      return <Cell key={`cell-${index}`} fill={tierColors[tier] || '#000000'} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 100%' }}>
          <Card variant="outlined">
            <CardHeader title="Progresso ao Longo do Tempo" />
            <Divider />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getProgressChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    name="Progresso (%)"
                    stroke="#2196f3"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
