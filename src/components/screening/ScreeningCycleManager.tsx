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
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { useScreeningCycle } from '../../hooks/useScreening';
import {
  ScreeningCycle,
  ScreeningCycleManagerProps,
  ScreeningTier,
  ScreeningFrequency
} from '../../types/screening';

const getTierColor = (tier: ScreeningTier) => {
  switch (tier) {
    case 'universal':
      return 'success';
    case 'selective':
      return 'warning';
    case 'intensive':
      return 'error';
    default:
      return 'default';
  }
};

const getTierLabel = (tier: ScreeningTier) => {
  switch (tier) {
    case 'universal':
      return 'Universal';
    case 'selective':
      return 'Seletivo';
    case 'intensive':
      return 'Intensivo';
    default:
      return tier;
  }
};

const getFrequencyLabel = (frequency: ScreeningFrequency) => {
  switch (frequency) {
    case 'weekly':
      return 'Semanal';
    case 'biweekly':
      return 'Quinzenal';
    case 'monthly':
      return 'Mensal';
    case 'quarterly':
      return 'Trimestral';
    default:
      return frequency;
  }
};

export const ScreeningCycleManager: React.FC<ScreeningCycleManagerProps> = ({
  onCycleCreate,
  onCycleUpdate
}) => {
  const [selectedCycle, setSelectedCycle] = useState<ScreeningCycle | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ScreeningCycle>>({
    name: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    frequency: 'monthly',
    tier: 'universal',
    instruments: [],
    status: 'pending'
  });

  const handleCreateCycle = () => {
    onCycleCreate(formData as Omit<ScreeningCycle, 'id' | 'createdAt' | 'updatedAt'>);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      frequency: 'monthly',
      tier: 'universal',
      instruments: [],
      status: 'pending'
    });
  };

  const handleUpdateCycle = () => {
    if (!selectedCycle) return;
    onCycleUpdate(selectedCycle.id, formData);
    setIsEditDialogOpen(false);
    setSelectedCycle(null);
    setFormData({
      name: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      frequency: 'monthly',
      tier: 'universal',
      instruments: [],
      status: 'pending'
    });
  };

  const handleEditClick = (cycle: ScreeningCycle) => {
    setSelectedCycle(cycle);
    setFormData(cycle);
    setIsEditDialogOpen(true);
  };

  const renderCycleCard = (cycle: ScreeningCycle) => (
    <Card key={cycle.id}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2">
            {cycle.name}
          </Typography>
          <Box>
            <Tooltip title="Editar">
              <IconButton onClick={() => handleEditClick(cycle)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip
            icon={<CalendarIcon />}
            label={getFrequencyLabel(cycle.frequency)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<AssessmentIcon />}
            label={getTierLabel(cycle.tier)}
            size="small"
            color={getTierColor(cycle.tier)}
            variant="outlined"
          />
          <Chip
            icon={<NotificationsIcon />}
            label={cycle.status}
            size="small"
            color={cycle.status === 'completed' ? 'success' : 'default'}
            variant="outlined"
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Início: {new Date(cycle.startDate).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fim: {new Date(cycle.endDate).toLocaleDateString()}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Instrumentos: {cycle.instruments.length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderCreateDialog = () => (
    <Dialog
      open={isCreateDialogOpen}
      onClose={() => setIsCreateDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Criar Novo Ciclo</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Data de Início"
            type="date"
            value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Data de Fim"
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Frequência</InputLabel>
            <Select
              value={formData.frequency}
              label="Frequência"
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as ScreeningFrequency }))}
            >
              <MenuItem value="weekly">Semanal</MenuItem>
              <MenuItem value="biweekly">Quinzenal</MenuItem>
              <MenuItem value="monthly">Mensal</MenuItem>
              <MenuItem value="quarterly">Trimestral</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Tier</InputLabel>
            <Select
              value={formData.tier}
              label="Tier"
              onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value as ScreeningTier }))}
            >
              <MenuItem value="universal">Universal</MenuItem>
              <MenuItem value="selective">Seletivo</MenuItem>
              <MenuItem value="intensive">Intensivo</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleCreateCycle} variant="contained">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditDialog = () => (
    <Dialog
      open={isEditDialogOpen}
      onClose={() => setIsEditDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Editar Ciclo</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Data de Início"
            type="date"
            value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Data de Fim"
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Frequência</InputLabel>
            <Select
              value={formData.frequency}
              label="Frequência"
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as ScreeningFrequency }))}
            >
              <MenuItem value="weekly">Semanal</MenuItem>
              <MenuItem value="biweekly">Quinzenal</MenuItem>
              <MenuItem value="monthly">Mensal</MenuItem>
              <MenuItem value="quarterly">Trimestral</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Tier</InputLabel>
            <Select
              value={formData.tier}
              label="Tier"
              onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value as ScreeningTier }))}
            >
              <MenuItem value="universal">Universal</MenuItem>
              <MenuItem value="selective">Seletivo</MenuItem>
              <MenuItem value="intensive">Intensivo</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleUpdateCycle} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Ciclos de Rastreio
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Novo Ciclo
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* TODO: Implementar lista de ciclos */}
      </Grid>

      {renderCreateDialog()}
      {renderEditDialog()}
    </Box>
  );
};
