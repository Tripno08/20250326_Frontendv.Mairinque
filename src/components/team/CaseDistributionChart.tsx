import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
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
  Label
} from 'recharts';
import {
  TeamMember,
  TeamCase,
  CaseDistributionChartProps,
  InterventionTier
} from '@/types/team';
import { useCaseAssignments } from '@/hooks/useTeam';

/**
 * Componente que exibe a distribuição de casos entre os membros da equipe
 */
export const CaseDistributionChart: React.FC<CaseDistributionChartProps> = ({
  className,
  style,
  teamId,
  members = [],
  cases = [],
  width = 800,
  height = 500,
  showLegend = true,
  title = 'Distribuição de Casos'
}) => {
  const theme = useTheme();

  // Usar os dados de atribuições de casos
  const { assignments, caseloadByMember, isLoading } = useCaseAssignments(teamId);

  // Cores para os diferentes tiers
  const TIER_COLORS = {
    1: '#4CAF50', // Verde para Tier 1
    2: '#FFC107', // Amarelo para Tier 2
    3: '#F44336'  // Vermelho para Tier 3
  };

  // Calcular dados para o gráfico de barras de distribuição de casos
  const barChartData = useMemo(() => {
    if (!members.length || !cases.length) return [];

    return members.map(member => {
      // Encontrar casos atribuídos a este membro
      const memberCases = cases.filter(c => c.assignedTo?.includes(member.id) || false);

      // Contar casos por tier
      const tier1Count = memberCases.filter(c => c.tier === InterventionTier.TIER1).length;
      const tier2Count = memberCases.filter(c => c.tier === InterventionTier.TIER2).length;
      const tier3Count = memberCases.filter(c => c.tier === InterventionTier.TIER3).length;

      return {
        name: member.name,
        tier1: tier1Count,
        tier2: tier2Count,
        tier3: tier3Count,
        total: memberCases.length
      };
    }).sort((a, b) => b.total - a.total); // Ordenar por total de casos (decrescente)
  }, [members, cases]);

  // Calcular distribuição total por tier
  const tierDistributionData = useMemo(() => {
    if (!cases.length) return [];

    const tier1Count = cases.filter(c => c.tier === InterventionTier.TIER1).length;
    const tier2Count = cases.filter(c => c.tier === InterventionTier.TIER2).length;
    const tier3Count = cases.filter(c => c.tier === InterventionTier.TIER3).length;

    return [
      { name: 'Tier 1', value: tier1Count, color: TIER_COLORS[1] },
      { name: 'Tier 2', value: tier2Count, color: TIER_COLORS[2] },
      { name: 'Tier 3', value: tier3Count, color: TIER_COLORS[3] }
    ];
  }, [cases, TIER_COLORS]);

  // Componente de tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Calcular porcentagem para cada tier
      const total = payload.reduce((acc: number, entry: any) => acc + entry.value, 0);

      return (
        <Card sx={{ minWidth: 200, boxShadow: 3 }}>
          <CardHeader
            title={label}
            titleTypographyProps={{ variant: 'subtitle2' }}
            sx={{ pb: 1 }}
          />
          <Divider />
          <CardContent sx={{ pt: 1 }}>
            {payload.map((entry: any, index: number) => (
              <Box key={`tooltip-${index}`} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: entry.color,
                      mr: 1
                    }}
                  />
                  <Typography variant="body2">{entry.name}:</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  {entry.value} ({Math.round((entry.value / total) * 100)}%)
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" fontWeight="bold">Total:</Typography>
              <Typography variant="body2" fontWeight="bold">{total}</Typography>
            </Box>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  // Renderizar componente
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        width: width,
        height: height,
        ...style
      }}
      className={className}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}>
          <Typography>Carregando dados...</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 40px)' }}>
          {/* Gráfico de barras empilhadas */}
          <Box sx={{ flex: 3, width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Distribuição por Membro
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Número de Casos', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<CustomTooltip />} />
                {showLegend && (
                  <Legend
                    verticalAlign="top"
                    height={36}
                  />
                )}
                <Bar
                  dataKey="tier1"
                  name="Tier 1"
                  stackId="a"
                  fill={TIER_COLORS[1]}
                />
                <Bar
                  dataKey="tier2"
                  name="Tier 2"
                  stackId="a"
                  fill={TIER_COLORS[2]}
                />
                <Bar
                  dataKey="tier3"
                  name="Tier 3"
                  stackId="a"
                  fill={TIER_COLORS[3]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Divisor */}
          <Divider sx={{ my: 2 }} />

          {/* Gráfico de pizza para distribuição por tier */}
          <Box sx={{ flex: 2, width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>
              Distribuição por Tier
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={tierDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }: any) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {tierDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                {showLegend && <Legend verticalAlign="bottom" height={36} />}
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
