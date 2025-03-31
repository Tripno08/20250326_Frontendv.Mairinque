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
    stroke: #2563eb;
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

export const Container = styled.g`
  pointer-events: none;
`;

export const Path = styled.path`
  stroke: ${({ theme }) => theme.palette.primary.main};
  stroke-width: 2;
  fill: none;
  stroke-dasharray: 5, 5;
`;

export const Button = styled.circle`
  fill: ${({ theme }) => theme.palette.primary.main};
  stroke: none;
  cursor: pointer;

  &:hover {
    fill: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export const Icon = styled.path`
  fill: white;
  stroke: none;
`;

export const Circle = styled.circle`
  fill: white;
  stroke: ${({ theme }) => theme.palette.primary.main};
  stroke-width: 1.5;
`;

export const Text = styled.text`
  fill: ${({ theme }) => theme.palette.text.primary};
  font-size: 12px;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;

export const Label = styled.text`
  fill: ${({ theme }) => theme.palette.text.primary};
  font-size: 10px;
  text-anchor: middle;
  dominant-baseline: middle;
  pointer-events: none;
`;
