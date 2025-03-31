import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { EdgeContainer, EdgePath, EdgeLabel } from './styles';

export const ConditionalEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
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
          id={`conditional-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L10,6 L2,10" fill="none" stroke="#3B82F6" strokeWidth="1" />
        </marker>
      </defs>
      <EdgePath
        id={id}
        path={edgePath}
        markerEnd={`url(#conditional-${id})`}
        style={{
          ...style,
          stroke: '#3B82F6',
        }}
      />
      {data?.label && <EdgeLabel>{data.label}</EdgeLabel>}
    </EdgeContainer>
  );
};
