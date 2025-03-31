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
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useScreeningRules } from '../../hooks/useScreening';
import {
  ScreeningRule,
  ScreeningRuleManagerProps,
  ScreeningTier,
  ScreeningArea,
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

const getAreaLabel = (area: ScreeningArea) => {
  switch (area) {
    case 'academic':
      return 'Acadêmico';
    case 'behavioral':
      return 'Comportamental';
    case 'social':
      return 'Social';
    case 'emotional':
      return 'Emocional';
    case 'physical':
      return 'Físico';
    default:
      return area;
  }
};

export const ScreeningRulesManager: React.FC<ScreeningRuleManagerProps> = ({
  onRuleCreate,
  onRuleUpdate,
}) => {
  const [selectedRule, setSelectedRule] = useState<ScreeningRule | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ScreeningRule>>({
    name: '',
    description: '',
    area: 'academic',
    tier: 'universal',
    conditions: [],
    actions: [],
    isActive: true,
  });

  const handleCreateRule = () => {
    onRuleCreate(formData as Omit<ScreeningRule, 'id' | 'createdAt' | 'updatedAt'>);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      area: 'academic',
      tier: 'universal',
      conditions: [],
      actions: [],
      isActive: true,
    });
  };

  const handleUpdateRule = () => {
    if (!selectedRule) return;
    onRuleUpdate(selectedRule.id, formData);
    setIsEditDialogOpen(false);
    setSelectedRule(null);
    setFormData({
      name: '',
      description: '',
      area: 'academic',
      tier: 'universal',
      conditions: [],
      actions: [],
      isActive: true,
    });
  };

  const handleEditClick = (rule: ScreeningRule) => {
    setSelectedRule(rule);
    setFormData(rule);
    setIsEditDialogOpen(true);
  };

  const renderRuleCard = (rule: ScreeningRule) => (
    <Card key={rule.id}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2">
            {rule.name}
          </Typography>
          <Box>
            <Tooltip title="Editar">
              <IconButton onClick={() => handleEditClick(rule)}>
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

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {rule.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip
            icon={<AssessmentIcon />}
            label={getAreaLabel(rule.area)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<WarningIcon />}
            label={getTierLabel(rule.tier)}
            size="small"
            color={getTierColor(rule.tier)}
            variant="outlined"
          />
          <Chip
            icon={<NotificationsIcon />}
            label={rule.isActive ? 'Ativo' : 'Inativo'}
            size="small"
            color={rule.isActive ? 'success' : 'default'}
            variant="outlined"
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Condições: {rule.conditions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ações: {rule.actions.length}
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
      <DialogTitle>Criar Nova Regra</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Área</InputLabel>
            <Select
              value={formData.area}
              label="Área"
              onChange={e =>
                setFormData(prev => ({ ...prev, area: e.target.value as ScreeningArea }))
              }
            >
              <MenuItem value="academic">Acadêmico</MenuItem>
              <MenuItem value="behavioral">Comportamental</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="emotional">Emocional</MenuItem>
              <MenuItem value="physical">Físico</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Tier</InputLabel>
            <Select
              value={formData.tier}
              label="Tier"
              onChange={e =>
                setFormData(prev => ({ ...prev, tier: e.target.value as ScreeningTier }))
              }
            >
              <MenuItem value="universal">Universal</MenuItem>
              <MenuItem value="selective">Seletivo</MenuItem>
              <MenuItem value="intensive">Intensivo</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            }
            label="Ativo"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleCreateRule} variant="contained">
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
      <DialogTitle>Editar Regra</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Área</InputLabel>
            <Select
              value={formData.area}
              label="Área"
              onChange={e =>
                setFormData(prev => ({ ...prev, area: e.target.value as ScreeningArea }))
              }
            >
              <MenuItem value="academic">Acadêmico</MenuItem>
              <MenuItem value="behavioral">Comportamental</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="emotional">Emocional</MenuItem>
              <MenuItem value="physical">Físico</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Tier</InputLabel>
            <Select
              value={formData.tier}
              label="Tier"
              onChange={e =>
                setFormData(prev => ({ ...prev, tier: e.target.value as ScreeningTier }))
              }
            >
              <MenuItem value="universal">Universal</MenuItem>
              <MenuItem value="selective">Seletivo</MenuItem>
              <MenuItem value="intensive">Intensivo</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            }
            label="Ativo"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleUpdateRule} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Regras de Rastreio</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Nova Regra
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* TODO: Implementar lista de regras */}
      </Grid>

      {renderCreateDialog()}
      {renderEditDialog()}
    </Box>
  );
};
