import styled from '@emotion/styled';

interface ContainerProps {
  selected?: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 200px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  border: 2px solid
    ${({ theme, selected }) => (selected ? theme.palette.primary.main : theme.palette.divider)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  box-shadow: ${({ theme }) => theme.shadows[1]};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows[3]};
  }
`;

export const Header = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const Content = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
`;
