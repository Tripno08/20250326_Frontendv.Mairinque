import { useEffect, useRef, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Box, Paper, Typography, IconButton, Tooltip as MuiTooltip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { ProgressMonitoringChartProps } from '@/types/progress';
import {
  calculateChartDimensions,
  calculateTrendLine,
  calculateProjection,
  formatDate,
  formatValue,
  getInterventionColor,
  getBenchmarkColor,
  getGoalColor,
} from '@/utils/progressUtils';

interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    left: number;
    bottom: number;
  }
}

export const ProgressMonitoringChart: React.FC<ProgressMonitoringChartProps> = ({
  data,
  benchmarks,
  goals,
  onInterventionClick,
  className,
  width: propWidth = 800,
  height: propHeight = 600,
  dateRange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<ChartDimensions>(() => ({
    width: propWidth,
    height: propHeight,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  }));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRange);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth || propWidth;
        const containerHeight = containerRef.current.clientHeight || propHeight;
        setDimensions({
          width: Math.max(containerWidth, 300),
          height: Math.max(containerHeight, 300),
          margin: { top: 20, right: 30, left: 20, bottom: 20 }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [propWidth, propHeight]);

  const trendLine = calculateTrendLine(data);
  const projections = goals.map((goal) =>
    calculateProjection(data, goal.deadline)
  );

  const filteredData = selectedDateRange
    ? data.filter(
        (point) =>
          point.date >= selectedDateRange.start &&
          point.date <= selectedDateRange.end
      )
    : data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2">
            {formatDate(new Date(label))}
          </Typography>
          <Typography variant="body2">
            Valor: {formatValue(dataPoint.value)}
          </Typography>
          {dataPoint.intervention && (
            <Typography
              variant="body2"
              sx={{
                color: getInterventionColor(dataPoint.intervention),
                cursor: 'pointer',
              }}
              onClick={() => onInterventionClick?.(dataPoint.intervention)}
            >
              Intervenção: {dataPoint.intervention}
            </Typography>
          )}
          {dataPoint.notes && (
            <Typography variant="body2" color="text.secondary">
              Notas: {dataPoint.notes}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        position: 'relative',
        width: `${propWidth}px`,
        height: `${propHeight}px`,
        minWidth: '300px',
        minHeight: '300px',
      }}
      role="img"
      aria-label="gráfico de progresso"
    >
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          display: 'flex',
          gap: 1,
        }}
      >
        <MuiTooltip title="Aumentar Zoom">
          <IconButton
            size="small"
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
            aria-label="Aumentar Zoom"
          >
            <ZoomInIcon />
          </IconButton>
        </MuiTooltip>
        <MuiTooltip title="Diminuir Zoom">
          <IconButton
            size="small"
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}
            aria-label="Diminuir Zoom"
          >
            <ZoomOutIcon />
          </IconButton>
        </MuiTooltip>
        <MuiTooltip title="Resetar Zoom">
          <IconButton
            size="small"
            onClick={() => setZoomLevel(1)}
            aria-label="Resetar Zoom"
          >
            <RefreshIcon />
          </IconButton>
        </MuiTooltip>
      </Box>

      <LineChart
        width={dimensions.width}
        height={dimensions.height}
        data={filteredData}
        margin={dimensions.margin}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => formatDate(new Date(date))}
          domain={['dataMin', 'dataMax']}
        />
        <YAxis
          tickFormatter={formatValue}
          domain={['dataMin', 'dataMax']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {/* Linha de Progresso */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#1976d2"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Progresso"
        />

        {/* Linha de Tendência */}
        <Line
          type="monotone"
          dataKey={(data: any) =>
            trendLine.slope * data.index + trendLine.intercept
          }
          stroke="#757575"
          strokeDasharray="5 5"
          name="Tendência"
        />

        {/* Benchmarks */}
        {benchmarks.map((benchmark) => (
          <ReferenceLine
            key={benchmark.name}
            y={Number(benchmark.value)}
            stroke={getBenchmarkColor(benchmark.name)}
            strokeDasharray="3 3"
            label={{
              value: benchmark.name,
              position: 'right',
              fill: getBenchmarkColor(benchmark.name),
            }}
          />
        ))}

        {/* Metas */}
        {goals.map((goal) => (
          <ReferenceLine
            key={goal.name}
            y={Number(goal.targetValue)}
            stroke={getGoalColor(goal.name)}
            strokeDasharray="3 3"
            label={{
              value: goal.name,
              position: 'right',
              fill: getGoalColor(goal.name),
            }}
          />
        ))}

        {/* Projeções */}
        {projections.map((projection, index) => (
          <ReferenceLine
            key={`projection-${index}`}
            x={projection.deadline.toISOString()}
            y={Number(projection.targetValue)}
            stroke="#9C27B0"
            strokeDasharray="3 3"
            label={{
              value: `Projeção (${(projection.confidence * 100).toFixed(0)}% confiança)`,
              position: 'right',
              fill: '#9C27B0',
            }}
          />
        ))}
      </LineChart>
    </Box>
  );
};
