import styled from '@emotion/styled';

export const EdgeContainer = styled.g`
  &:focus {
    outline: none;
  }
`;

export const EdgePath = styled.path`
  fill: none;
  stroke: ${({ theme }) => theme.palette.primary.main};
  stroke-width: 2;
  transition: stroke 0.2s ease;

  &:hover {
    stroke: ${({ theme }) => theme.palette.primary.dark};
  }
`;

export const EdgeLabel = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: ${({ theme }) => theme.spacing(0.5, 1)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.palette.primary.main};
  transform: translate(-50%, -50%);
  pointer-events: none;
  white-space: nowrap;
  box-shadow: ${({ theme }) => theme.shadows[1]};
`;
