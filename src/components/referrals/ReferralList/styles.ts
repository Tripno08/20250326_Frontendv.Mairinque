import { styled } from '@mui/system';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export const Container = styled(Card)`
  width: 100%;
  overflow: hidden;
`;

export const TableContainer = styled(Box)`
  overflow-x: auto;
`;

export const StatusCell = styled(TableCell)`
  min-width: 150px;
`;

export const ActionCell = styled(TableCell)`
  width: 80px;
  text-align: right;
`;

export const ReferralRow = styled(TableRow, {
  shouldForwardProp: prop => prop !== 'isPastDue',
})<{ isPastDue?: boolean }>`
  ${({ isPastDue, theme }) =>
    isPastDue &&
    `
    background-color: ${theme.palette.error.light};
    &:hover {
      background-color: ${theme.palette.error.main} !important;
    }
  `}
`;
