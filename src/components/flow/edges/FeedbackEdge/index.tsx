import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { EdgeContainer, EdgePath, EdgeLabel } from './styles';

export const FeedbackEdge: React.FC<EdgeProps> = ({
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
    curvature: 0.5,
  });

  return (
    <EdgeContainer>
      <defs>
        <marker
          id={`feedback-${id}`}
          markerWidth="12"
          markerHeight="12"
          refX="6"
          refY="6"
          orient="auto"
        >
          <path d="M2,2 L10,6 L2,10" fill="none" stroke="#DC2626" strokeWidth="1" />
        </marker>
      </defs>
      <EdgePath
        id={id}
        path={edgePath}
        markerEnd={`url(#feedback-${id})`}
        style={{
          ...style,
          stroke: '#DC2626',
          strokeDasharray: '5,5',
        }}
      />
      {data?.label && <EdgeLabel>{data.label}</EdgeLabel>}
    </EdgeContainer>
  );
};
