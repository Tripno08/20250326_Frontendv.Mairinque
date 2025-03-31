import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export const Container = styled(Card)`
  width: 100%;
`;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const InfoSection = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const DetailItem = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const Label = styled(Typography)`
  font-weight: 500;
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const CommentSection = styled(Box)`
  margin-top: ${({ theme }) => theme.spacing(4)};
`;

export const CommentForm = styled(Box)`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

export const Comment = styled(Box)`
  padding: ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;
  background-color: ${({ theme }) => theme.palette.grey[50]};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const CommentHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

export const CommentAuthor = styled(Typography)`
  font-weight: 500;
`;

export const CommentDate = styled(Typography)`
  color: ${({ theme }) => theme.palette.text.secondary};
`;

export const StatusChips = styled(Stack)`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;
