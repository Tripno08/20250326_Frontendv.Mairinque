import styled from '@emotion/styled';
import { BaseEdge } from 'reactflow';

export const EdgeContainer = styled.g`
  &:focus {
    outline: none;
  }
`;

export const EdgePath = styled(BaseEdge)`
  stroke-width: 2;
  fill: none;

  &:hover {
    stroke: #4b5563;
  }
`;

export const EdgeLabel = styled.div`
  position: absolute;
  background-color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;
