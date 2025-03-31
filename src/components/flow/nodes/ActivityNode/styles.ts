import styled from '@emotion/styled';

interface ContainerProps {
  selected?: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 250px;
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
  background-color: ${({ theme }) => theme.palette.primary.light};
`;

export const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.h6.fontSize};
  font-weight: ${({ theme }) => theme.typography.h6.fontWeight};
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;

export const Content = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
`;

export const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

export const FieldValue = styled.div`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
`;
