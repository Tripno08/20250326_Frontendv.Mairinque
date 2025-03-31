import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useScreeningAdministration, useScreeningAdministrations } from '../../hooks/useScreening';
import {
  ScreeningAdministration,
  ScreeningAdministrationManagerProps,
  ScreeningStatus,
} from '../../types/screening';
import { screeningService } from '../../services/screeningService';
import { Notification } from '../common/Notification';
import { ScreeningAdministrationDetails } from './ScreeningAdministrationDetails';

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

const getStatusIcon = (status: ScreeningStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon />;
    case 'in_progress':
      return <PendingIcon />;
    case 'cancelled':
      return <CancelIcon />;
    default:
      return null;
  }
};

export const ScreeningAdministrationManager: React.FC<ScreeningAdministrationManagerProps> = ({
  onAdministrationCreate,
  onAdministrationUpdate,
}) => {
  const theme = useTheme();
  const [selectedAdministration, setSelectedAdministration] =
    useState<ScreeningAdministration | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<{
    studentId?: string;
    administratorId?: string;
    status?: ScreeningAdministration['status'];
    startDate?: Date;
    endDate?: Date;
  }>({});
  const [formData, setFormData] = useState<Partial<ScreeningAdministration>>({
    instrumentId: '',
    studentId: '',
    administratorId: '',
    startDate: new Date(),
    endDate: null,
    status: 'pending',
    responses: [],
    notes: '',
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const {
    loading: loadingAdministration,
    error: errorAdministration,
    createAdministration,
    updateAdministration,
    deleteAdministration,
  } = useScreeningAdministration();
  const {
    administrations,
    loading: loadingList,
    error: errorList,
    refetch,
  } = useScreeningAdministrations(filters);

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

  const handleCreate = async () => {
    try {
      await createAdministration(
        formData as Omit<ScreeningAdministration, 'id' | 'createdAt' | 'updatedAt'>
      );
      onAdministrationCreate(
        formData as Omit<ScreeningAdministration, 'id' | 'createdAt' | 'updatedAt'>
      );
      setCreateDialogOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: 'Administração criada com sucesso',
        severity: 'success',
      });
    } catch (err) {
      console.error('Erro ao criar administração:', err);
      setNotification({
        open: true,
        message: 'Erro ao criar administração',
        severity: 'error',
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedAdministration) return;

    try {
      await updateAdministration(selectedAdministration.id, formData);
      onAdministrationUpdate(selectedAdministration.id, formData);
      setEditDialogOpen(false);
      resetForm();
      setNotification({
        open: true,
        message: 'Administração atualizada com sucesso',
        severity: 'success',
      });
    } catch (err) {
      console.error('Erro ao atualizar administração:', err);
      setNotification({
        open: true,
        message: 'Erro ao atualizar administração',
        severity: 'error',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      instrumentId: '',
      studentId: '',
      administratorId: '',
      startDate: new Date(),
      endDate: null,
      status: 'pending',
      responses: [],
      notes: '',
    });
  };

  const handleEditClick = (administration: ScreeningAdministration) => {
    setSelectedAdministration(administration);
    setFormData(administration);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta administração?')) {
      return;
    }

    try {
      await deleteAdministration(id);
      refetch();
      setNotification({
        open: true,
        message: 'Administração excluída com sucesso',
        severity: 'success',
      });
    } catch (err) {
      console.error('Erro ao excluir administração:', err);
      setNotification({
        open: true,
        message: 'Erro ao excluir administração',
        severity: 'error',
      });
    }
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleViewDetails = (administration: ScreeningAdministration) => {
    setSelectedAdministration(administration);
    setDetailsDialogOpen(true);
  };

  const renderAdministrationCard = (administration: ScreeningAdministration) => (
    <Card key={administration.id}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{administration.instrumentId}</Typography>
          <Box>
            <IconButton onClick={() => handleViewDetails(administration)}>
              <VisibilityIcon />
            </IconButton>
            <IconButton onClick={() => handleEditClick(administration)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(administration.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography color="textSecondary" gutterBottom>
          Estudante: {administration.studentId}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Administrador: {administration.administratorId}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          Início: {new Date(administration.startDate).toLocaleString()}
        </Typography>
        {administration.endDate && (
          <Typography color="textSecondary" gutterBottom>
            Término: {new Date(administration.endDate).toLocaleString()}
          </Typography>
        )}
        <Box sx={{ mt: 1 }}>
          <Chip
            label={getStatusLabel(administration.status)}
            color={getStatusColor(administration.status)}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );

  const renderAdministrationTable = (administrations: ScreeningAdministration[]) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Instrumento</TableCell>
            <TableCell>Estudante</TableCell>
            <TableCell>Administrador</TableCell>
            <TableCell>Início</TableCell>
            <TableCell>Término</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {administrations
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(administration => (
              <TableRow key={administration.id}>
                <TableCell>{administration.instrumentId}</TableCell>
                <TableCell>{administration.studentId}</TableCell>
                <TableCell>{administration.administratorId}</TableCell>
                <TableCell>{new Date(administration.startDate).toLocaleString()}</TableCell>
                <TableCell>
                  {administration.endDate ? new Date(administration.endDate).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip
                      label={getStatusLabel(administration.status)}
                      color={getStatusColor(administration.status)}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewDetails(administration)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEditClick(administration)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(administration.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={administrations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );

  const renderCreateDialog = () => (
    <Dialog
      open={createDialogOpen}
      onClose={() => setCreateDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Nova Administração</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="ID do Instrumento"
            value={formData.instrumentId}
            onChange={e => setFormData({ ...formData, instrumentId: e.target.value })}
            fullWidth
          />
          <TextField
            label="ID do Aluno"
            value={formData.studentId}
            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
            fullWidth
          />
          <TextField
            label="ID do Administrador"
            value={formData.administratorId}
            onChange={e => setFormData({ ...formData, administratorId: e.target.value })}
            fullWidth
          />
          <TextField
            label="Data de Início"
            type="datetime-local"
            value={
              formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''
            }
            onChange={e => setFormData({ ...formData, startDate: new Date(e.target.value) })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Notas"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCreateDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleCreate} variant="contained" color="primary">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditDialog = () => (
    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>Editar Administração</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="ID do Instrumento"
            value={formData.instrumentId}
            onChange={e => setFormData({ ...formData, instrumentId: e.target.value })}
            fullWidth
          />
          <TextField
            label="ID do Aluno"
            value={formData.studentId}
            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
            fullWidth
          />
          <TextField
            label="ID do Administrador"
            value={formData.administratorId}
            onChange={e => setFormData({ ...formData, administratorId: e.target.value })}
            fullWidth
          />
          <TextField
            label="Data de Início"
            type="datetime-local"
            value={
              formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''
            }
            onChange={e => setFormData({ ...formData, startDate: new Date(e.target.value) })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Data de Término"
            type="datetime-local"
            value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
            onChange={e => setFormData({ ...formData, endDate: new Date(e.target.value) })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Status"
            select
            value={formData.status}
            onChange={e =>
              setFormData({
                ...formData,
                status: e.target.value as ScreeningAdministration['status'],
              })
            }
            SelectProps={{ native: true }}
          >
            <option value="pending">Pendente</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </TextField>
          <TextField
            label="Notas"
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">
          Atualizar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Administrações de Rastreio</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Nova Administração
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="ID do Estudante"
            value={filters.studentId || ''}
            onChange={e => handleFilterChange('studentId', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="ID do Administrador"
            value={filters.administratorId || ''}
            onChange={e => handleFilterChange('administratorId', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status || ''}
              label="Status"
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="in_progress">Em Andamento</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
        </Grid>
      </Grid>

      {(loadingList || loadingAdministration) && <Typography>Carregando...</Typography>}
      {(errorList || errorAdministration) && (
        <Typography color="error">
          {errorList?.message || errorAdministration?.message || 'Erro ao carregar dados'}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {renderAdministrationTable(administrations)}
        </Grid>
      </Grid>

      {renderCreateDialog()}
      {renderEditDialog()}

      {selectedAdministration && (
        <ScreeningAdministrationDetails
          administration={selectedAdministration}
          open={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setSelectedAdministration(null);
          }}
        />
      )}

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleNotificationClose}
      />
    </Box>
  );
};
