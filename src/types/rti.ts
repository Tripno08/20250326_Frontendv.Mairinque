export interface RTILevel {
  id: string;
  name: string;
  description: string;
  color: string;
  percentage: number;
  students: number;
  interventions: string[];
}

export interface PyramidData {
  totalStudents: number;
  levels: RTILevel[];
}

export interface PyramidVisualizationProps {
  data: PyramidData;
  onLevelClick?: (level: RTILevel) => void;
  className?: string;
  width?: number;
  height?: number;
}

export interface PyramidDimensions {
  width: number;
  height: number;
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  innerWidth: number;
  innerHeight: number;
}

export interface PyramidLevelDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
  percentageX: number;
  percentageY: number;
  studentsX: number;
  studentsY: number;
} 