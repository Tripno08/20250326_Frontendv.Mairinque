import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip
} from '@mui/material';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';

interface InstrumentScreeningHistoryTableProps {
  instrumentId: string;
}

type Order = 'asc' | 'desc';
type OrderBy = keyof ScreeningAdministration;

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'in_progress':
      return 'info';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendente';
    case 'in_progress':
      return 'Em Andamento';
    case 'completed':
      return 'Concluído';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};

export const InstrumentScreeningHistoryTable: React.FC<InstrumentScreeningHistoryTableProps> = ({
  instrumentId
}) => {
  const [filters, setFilters] = useState<{
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderBy>('startDate');

  const { administrations, loading, error } = useScreeningAdministrations({
    instrumentId,
    ...filters
  });

  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data: ScreeningAdministration[]) => {
    return data.sort((a, b) => {
      if (orderBy === 'startDate' || orderBy === 'endDate') {
        const aValue = a[orderBy] ? new Date(a[orderBy]).getTime() : 0;
        const bValue = b[orderBy] ? new Date(b[orderBy]).getTime() : 0;
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  const sortedData = sortData([...administrations]);
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Administrações
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="in_progress">Em Andamento</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Data Inicial"
            type="date"
            value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Data Final"
            type="date"
            value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'studentId'}
                  direction={orderBy === 'studentId' ? order : 'asc'}
                  onClick={() => handleRequestSort('studentId')}
                >
                  Estudante
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'administratorId'}
                  direction={orderBy === 'administratorId' ? order : 'asc'}
                  onClick={() => handleRequestSort('administratorId')}
                >
                  Administrador
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'startDate'}
                  direction={orderBy === 'startDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('startDate')}
                >
                  Data de Início
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'endDate'}
                  direction={orderBy === 'endDate' ? order : 'asc'}
                  onClick={() => handleRequestSort('endDate')}
                >
                  Data de Término
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleRequestSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>Respostas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((administration) => (
              <TableRow key={administration.id}>
                <TableCell>{administration.studentId}</TableCell>
                <TableCell>{administration.administratorId}</TableCell>
                <TableCell>
                  {new Date(administration.startDate).toLocaleString()}
                </TableCell>
                <TableCell>
                  {administration.endDate
                    ? new Date(administration.endDate).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(administration.status)}
                    color={getStatusColor(administration.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {administration.responses.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={administrations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};
