import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const Container = styled(Card)`
  width: 100%;
`;

export const TimelineContainer = styled(Box)`
  position: relative;
  padding-left: ${({ theme }) => theme.spacing(3)};

  &::before {
    content: '';
    position: absolute;
    left: ${({ theme }) => theme.spacing(1.5)};
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${({ theme }) => theme.palette.divider};
    transform: translateX(-50%);
  }
`;

export const TimelineItem = styled(Box)`
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing(3)};

  &:last-child {
    padding-bottom: 0;
  }

  &::before {
    content: '';
    position: absolute;
    left: -${({ theme }) => theme.spacing(1.5)};
    top: 4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.palette.primary.main};
    transform: translateX(-50%);
  }
`;

export const TimelineDate = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.75rem;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

export const TimelineContent = styled(Box)`
  background-color: ${({ theme }) => theme.palette.background.paper};
  padding: ${({ theme }) => theme.spacing(1, 1.5)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  box-shadow: ${({ theme }) => theme.shadows?.['1'] || '0px 2px 1px -1px rgba(0,0,0,0.2)'};
`;

export const TimelineAuthor = styled(Typography)`
  font-weight: 500;
  font-size: 0.875rem;
`;

export const TimelineDescription = styled(Typography)`
  font-size: 0.875rem;
`;
