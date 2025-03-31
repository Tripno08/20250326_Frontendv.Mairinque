import React, { useState } from 'react';
import {
  Box,
  Typography,
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
  Grid,
  Card,
  CardContent,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import {
  ScreeningRuleCondition,
  ScreeningRuleAction,
  ScreeningRuleConditionType,
  ScreeningRuleActionType,
  ScreeningRuleActionTarget,
  ScreeningRuleOperator,
} from '../../types/screening';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';
import MenuItemWrapper from '@/components/MenuItemWrapper';

interface ScreeningRuleConditionsProps {
  conditions: ScreeningRuleCondition[];
  actions: ScreeningRuleAction[];
  onConditionsChange: (conditions: ScreeningRuleCondition[]) => void;
  onActionsChange: (actions: ScreeningRuleAction[]) => void;
}

const getConditionTypeLabel = (type: ScreeningRuleConditionType) => {
  switch (type) {
    case 'score':
      return 'Pontuação';
    case 'frequency':
      return 'Frequência';
    case 'attendance':
      return 'Presença';
    case 'behavior':
      return 'Comportamento';
    default:
      return type;
  }
};

const getOperatorLabel = (operator: ScreeningRuleOperator) => {
  switch (operator) {
    case 'equals':
      return 'Igual a';
    case 'notEquals':
      return 'Diferente de';
    case 'greaterThan':
      return 'Maior que';
    case 'lessThan':
      return 'Menor que';
    case 'greaterThanOrEqual':
      return 'Maior ou igual a';
    case 'lessThanOrEqual':
      return 'Menor ou igual a';
    case 'contains':
      return 'Contém';
    case 'notContains':
      return 'Não contém';
    default:
      return operator;
  }
};

const getActionTypeLabel = (type: ScreeningRuleActionType) => {
  switch (type) {
    case 'notification':
      return 'Notificação';
    case 'referral':
      return 'Encaminhamento';
    case 'intervention':
      return 'Intervenção';
    case 'assessment':
      return 'Avaliação';
    default:
      return type;
  }
};

const getActionTargetLabel = (target: ScreeningRuleActionTarget) => {
  switch (target) {
    case 'student':
      return 'Aluno';
    case 'teacher':
      return 'Professor';
    case 'parent':
      return 'Responsável';
    case 'counselor':
      return 'Orientador';
    case 'principal':
      return 'Diretor';
    default:
      return target;
  }
};

export const ScreeningRuleConditions: React.FC<ScreeningRuleConditionsProps> = ({
  conditions,
  actions,
  onConditionsChange,
  onActionsChange,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<ScreeningRuleCondition | null>(null);
  const [selectedAction, setSelectedAction] = useState<ScreeningRuleAction | null>(null);
  const [isConditionDialogOpen, setIsConditionDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [conditionFormData, setConditionFormData] = useState<Partial<ScreeningRuleCondition>>({
    type: 'score',
    operator: 'equals',
    value: '',
    instrumentId: '',
  });
  const [actionFormData, setActionFormData] = useState<Partial<ScreeningRuleAction>>({
    type: 'notification',
    target: 'student',
    message: '',
    data: {},
  });

  const handleCreateCondition = () => {
    const newCondition: ScreeningRuleCondition = {
      id: Math.random().toString(36).substr(2, 9),
      ...(conditionFormData as Omit<ScreeningRuleCondition, 'id'>),
    };
    onConditionsChange([...conditions, newCondition]);
    setIsConditionDialogOpen(false);
    setConditionFormData({
      type: 'score',
      operator: 'equals',
      value: '',
      instrumentId: '',
    });
  };

  const handleUpdateCondition = () => {
    if (!selectedCondition) return;
    const updatedConditions = conditions.map(condition =>
      condition.id === selectedCondition.id ? { ...condition, ...conditionFormData } : condition
    );
    onConditionsChange(updatedConditions);
    setIsConditionDialogOpen(false);
    setSelectedCondition(null);
    setConditionFormData({
      type: 'score',
      operator: 'equals',
      value: '',
      instrumentId: '',
    });
  };

  const handleDeleteCondition = (id: string) => {
    onConditionsChange(conditions.filter(condition => condition.id !== id));
  };

  const handleCreateAction = () => {
    const newAction: ScreeningRuleAction = {
      id: Math.random().toString(36).substr(2, 9),
      ...(actionFormData as Omit<ScreeningRuleAction, 'id'>),
    };
    onActionsChange([...actions, newAction]);
    setIsActionDialogOpen(false);
    setActionFormData({
      type: 'notification',
      target: 'student',
      message: '',
      data: {},
    });
  };

  const handleUpdateAction = () => {
    if (!selectedAction) return;
    const updatedActions = actions.map(action =>
      action.id === selectedAction.id ? { ...action, ...actionFormData } : action
    );
    onActionsChange(updatedActions);
    setIsActionDialogOpen(false);
    setSelectedAction(null);
    setActionFormData({
      type: 'notification',
      target: 'student',
      message: '',
      data: {},
    });
  };

  const handleDeleteAction = (id: string) => {
    onActionsChange(actions.filter(action => action.id !== id));
  };

  const renderConditionCard = (condition: ScreeningRuleCondition) => (
    <Card key={condition.id}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle1">{getConditionTypeLabel(condition.type)}</Typography>
          <Box>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setSelectedCondition(condition);
                  setConditionFormData(condition);
                  setIsConditionDialogOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton color="error" onClick={() => handleDeleteCondition(condition.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip
            icon={<AssessmentIcon />}
            label={getOperatorLabel(condition.operator)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<WarningIcon />}
            label={String(condition.value)}
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Stack>
      </CardContent>
    </Card>
  );

  const renderActionCard = (action: ScreeningRuleAction) => (
    <Card key={action.id}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle1">{getActionTypeLabel(action.type)}</Typography>
          <Box>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  setSelectedAction(action);
                  setActionFormData(action);
                  setIsActionDialogOpen(true);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Excluir">
              <IconButton color="error" onClick={() => handleDeleteAction(action.id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Chip
            icon={<NotificationsIcon />}
            label={getActionTargetLabel(action.target)}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {action.message}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderConditionDialog = () => (
    <Dialog
      open={isConditionDialogOpen}
      onClose={() => setIsConditionDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{selectedCondition ? 'Editar Condição' : 'Nova Condição'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={conditionFormData.type}
              label="Tipo"
              onChange={e =>
                setConditionFormData(prev => ({
                  ...prev,
                  type: e.target.value as ScreeningRuleConditionType,
                }))
              }
            >
              <MenuItemWrapper value="score">Pontuação</MenuItemWrapper>
              <MenuItemWrapper value="frequency">Frequência</MenuItemWrapper>
              <MenuItemWrapper value="attendance">Presença</MenuItemWrapper>
              <MenuItemWrapper value="behavior">Comportamento</MenuItemWrapper>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Operador</InputLabel>
            <Select
              value={conditionFormData.operator}
              label="Operador"
              onChange={e =>
                setConditionFormData(prev => ({
                  ...prev,
                  operator: e.target.value as ScreeningRuleOperator,
                }))
              }
            >
              <MenuItemWrapper value="equals">Igual a</MenuItemWrapper>
              <MenuItemWrapper value="notEquals">Diferente de</MenuItemWrapper>
              <MenuItemWrapper value="greaterThan">Maior que</MenuItemWrapper>
              <MenuItemWrapper value="lessThan">Menor que</MenuItemWrapper>
              <MenuItemWrapper value="greaterThanOrEqual">Maior ou igual a</MenuItemWrapper>
              <MenuItemWrapper value="lessThanOrEqual">Menor ou igual a</MenuItemWrapper>
              <MenuItemWrapper value="contains">Contém</MenuItemWrapper>
              <MenuItemWrapper value="notContains">Não contém</MenuItemWrapper>
            </Select>
          </FormControl>

          <TextField
            label="Valor"
            value={conditionFormData.value}
            onChange={e => setConditionFormData(prev => ({ ...prev, value: e.target.value }))}
            fullWidth
          />

          {conditionFormData.type === 'score' && (
            <TextField
              label="ID do Instrumento"
              value={conditionFormData.instrumentId}
              onChange={e =>
                setConditionFormData(prev => ({ ...prev, instrumentId: e.target.value }))
              }
              fullWidth
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsConditionDialogOpen(false)}>Cancelar</Button>
        <Button
          onClick={selectedCondition ? handleUpdateCondition : handleCreateCondition}
          variant="contained"
        >
          {selectedCondition ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderActionDialog = () => (
    <Dialog
      open={isActionDialogOpen}
      onClose={() => setIsActionDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{selectedAction ? 'Editar Ação' : 'Nova Ação'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={actionFormData.type}
              label="Tipo"
              onChange={e =>
                setActionFormData(prev => ({
                  ...prev,
                  type: e.target.value as ScreeningRuleActionType,
                }))
              }
            >
              <MenuItemWrapper value="notification">Notificação</MenuItemWrapper>
              <MenuItemWrapper value="referral">Encaminhamento</MenuItemWrapper>
              <MenuItemWrapper value="intervention">Intervenção</MenuItemWrapper>
              <MenuItemWrapper value="assessment">Avaliação</MenuItemWrapper>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Destinatário</InputLabel>
            <Select
              value={actionFormData.target}
              label="Destinatário"
              onChange={e =>
                setActionFormData(prev => ({
                  ...prev,
                  target: e.target.value as ScreeningRuleActionTarget,
                }))
              }
            >
              <MenuItemWrapper value="student">Aluno</MenuItemWrapper>
              <MenuItemWrapper value="teacher">Professor</MenuItemWrapper>
              <MenuItemWrapper value="parent">Responsável</MenuItemWrapper>
              <MenuItemWrapper value="counselor">Orientador</MenuItemWrapper>
              <MenuItemWrapper value="principal">Diretor</MenuItemWrapper>
            </Select>
          </FormControl>

          <TextField
            label="Mensagem"
            value={actionFormData.message}
            onChange={e => setActionFormData(prev => ({ ...prev, message: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsActionDialogOpen(false)}>Cancelar</Button>
        <Button
          onClick={selectedAction ? handleUpdateAction : handleCreateAction}
          variant="contained"
        >
          {selectedAction ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <GridContainer spacing={3}>
        <GridItem xs={12} md={6}>
          <Box
            sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Condições</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsConditionDialogOpen(true)}
            >
              Nova Condição
            </Button>
          </Box>

          <GridContainer spacing={2}>{conditions.map(renderConditionCard)}</GridContainer>
        </GridItem>

        <GridItem xs={12} md={6}>
          <Box
            sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h6">Ações</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsActionDialogOpen(true)}
            >
              Nova Ação
            </Button>
          </Box>

          <GridContainer spacing={2}>{actions.map(renderActionCard)}</GridContainer>
        </GridItem>
      </GridContainer>

      {renderConditionDialog()}
      {renderActionDialog()}
    </Box>
  );
};
