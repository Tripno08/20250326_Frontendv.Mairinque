import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  Sector
} from 'recharts';
import { Box, Paper, Typography, Grid, useTheme, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { BarChartOutlined, PieChartOutlined } from '@mui/icons-material';
import { TierDistributionChartProps } from '@/types/visualization';

const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 5 };

// Componente para renderizar o rótulo personalizado do setor ativo no gráfico de pizza
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, count
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
        {`${count} alunos`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

export const TierDistributionChart: React.FC<TierDistributionChartProps> = ({
  data,
  onTierClick,
  showLegend = true,
  title = 'Distribuição por Níveis RTI/MTSS',
  className,
  style,
  width = 500,
  height = 400
}) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [chartType, setChartType] = React.useState<'bar' | 'pie'>('bar');

  // Formatação dos dados para o gráfico
  const chartData = data.tiers.map(tier => ({
    name: tier.name,
    count: tier.count,
    percentage: tier.percentage,
    color: tier.color
  }));

  // Manipuladores de eventos
  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleChartTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: 'bar' | 'pie' | null,
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleChartClick = (data: any) => {
    if (onTierClick && data && data.activePayload && data.activePayload[0]) {
      const tierName = data.activePayload[0].payload.name;
      const tier = chartData.find(t => t.name === tierName);
      if (tier) {
        const originalTier = data.tiers.find((t: any) => t.name === tierName);
        onTierClick(originalTier);
      }
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 1.5 }}>
          <Typography variant="subtitle2">{payload[0].payload.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {`${payload[0].value} alunos (${payload[0].payload.percentage.toFixed(1)}%)`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box
      component={Paper}
      elevation={2}
      sx={{
        p: 2,
        height: `${height}px`,
        width: `${width}px`,
        ...(style || {})
      }}
      className={className || undefined}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartTypeChange}
          size="small"
          aria-label="tipo de gráfico"
        >
          <ToggleButton value="bar" aria-label="gráfico de barras">
            <BarChartOutlined />
          </ToggleButton>
          <ToggleButton value="pie" aria-label="gráfico de pizza">
            <PieChartOutlined />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ width: '100%', height: 'calc(100% - 70px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart
              data={chartData}
              margin={CHART_MARGIN}
              onClick={handleChartClick}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value}`} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar
                dataKey="count"
                name="Estudantes"
                radius={[4, 4, 0, 0]}
                label={{ position: 'top', formatter: (value: number) => `${value}` }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart onClick={handleChartClick}>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="count"
                onMouseEnter={handlePieEnter}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {showLegend && <Legend />}
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
        Total: {data.totalStudents} estudantes
      </Typography>
    </Box>
  );
};
