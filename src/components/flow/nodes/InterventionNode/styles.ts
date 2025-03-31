import styled from '@emotion/styled';

interface ContainerProps {
  selected: boolean;
}

export const Container = styled.div<ContainerProps>`
  width: 250px;
  background: ${({ theme }) => theme.palette.background.paper};
  border: 2px solid
    ${({ theme, selected }) => (selected ? theme.palette.success.main : theme.palette.divider)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  box-shadow: ${({ theme }) => theme.shadows[1]};
  transition: all 0.2s ease;
`;

export const Header = styled.div`
  padding: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.palette.success.main};
  color: ${({ theme }) => theme.palette.success.contrastText};
  border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border-top-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
`;

export const Title = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
  font-size: ${({ theme }) => theme.typography.subtitle1.fontSize};
`;

export const Content = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
`;

export const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(1)};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FieldLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.caption.fontSize};
  color: ${({ theme }) => theme.palette.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

export const FieldValue = styled.div`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.palette.text.primary};
`;

export const Handles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;
