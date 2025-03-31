import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { useScreeningAdministrations } from '../../hooks/useScreening';
import { ScreeningAdministration } from '../../types/screening';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';
import MenuItemWrapper from '@/components/MenuItemWrapper';

interface AdministratorScreeningHistoryProps {
  administratorId: string;
}

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

export const AdministratorScreeningHistory: React.FC<AdministratorScreeningHistoryProps> = ({
  administratorId,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<{
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});

  const { administrations, loading, error } = useScreeningAdministrations({
    administratorId,
    ...filters,
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Histórico de Administrações
      </Typography>

      <GridContainer spacing={2} sx={{ mb: 3 }}>
        <GridItem xs={12} sm={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <MenuItemWrapper value="">Todos</MenuItemWrapper>
              <MenuItemWrapper value="pending">Pendente</MenuItemWrapper>
              <MenuItemWrapper value="in_progress">Em Andamento</MenuItemWrapper>
              <MenuItemWrapper value="completed">Concluído</MenuItemWrapper>
              <MenuItemWrapper value="cancelled">Cancelado</MenuItemWrapper>
            </Select>
          </FormControl>
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Data Inicial"
            type="date"
            value={filters.startDate ? new Date(filters.startDate).toISOString().split('T')[0] : ''}
            onChange={e =>
              handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)
            }
            InputLabelProps={{ shrink: true }}
          />
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            label="Data Final"
            type="date"
            value={filters.endDate ? new Date(filters.endDate).toISOString().split('T')[0] : ''}
            onChange={e =>
              handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)
            }
            InputLabelProps={{ shrink: true }}
          />
        </GridItem>
      </GridContainer>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instrumento</TableCell>
              <TableCell>Estudante</TableCell>
              <TableCell>Data de Início</TableCell>
              <TableCell>Data de Término</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Respostas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {administrations
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(administration => (
                <TableRow key={administration.id}>
                  <TableCell>{administration.instrumentId}</TableCell>
                  <TableCell>{administration.studentId}</TableCell>
                  <TableCell>{new Date(administration.startDate).toLocaleString()}</TableCell>
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
                  <TableCell>{administration.responses.length}</TableCell>
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
