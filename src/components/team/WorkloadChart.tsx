import React, { useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  Tooltip as MuiTooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
  LabelList,
} from 'recharts';
import { TeamMember, WorkloadChartProps } from '@/types/team';
import { useCaseAssignments } from '@/hooks/useTeam';

/**
 * Componente que exibe a carga de trabalho dos membros da equipe
 */
export const WorkloadChart: React.FC<WorkloadChartProps> = ({
  className,
  style,
  teamId,
  members = [],
  width = 800,
  height = 500,
  showLegend = true,
  title = 'Carga de Trabalho da Equipe',
}) => {
  const theme = useTheme();
  const { caseloadByMember, isLoading, error } = useCaseAssignments(teamId);

  // Preparação dos dados para o gráfico
  const chartData = useMemo(() => {
    if (!members.length) return [];

    return members
      .map(member => {
        // Obter casos atribuídos a este membro
        const memberCaseload = caseloadByMember.find(c => c.memberId === member.id);
        const currentCaseload = memberCaseload?.caseCount || 0;
        const maxCaseload = member.maxCaseload || 10; // Padrão se não for definido

        // Calcular a porcentagem de utilização da capacidade
        const utilizationPercentage = Math.round((currentCaseload / maxCaseload) * 100);

        // Determinar status baseado na utilização
        let status = 'normal'; // 0-80%
        let color = theme.palette.success.main;

        if (utilizationPercentage > 95) {
          status = 'sobrecarregado'; // >95%
          color = theme.palette.error.main;
        } else if (utilizationPercentage > 80) {
          status = 'alto'; // 81-95%
          color = theme.palette.warning.main;
        }

        return {
          name: member.name,
          role: member.role,
          currentCaseload,
          maxCaseload,
          remainingCapacity: Math.max(0, maxCaseload - currentCaseload),
          utilizationPercentage,
          status,
          color,
        };
      })
      .sort((a, b) => b.utilizationPercentage - a.utilizationPercentage); // Ordenar por utilização (decrescente)
  }, [members, caseloadByMember, theme]);

  // Componente Tooltip personalizado
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <Paper sx={{ p: 1.5, maxWidth: 250 }}>
          <Typography variant="subtitle2">{data.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Papel: {data.role}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              <strong>Casos atuais:</strong> {data.currentCaseload}
            </Typography>
            <Typography variant="body2">
              <strong>Capacidade máxima:</strong> {data.maxCaseload}
            </Typography>
            <Typography variant="body2">
              <strong>Capacidade disponível:</strong> {data.remainingCapacity}
            </Typography>
            <Typography variant="body2" fontWeight="bold" color={data.color}>
              <strong>Utilização:</strong> {data.utilizationPercentage}%
            </Typography>
          </Box>
        </Paper>
      );
    }
    return null;
  };

  // Componente CustomLabel para mostrar a porcentagem de utilização
  const CustomizedLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const data = chartData[index];

    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill={data.color}
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
      >
        {data.utilizationPercentage}%
      </text>
    );
  };

  return (
    <Paper
      sx={{
        p: 3,
        width: width || '100%',
        height: height || 500,
      }}
      className={className}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {isLoading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao carregar dados: {error.message}
        </Alert>
      ) : chartData.length === 0 ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%' }}
        >
          <Typography color="text.secondary">Sem dados disponíveis para exibição</Typography>
        </Box>
      ) : (
        <Box sx={{ height: 'calc(100% - 40px)', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 30, right: 30, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                label={{
                  value: 'Número de Casos',
                  position: 'insideBottom',
                  offset: -15,
                }}
              />
              <YAxis type="category" dataKey="name" tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  payload={[
                    { value: 'Atual', type: 'square', color: theme.palette.primary.main },
                    { value: 'Capacidade Máxima', type: 'line', color: theme.palette.grey[500] },
                  ]}
                />
              )}

              {/* Barra principal para casos atuais */}
              <Bar
                dataKey="currentCaseload"
                name="Atual"
                fill={theme.palette.primary.main}
                barSize={30}
                label={<CustomizedLabel />}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>

              {/* Linhas de referência para capacidade máxima */}
              {chartData.map((entry, index) => (
                <ReferenceLine
                  key={`ref-${index}`}
                  y={entry.name}
                  x={entry.maxCaseload}
                  stroke={theme.palette.grey[500]}
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  ifOverflow="extendDomain"
                  label={{
                    position: 'right',
                    value: `Max: ${entry.maxCaseload}`,
                    fill: theme.palette.text.secondary,
                    fontSize: 12,
                  }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Legenda de cores */}
      {chartData.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2,
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.success.main,
                mr: 1,
              }}
            />
            <Typography variant="body2">Normal (0-80%)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.warning.main,
                mr: 1,
              }}
            />
            <Typography variant="body2">Alta (81-95%)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: theme.palette.error.main,
                mr: 1,
              }}
            />
            <Typography variant="body2">Sobrecarga ({'>'}95%)</Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
