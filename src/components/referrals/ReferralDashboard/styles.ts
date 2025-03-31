import { styled } from '@mui/system';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const Container = styled(Box)`
  width: 100%;
`;

export const MetricCard = styled(Card)`
  height: 100%;
`;

export const MetricTitle = styled(Typography)`
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const MetricValue = styled(Typography)`
  font-size: 2rem;
  font-weight: 500;
`;

export const MetricLabel = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const DistributionItem = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

export const DistributionLabel = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

export const RecentReferralsCard = styled(Card)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;
