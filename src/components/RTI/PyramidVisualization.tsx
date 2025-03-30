import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { PyramidVisualizationProps, RTILevel } from '@/types/rti';
import {
  calculatePyramidDimensions,
  calculateLevelDimensions,
  formatPercentage,
  formatStudents,
  getLevelColor,
  getLevelOpacity,
} from '@/utils/pyramidUtils';

export const PyramidVisualization: React.FC<PyramidVisualizationProps> = ({
  data,
  onLevelClick,
  className,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLevel, setHoveredLevel] = useState<RTILevel | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<RTILevel | null>(null);
  const [dimensions, setDimensions] = useState(() =>
    calculatePyramidDimensions(width, height)
  );

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const containerWidth = svgRef.current.parentElement?.clientWidth || width;
        const containerHeight = svgRef.current.parentElement?.clientHeight || height;
        setDimensions(calculatePyramidDimensions(containerWidth, containerHeight));
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  useEffect(() => {
    if (!svgRef.current || !data.levels.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height, padding } = dimensions;

    // Criação do grupo principal
    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${padding.left},${padding.top})`);

    // Renderização dos níveis
    data.levels.forEach((level, index) => {
      const levelDimensions = calculateLevelDimensions(
        level,
        index,
        data.levels.length,
        dimensions
      );

      const levelGroup = g
        .append('g')
        .attr('class', `level-${level.id}`)
        .style('cursor', 'pointer')
        .on('click', () => {
          setSelectedLevel(level);
          onLevelClick?.(level);
        })
        .on('mouseenter', () => setHoveredLevel(level))
        .on('mouseleave', () => setHoveredLevel(null));

      // Retângulo do nível
      levelGroup
        .append('rect')
        .attr('x', levelDimensions.x)
        .attr('y', levelDimensions.y)
        .attr('width', levelDimensions.width)
        .attr('height', levelDimensions.height)
        .attr('fill', getLevelColor(level))
        .attr('opacity', getLevelOpacity(hoveredLevel?.id === level.id))
        .attr('rx', 4)
        .attr('ry', 4);

      // Nome do nível
      levelGroup
        .append('text')
        .attr('x', levelDimensions.labelX)
        .attr('y', levelDimensions.labelY)
        .attr('dy', '0.35em')
        .attr('fill', '#fff')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(level.name);

      // Porcentagem
      levelGroup
        .append('text')
        .attr('x', levelDimensions.percentageX)
        .attr('y', levelDimensions.percentageY)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .attr('fill', '#fff')
        .attr('font-size', '14px')
        .text(formatPercentage(level.percentage));

      // Número de alunos
      levelGroup
        .append('text')
        .attr('x', levelDimensions.studentsX)
        .attr('y', levelDimensions.studentsY)
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .attr('font-size', '12px')
        .text(formatStudents(level.students));
    });
  }, [data, dimensions, hoveredLevel, onLevelClick]);

  return (
    <Box className={className} sx={{ position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      <AnimatePresence>
        {selectedLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
            }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                maxWidth: 400,
                width: '100%',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {selectedLevel.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedLevel.description}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Intervenções:
              </Typography>
              <List dense>
                {selectedLevel.interventions.map((intervention, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={intervention} />
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedLevel(null)}
              >
                ✕
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}; 