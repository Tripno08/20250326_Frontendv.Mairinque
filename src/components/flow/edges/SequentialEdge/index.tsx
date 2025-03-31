import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { EdgeContainer, EdgePath, EdgeLabel } from './styles';

export const SequentialEdge: React.FC<EdgeProps> = ({
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
      <EdgePath
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: '#3B82F6',
        }}
      />
      {data?.label && <EdgeLabel>{data.label}</EdgeLabel>}
    </EdgeContainer>
  );
};
