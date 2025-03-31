import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { EdgeContainer, EdgePath, EdgeLabel } from './styles';

export const ParallelEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <EdgeContainer>
      <defs>
        <marker
          id={`parallel-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto"
        >
          <path
            d="M2,2 L10,6 L2,10 M6,2 L14,6 L6,10"
            fill="none"
            stroke="#10B981"
            strokeWidth="1"
          />
        </marker>
      </defs>
      <EdgePath
        id={id}
        path={edgePath}
        markerEnd={`url(#parallel-${id})`}
        style={{
          ...style,
          stroke: '#10B981',
        }}
      />
      {data?.label && <EdgeLabel>{data.label}</EdgeLabel>}
    </EdgeContainer>
  );
};
