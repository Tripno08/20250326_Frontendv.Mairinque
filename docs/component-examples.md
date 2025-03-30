# Exemplos de Componentes - Innerview

Este documento apresenta exemplos de implementação dos principais componentes do projeto Innerview, servindo como referência para o desenvolvimento de novos componentes.

## Componentes de Visualização de Dados

### StudentProgressChart

Este componente exibe o progresso de um estudante ao longo do tempo, com suporte para metas, benchmarks e marcadores de intervenção.

```tsx
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Box, Typography, Chip, useTheme, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { motion } from 'framer-motion';

interface ProgressDataPoint {
  date: string;
  score: number;
  goal?: number;
  nationalAvg?: number;
}

interface StudentProgressChartProps {
  /** Dados de progresso ao longo do tempo */
  data: ProgressDataPoint[];
  /** Título do gráfico */
  title: string;
  /** Nome da métrica sendo medida (ex: "Palavras por minuto") */
  metric: string;
  /** Valores de referência como meta e limite de risco */
  benchmarks?: {
    targetScore: number;
    riskThreshold: number;
  };
  /** Lista de intervenções aplicadas */
  interventions?: Array<{
    date: string;
    description: string;
  }>;
}

export const StudentProgressChart = ({
  data,
  title,
  metric,
  benchmarks,
  interventions = [],
}: StudentProgressChartProps) => {
  const theme = useTheme();
  const [chartView, setChartView] = useState<'all' | '3months' | '6months'>('all');
  const [filteredData, setFilteredData] = useState(data);
  
  useEffect(() => {
    if (chartView === 'all') {
      setFilteredData(data);
      return;
    }
    
    const months = chartView === '3months' ? 3 : 6;
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - months);
    
    const filtered = data.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
    
    setFilteredData(filtered);
  }, [chartView, data]);
  
  const handleChartViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'all' | '3months' | '6months',
  ) => {
    if (newView !== null) {
      setChartView(newView);
    }
  };
  
  // Calcula se a tendência é de melhoria
  const isImproving = filteredData.length >= 2 && 
    filteredData[filteredData.length - 1].score > filteredData[0].score;
  
  // Calcula a taxa de crescimento
  const calculateGrowthRate = () => {
    if (filteredData.length < 2) return 0;
    
    const firstScore = filteredData[0].score;
    const lastScore = filteredData[filteredData.length - 1].score;
    const percentChange = ((lastScore - firstScore) / firstScore) * 100;
    
    return Math.round(percentChange * 10) / 10; // Arredonda para 1 casa decimal
  };
  
  const growthRate = calculateGrowthRate();
  
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
      }}>
        <Box>
          <Typography variant="h6" gutterBottom>{title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={isImproving ? 'Em Progresso' : 'Precisa de Atenção'} 
              color={isImproving ? 'success' : 'warning'}
              size="small"
            />
            <Typography variant="body2">
              {growthRate > 0 ? '+' : ''}{growthRate}% {chartView === 'all' ? 'total' : `nos últimos ${chartView === '3months' ? '3' : '6'} meses`}
            </Typography>
          </Box>
        </Box>
        
        <ToggleButtonGroup
          value={chartView}
          exclusive
          onChange={handleChartViewChange}
          size="small"
        >
          <ToggleButton value="3months">3 Meses</ToggleButton>
          <ToggleButton value="6months">6 Meses</ToggleButton>
          <ToggleButton value="all">Todos</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
              />
              <YAxis 
                tick={{ fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                label={{ 
                  value: metric,
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: theme.palette.text.secondary }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              
              {/* Linha principal de progresso */}
              <Line
                type="monotone"
                dataKey="score"
                name="Pontuação"
                stroke={theme.palette.primary.main}
                strokeWidth={3}
                dot={{ 
                  fill: theme.palette.primary.main, 
                  r: 6,
                  strokeWidth: 2,
                  stroke: theme.palette.background.paper
                }}
                activeDot={{ r: 8 }}
              />
              
              {/* Linha de meta se existir */}
              {filteredData.some(d => d.goal) && (
                <Line
                  type="monotone"
                  dataKey="goal"
                  name="Meta"
                  stroke={theme.palette.success.main}
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              
              {/* Linha de média nacional se existir */}
              {filteredData.some(d => d.nationalAvg) && (
                <Line
                  type="monotone"
                  dataKey="nationalAvg"
                  name="Média Nacional"
                  stroke={theme.palette.info.main}
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              
              {/* Benchmarks */}
              {benchmarks?.targetScore && (
                <ReferenceLine 
                  y={benchmarks.targetScore} 
                  label="Meta" 
                  stroke={theme.palette.success.main}
                  strokeDasharray="3 3"
                />
              )}
              
              {benchmarks?.riskThreshold && (
                <ReferenceLine 
                  y={benchmarks.riskThreshold} 
                  label="Risco" 
                  stroke={theme.palette.error.main}
                  strokeDasharray="3 3"
                />
              )}
              
              {/* Marcadores de intervenção */}
              {interventions.map((intervention, index) => (
                <ReferenceLine 
                  key={index}
                  x={intervention.date}
                  stroke={theme.palette.secondary.main}
                  label={{ 
                    value: "I",
                    position: 'top',
                    fill: theme.palette.secondary.main
                  }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </Box>
      
      {/* Legenda de intervenções */}
      {interventions.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Intervenções:</Typography>
          {interventions.map((intervention, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                mb: 0.5,
                gap: 1,
              }}
            >
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  bgcolor: theme.palette.secondary.main,
                  mt: 0.5
                }} 
              />
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {intervention.date}
                </Typography>
                <Typography variant="body2">
                  {intervention.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
```

### PyramidVisualization

Este componente visualiza a distribuição de estudantes nos três níveis do RTI/MTSS utilizando D3.js.

```tsx
import { useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface PyramidData {
  level: string;
  students: number;
  description: string;
  color: string;
}

interface PyramidVisualizationProps {
  /** Dados dos níveis da pirâmide */
  data: PyramidData[];
  /** Altura da visualização */
  height?: number;
  /** Largura da visualização */
  width?: number;
}

export const PyramidVisualization = ({
  data,
  height = 400,
  width = 600,
}: PyramidVisualizationProps) => {
  const theme = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || !data.length) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    
    const margin = { top: 20, right: 20, bottom: 30, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // Calcula as alturas para cada nível da pirâmide
    const levelHeight = innerHeight / data.length;
    
    // Função para calcular a largura de cada nível
    const getWidth = (index: number) => {
      const maxWidth = innerWidth * 0.8;
      const minWidth = innerWidth * 0.3;
      const step = (maxWidth - minWidth) / (data.length - 1);
      return maxWidth - index * step;
    };
    
    // Desenha a pirâmide
    data.forEach((level, index) => {
      const levelWidth = getWidth(index);
      const x = (innerWidth - levelWidth) / 2;
      const y = index * levelHeight;
      
      // Desenha o retângulo para o nível
      g.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', levelWidth)
        .attr('height', levelHeight - 5) // espaço entre níveis
        .attr('fill', level.color)
        .attr('stroke', theme.palette.background.paper)
        .attr('stroke-width', 2)
        .attr('rx', 4) // cantos arredondados
        .attr('ry', 4);
      
      // Adiciona o texto do nível
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', y + levelHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', theme.palette.getContrastText(level.color))
        .attr('font-weight', 'bold')
        .text(level.level);
      
      // Adiciona o número de estudantes
      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', y + levelHeight / 2 + 20)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', theme.palette.getContrastText(level.color))
        .text(`${level.students} alunos`);
    });
    
  }, [data, height, width, theme]);
  
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h6" gutterBottom>
        Modelo RTI/MTSS - Distribuição de Estudantes
      </Typography>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', height }}
      >
        <svg ref={svgRef} width="100%" height={height} />
      </motion.div>
      <Box sx={{ 
        mt: 2, 
        display: 'flex', 
        justifyContent: 'space-around', 
        width: '100%',
      }}>
        {data.map((level) => (
          <Box 
            key={level.level}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                borderRadius: '50%', 
                bgcolor: level.color 
              }} 
            />
            <Typography variant="body2">
              {level.level}: {level.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
```

## Componentes UI Estendidos

### GradientCard

Este componente estende o Card do Material UI com gradientes e efeitos visuais avançados.

```tsx
import { Card, CardProps, styled } from '@mui/material';

interface GradientCardProps extends CardProps {
  /** Direção do gradiente */
  gradientDirection?: string;
  /** Cor inicial do gradiente */
  gradientFrom?: string;
  /** Cor final do gradiente */
  gradientTo?: string;
}

const GradientCard = styled(Card, {
  shouldForwardProp: (prop) => 
    prop !== 'gradientDirection' && 
    prop !== 'gradientFrom' && 
    prop !== 'gradientTo',
})<GradientCardProps>(({ 
  gradientDirection = '145deg', 
  gradientFrom = '#3f51b5', 
  gradientTo = '#536dfe',
  theme 
}) => ({
  background: `linear-gradient(${gradientDirection}, ${gradientFrom} 30%, ${gradientTo} 90%)`,
  color: theme.palette.getContrastText(gradientFrom),
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
  },
}));

export default GradientCard;
```

### ActionButton

Um botão com efeitos avançados de interação e feedback visual.

```tsx
import { Button, ButtonProps, Tooltip, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ActionButtonProps extends ButtonProps {
  /** Texto do tooltip ao passar o mouse */
  tooltipText?: string;
  /** Ícone a ser exibido no início do botão */
  icon?: ReactNode;
}

// Estender o Button do MUI com funcionalidades avançadas
const StyledButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    transformOrigin: 'center',
    transform: 'scale(0)',
    borderRadius: '50%',
    transition: 'transform 0.5s ease-out',
  },
  '&:hover::after': {
    transform: 'scale(2.5)',
  },
}));

// Componente botão envolvido com Framer Motion para animações
const MotionButton = motion(StyledButton);

export const ActionButton = ({ 
  tooltipText, 
  icon, 
  children, 
  ...props 
}: ActionButtonProps) => {
  const buttonContent = (
    <MotionButton
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -3 }}
      startIcon={icon}
      {...props}
    >
      {children}
    </MotionButton>
  );

  if (tooltipText) {
    return (
      <Tooltip title={tooltipText} arrow placement="top">
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
};
```

## Componentes de Drag and Drop

### DraggableItem

Componente base para itens arrastáveis.

```tsx
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { Paper, PaperProps, Typography, Box, useTheme } from '@mui/material';

interface DraggableItemProps extends PaperProps {
  /** Identificador único do item */
  id: string;
  /** Posição na lista ordenável */
  index: number;
  /** Tipo do item para o sistema DnD */
  type: string;
  /** Função chamada ao mover o item */
  onMove: (dragIndex: number, hoverIndex: number) => void;
  /** Título opcional do item */
  title?: string;
  /** Conteúdo de pré-visualização */
  preview?: React.ReactNode;
}

export const DraggableItem = ({ 
  id, 
  index, 
  type, 
  onMove, 
  title, 
  preview, 
  children, 
  ...props 
}: DraggableItemProps) => {
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => ({ id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [{ handlerId }, drop] = useDrop({
    accept: type,
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: any, monitor) => {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) {
        return;
      }
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      onMove(dragIndex, hoverIndex);
      
      item.index = hoverIndex;
    },
  });
  
  drag(drop(ref));
  
  return (
    <motion.div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      initial={{ scale: 1 }}
      whileDrag={{ scale: 1.05, boxShadow: theme.shadows[10] }}
      data-handler-id={handlerId}
    >
      <Paper
        {...props}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          cursor: 'grab',
          transition: 'all 0.2s ease',
          borderLeft: isDragging ? `4px solid ${theme.palette.primary.main}` : 'none',
          ...props.sx,
        }}
      >
        {title && (
          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            {title}
          </Typography>
        )}
        {preview && (
          <Box 
            sx={{ 
              mb: 2, 
              p: 1, 
              borderRadius: 1, 
              bgcolor: theme.palette.action.hover 
            }}
          >
            {preview}
          </Box>
        )}
        {children}
      </Paper>
    </motion.div>
  );
};
```

## Serviços e Hooks

### useStudents

Hook para buscar e gerenciar dados de estudantes.

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStudents, fetchStudent, createStudent, updateStudent, deleteStudent } from '@/services/studentsService';
import type { Student, StudentCreateInput, StudentUpdateInput } from '@/types/student';

interface UseStudentsOptions {
  schoolId?: string;
  classId?: string;
  includeInactive?: boolean;
}

export const useStudents = (options: UseStudentsOptions = {}) => {
  const queryClient = useQueryClient();
  
  // Listar estudantes
  const {
    data: students,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['students', options],
    queryFn: () => fetchStudents(options),
  });
  
  // Buscar um estudante por ID
  const useStudent = (id: string) => {
    return useQuery({
      queryKey: ['student', id],
      queryFn: () => fetchStudent(id),
      enabled: !!id,
    });
  };
  
  // Criar um estudante
  const createStudentMutation = useMutation({
    mutationFn: (data: StudentCreateInput) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
    },
  });
  
  // Excluir um estudante
  const deleteStudentMutation = useMutation({
    mutationFn: (id: string) => deleteStudent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.removeQueries({ queryKey: ['student', id] });
    },
  });
  
  return {
    students,
    isLoading,
    isError,
    error,
    refetch,
    useStudent,
    createStudent: createStudentMutation.mutate,
    isCreating: createStudentMutation.isPending,
    updateStudent: updateStudentMutation.mutate,
    isUpdating: updateStudentMutation.isPending,
    deleteStudent: deleteStudentMutation.mutate,
    isDeleting: deleteStudentMutation.isPending,
  };
};
```

### useInterventions

Hook para gerenciar intervenções.

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchInterventions, 
  fetchIntervention, 
  createIntervention, 
  updateIntervention, 
  deleteIntervention,
  fetchInterventionTemplates
} from '@/services/interventionsService';
import type { 
  Intervention, 
  InterventionCreateInput, 
  InterventionUpdateInput,
  InterventionTemplate 
} from '@/types/intervention';

interface UseInterventionsOptions {
  studentId?: string;
  status?: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  tier?: 1 | 2 | 3;
}

export const useInterventions = (options: UseInterventionsOptions = {}) => {
  const queryClient = useQueryClient();
  
  // Listar intervenções
  const {
    data: interventions,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['interventions', options],
    queryFn: () => fetchInterventions(options),
    enabled: !!(options.studentId || options.status || options.tier),
  });
  
  // Buscar uma intervenção por ID
  const useIntervention = (id: string) => {
    return useQuery({
      queryKey: ['intervention', id],
      queryFn: () => fetchIntervention(id),
      enabled: !!id,
    });
  };
  
  // Buscar templates de intervenção
  const useInterventionTemplates = (tier?: 1 | 2 | 3, domain?: string) => {
    return useQuery({
      queryKey: ['interventionTemplates', { tier, domain }],
      queryFn: () => fetchInterventionTemplates({ tier, domain }),
    });
  };
  
  // Criar uma intervenção
  const createInterventionMutation = useMutation({
    mutationFn: (data: InterventionCreateInput) => createIntervention(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      // Se a intervenção está associada a um estudante, invalida também as queries do estudante
      if (data.estudanteId) {
        queryClient.invalidateQueries({ queryKey: ['student', data.estudanteId] });
      }
    },
  });
  
  // Atualizar uma intervenção
  const updateInterventionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InterventionUpdateInput }) => 
      updateIntervention(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      queryClient.invalidateQueries({ queryKey: ['intervention', variables.id] });
    },
  });
  
  // Excluir uma intervenção
  const deleteInterventionMutation = useMutation({
    mutationFn: (id: string) => deleteIntervention(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      queryClient.removeQueries({ queryKey: ['intervention', id] });
    },
  });
  
  return {
    interventions,
    isLoading,
    isError,
    error,
    refetch,
    useIntervention,
    useInterventionTemplates,
    createIntervention: createInterventionMutation.mutate,
    isCreating: createInterventionMutation.isPending,
    updateIntervention: updateInterventionMutation.mutate,
    isUpdating: updateInterventionMutation.isPending,
    deleteIntervention: deleteInterventionMutation.mutate,
    isDeleting: deleteInterventionMutation.isPending,
  };
};
```

## Exemplos de Serviços

### studentsService.ts

```tsx
import type { Student, StudentCreateInput, StudentUpdateInput } from '@/types/student';
import { handleApiResponse } from '@/utils/apiUtils';

interface FetchStudentsOptions {
  schoolId?: string;
  classId?: string;
  includeInactive?: boolean;
}

// Buscar lista de estudantes
export const fetchStudents = async (options: FetchStudentsOptions = {}): Promise<Student[]> => {
  const params = new URLSearchParams();
  
  if (options.schoolId) {
    params.append('instituicaoId', options.schoolId);
  }
  
  if (options.classId) {
    params.append('turmaId', options.classId);
  }
  
  if (options.includeInactive !== undefined) {
    params.append('includeInactive', options.includeInactive.toString());
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`/api/v1/students${queryString}`);
  
  return handleApiResponse(response);
};

// Buscar um estudante por ID
export const fetchStudent = async (id: string): Promise<Student> => {
  const response = await fetch(`/api/v1/students/${id}`);
  return handleApiResponse(response);
};

// Criar um estudante
export const createStudent = async (data: StudentCreateInput): Promise<Student> => {
  const response = await fetch('/api/v1/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleApiResponse(response);
};

// Atualizar um estudante
export const updateStudent = async (id: string, data: StudentUpdateInput): Promise<Student> => {
  const response = await fetch(`/api/v1/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleApiResponse(response);
};

// Excluir um estudante
export const deleteStudent = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/students/${id}`, {
    method: 'DELETE',
  });
  
  return handleApiResponse(response);
};
```

### interventionsService.ts

```tsx
import type { 
  Intervention, 
  InterventionCreateInput, 
  InterventionUpdateInput,
  InterventionTemplate 
} from '@/types/intervention';
import { handleApiResponse } from '@/utils/apiUtils';

interface FetchInterventionsOptions {
  studentId?: string;
  status?: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  tier?: 1 | 2 | 3;
}

interface FetchTemplatesOptions {
  tier?: 1 | 2 | 3;
  domain?: string;
}

// Buscar lista de intervenções
export const fetchInterventions = async (options: FetchInterventionsOptions = {}): Promise<Intervention[]> => {
  const params = new URLSearchParams();
  
  if (options.studentId) {
    params.append('estudanteId', options.studentId);
  }
  
  if (options.status) {
    params.append('status', options.status);
  }
  
  if (options.tier) {
    params.append('nivel', options.tier.toString());
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`/api/v1/interventions${queryString}`);
  
  return handleApiResponse(response);
};

// Buscar uma intervenção por ID
export const fetchIntervention = async (id: string): Promise<Intervention> => {
  const response = await fetch(`/api/v1/interventions/${id}`);
  return handleApiResponse(response);
};

// Buscar templates de intervenção
export const fetchInterventionTemplates = async (options: FetchTemplatesOptions = {}): Promise<InterventionTemplate[]> => {
  const params = new URLSearchParams();
  
  if (options.tier) {
    params.append('nivel', options.tier.toString());
  }
  
  if (options.domain) {
    params.append('area', options.domain);
  }
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(`/api/v1/interventions/templates${queryString}`);
  
  return handleApiResponse(response);
};

// Criar uma intervenção
export const createIntervention = async (data: InterventionCreateInput): Promise<Intervention> => {
  const response = await fetch('/api/v1/interventions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleApiResponse(response);
};

// Atualizar uma intervenção
export const updateIntervention = async (id: string, data: InterventionUpdateInput): Promise<Intervention> => {
  const response = await fetch(`/api/v1/interventions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  return handleApiResponse(response);
};

// Excluir uma intervenção
export const deleteIntervention = async (id: string): Promise<void> => {
  const response = await fetch(`/api/v1/interventions/${id}`, {
    method: 'DELETE',
  });
  
  return handleApiResponse(response);
};
```

## Exemplos de Tipo em TypeScript

### types/student.ts

```tsx
export interface Student {
  id: string;
  nome: string;
  serie: string;
  dataNascimento: string;
  instituicaoId: string | null;
  usuarioId: string;
  criadoEm: string;
  atualizadoEm: string;
  // Campos adicionais como relações podem ser incluídos quando necessário
}

export interface StudentCreateInput {
  nome: string;
  serie: string;
  dataNascimento: string;
  instituicaoId?: string;
  usuarioId: string;
}

export interface StudentUpdateInput {
  nome?: string;
  serie?: string;
  dataNascimento?: string;
  instituicaoId?: string | null;
}
```

### types/intervention.ts

```tsx
export interface Intervention {
  id: string;
  dataInicio: string;
  dataFim: string | null;
  tipo: string;
  descricao: string;
  status: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  observacoes: string | null;
  criadoEm: string;
  atualizadoEm: string;
  estudanteId: string;
  intervencaoBaseId: string | null;
  metas: InterventionGoal[];
  progressos: InterventionProgress[];
  sessoes: InterventionSession[];
}

export interface InterventionTemplate {
  id: string;
  nome: string;
  descricao: string;
  objetivo: string;
  nivel: 1 | 2 | 3;
  area: string;
  tempoEstimado: number;
  frequencia: string;
  materiaisNecessarios: string | null;
  evidenciaCientifica: string | null;
  fonteEvidencia: string | null;
  ativo: boolean;
  atividades: InterventionActivity[];
}

export interface InterventionActivity {
  id: string;
  nome: string;
  descricao: string;
  duracao: number;
  materiais: string[];
  tipo: 'leitura' | 'grupo' | 'avaliacao' | 'pratica' | 'outro';
}

export interface InterventionGoal {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  dataInicio: string;
  dataFim: string;
  status: string;
}

export interface InterventionProgress {
  id: string;
  data: string;
  pontuacao: number;
  observacoes: string;
  proximosPassos: string | null;
}

export interface InterventionSession {
  id: string;
  data: string;
  duracao: number;
  status: string;
  observacoes: string | null;
}

export interface InterventionCreateInput {
  dataInicio: string;
  dataFim?: string;
  tipo: string;
  descricao: string;
  status?: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  observacoes?: string;
  estudanteId: string;
  intervencaoBaseId?: string;
  metas?: {
    titulo: string;
    descricao: string;
    tipo: string;
    dataInicio: string;
    dataFim: string;
  }[];
}

export interface InterventionUpdateInput {
  dataInicio?: string;
  dataFim?: string | null;
  tipo?: string;
  descricao?: string;
  status?: 'ATIVO' | 'CONCLUIDO' | 'CANCELADO' | 'AGENDADO';
  observacoes?: string | null;
}
```
    },
  });
  
  // Atualizar um estudante
  const updateStudentMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: StudentUpdateInput }) => updateStudent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });