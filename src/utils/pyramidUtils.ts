import { PyramidDimensions, PyramidLevelDimensions, RTILevel } from '@/types/rti';

export const calculatePyramidDimensions = (
  containerWidth: number,
  containerHeight: number
): PyramidDimensions => {
  const padding = {
    top: 40,
    right: 40,
    bottom: 60,
    left: 60,
  };

  const width = containerWidth;
  const height = containerHeight;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  return {
    width,
    height,
    padding,
    innerWidth,
    innerHeight,
  };
};

export const calculateLevelDimensions = (
  level: RTILevel,
  index: number,
  totalLevels: number,
  dimensions: PyramidDimensions
): PyramidLevelDimensions => {
  const { innerWidth, innerHeight, padding } = dimensions;
  const levelHeight = innerHeight / totalLevels;
  const levelWidth = innerWidth * (level.percentage / 100);

  const x = padding.left;
  const y = padding.top + index * levelHeight;
  const width = levelWidth;
  const height = levelHeight - 4; // Espaço entre níveis

  const labelX = x + 10;
  const labelY = y + height / 2;
  const percentageX = x + width - 10;
  const percentageY = y + height / 2;
  const studentsX = x + width / 2;
  const studentsY = y + height + 20;

  return {
    x,
    y,
    width,
    height,
    labelX,
    labelY,
    percentageX,
    percentageY,
    studentsX,
    studentsY,
  };
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatStudents = (value: number): string => {
  return `${value} alunos`;
};

export const getLevelColor = (level: RTILevel): string => {
  return level.color;
};

export const getLevelOpacity = (isHovered: boolean): number => {
  return isHovered ? 1 : 0.8;
};
