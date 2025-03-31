import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';

export const Container = styled(Card)`
  width: 100%;
`;

export const FormBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const HeaderBox = styled(Box)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

export const FormRow = styled(Box)`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    flex-direction: row;
  }

  gap: ${({ theme }) => theme.spacing(2)};
`;

export const TagsContainer = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

export const ActionButtons = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: flex-end;
`;
