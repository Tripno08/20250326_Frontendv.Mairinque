import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Checkbox,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  useTheme,
  SelectChangeEvent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  AssignmentInd as AssignmentIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import {
  TeamMember,
  TeamCase,
  TeamRole,
  InterventionTier,
  CaseStatus,
  RoleAssignmentProps,
} from '@/types/team';
import { useCaseAssignments } from '@/hooks/useTeam';
import GridItem from '@/components/GridItem';
import GridContainer from '@/components/GridContainer';
import ListItemWrapper from '@/components/ListItemWrapper';

/**
 * Componente para atribuição de papéis e responsabilidades aos membros da equipe
 */
export const RoleAssignment: React.FC<RoleAssignmentProps> = ({
  className,
  style,
  teamId,
  members,
  cases,
  onAssignmentChange,
  onRoleChange,
}) => {
  const theme = useTheme();

  // Estado local
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<TeamRole>(TeamRole.SPECIALIST);
  const [assignCasesDialogOpen, setAssignCasesDialogOpen] = useState(false);
  const [casesToAssign, setCasesToAssign] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Hooks personalizados
  const { assignments, isLoading, error, updateAssignment } = useCaseAssignments(teamId);

  // Efeito para inicializar casos selecionados quando um membro é selecionado
  useEffect(() => {
    if (selectedMemberId && assignments[selectedMemberId]) {
      setCasesToAssign([...assignments[selectedMemberId]]);
    } else {
      setCasesToAssign([]);
    }
  }, [selectedMemberId, assignments]);

  // Memoizar o membro selecionado
  const selectedMember = useMemo(() => {
    return members.find(m => m.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  // Memoizar os casos já atribuídos aos membros
  const assignedCasesByMember = useMemo(() => {
    const result: Record<string, string[]> = {};
    Object.entries(assignments).forEach(([memberId, caseIds]) => {
      result[memberId] = caseIds;
    });
    return result;
  }, [assignments]);

  // Funções auxiliares para localizar nomes
  const getMemberName = (memberId: string): string => {
    const member = members.find(m => m.id === memberId);
    return member ? member.name : 'Membro desconhecido';
  };

  const getCaseName = (caseId: string): string => {
    const caseItem = cases.find(c => c.id === caseId);
    return caseItem
      ? `${caseItem.studentName} - ${caseItem.description.substring(0, 30)}...`
      : 'Caso desconhecido';
  };

  // Funções utilitárias para cores
  const getRoleColor = (role: TeamRole): string => {
    switch (role) {
      case TeamRole.COORDINATOR:
        return theme.palette.primary.main;
      case TeamRole.SPECIALIST:
        return theme.palette.secondary.main;
      case TeamRole.PSYCHOLOGIST:
        return theme.palette.success.main;
      case TeamRole.COUNSELOR:
        return theme.palette.info.main;
      case TeamRole.SOCIAL_WORKER:
        return theme.palette.warning.main;
      case TeamRole.TEACHER:
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getTierColor = (tier: InterventionTier): string => {
    switch (tier) {
      case InterventionTier.TIER1:
        return '#4CAF50'; // Verde
      case InterventionTier.TIER2:
        return '#FFC107'; // Amarelo
      case InterventionTier.TIER3:
        return '#F44336'; // Vermelho
      default:
        return theme.palette.grey[500];
    }
  };

  // Manipuladores de eventos
  const handleMemberSelect = (memberId: string) => {
    setSelectedMemberId(memberId === selectedMemberId ? null : memberId);
    setEditingRole(null);
  };

  const handleStartEditingRole = (memberId: string, currentRole: TeamRole) => {
    setEditingRole(memberId);
    setNewRole(currentRole);
  };

  const handleSaveRole = async (memberId: string) => {
    if (!onRoleChange) return;

    setIsSaving(true);
    try {
      await onRoleChange(memberId, newRole);
      setSnackbar({
        open: true,
        message: 'Função atualizada com sucesso.',
        severity: 'success',
      });
      setEditingRole(null);
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Erro ao atualizar função: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEditRole = () => {
    setEditingRole(null);
  };

  const handleRoleChange = (event: SelectChangeEvent<TeamRole>) => {
    setNewRole(event.target.value as TeamRole);
  };

  const handleOpenAssignCasesDialog = (memberId: string) => {
    setSelectedMemberId(memberId);
    setAssignCasesDialogOpen(true);
  };

  const handleCloseAssignCasesDialog = () => {
    setAssignCasesDialogOpen(false);
  };

  const handleToggleCaseAssignment = (caseId: string) => {
    setCasesToAssign(prev => {
      const isCurrentlyAssigned = prev.includes(caseId);
      if (isCurrentlyAssigned) {
        return prev.filter(id => id !== caseId);
      } else {
        return [...prev, caseId];
      }
    });
  };

  const handleSaveAssignments = async () => {
    if (!selectedMemberId || !onAssignmentChange) return;

    setIsSaving(true);
    try {
      await onAssignmentChange(selectedMemberId, casesToAssign);
      setSnackbar({
        open: true,
        message: 'Atribuições atualizadas com sucesso.',
        severity: 'success',
      });
      handleCloseAssignCasesDialog();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Erro ao atualizar atribuições: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Funções auxiliares para renderização
  const renderMemberCard = (member: TeamMember) => {
    const isSelected = selectedMemberId === member.id;
    const assignedCases = assignedCasesByMember[member.id] || [];
    const isEditing = editingRole === member.id;

    return (
      <Card
        key={member.id}
        sx={{
          mb: 2,
          border: isSelected ? `2px solid ${theme.palette.primary.main}` : 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
        }}
        onClick={() => handleMemberSelect(member.id)}
      >
        <CardHeader
          avatar={
            <Avatar src={member.avatar || undefined} alt={member.name}>
              {member.name.charAt(0)}
            </Avatar>
          }
          title={member.name}
          subheader={
            isEditing ? (
              <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                <InputLabel id={`role-select-label-${member.id}`}>Função</InputLabel>
                <Select
                  labelId={`role-select-label-${member.id}`}
                  value={newRole}
                  onChange={handleRoleChange}
                  label="Função"
                  size="small"
                >
                  {Object.values(TeamRole).map(role => (
                    <MenuItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Chip
                label={member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                size="small"
                sx={{
                  bgcolor: getRoleColor(member.role),
                  color: '#fff',
                  mt: 1,
                }}
              />
            )
          }
          action={
            isEditing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mr: 1 }}>
                {isSaving ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        handleSaveRole(member.id);
                      }}
                    >
                      <CheckCircleIcon fontSize="small" color="success" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        handleCancelEditRole();
                      }}
                    >
                      <CancelIcon fontSize="small" color="error" />
                    </IconButton>
                  </>
                )}
              </Box>
            ) : (
              <Tooltip title="Editar função">
                <IconButton
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    handleStartEditingRole(member.id, member.role);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon
                  fontSize="small"
                  sx={{ mr: 1, color: theme.palette.warning.main }}
                />
                Casos atribuídos: {assignedCases.length}
                <Tooltip title="Atribuir casos">
                  <IconButton
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={e => {
                      e.stopPropagation();
                      handleOpenAssignCasesDialog(member.id);
                    }}
                  >
                    <AddCircleIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Especialidades:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {member.specialties.map(specialty => (
                    <Chip
                      key={specialty}
                      label={
                        specialty.charAt(0).toUpperCase() + specialty.slice(1).replace('_', ' ')
                      }
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderCasesDialog = () => {
    return (
      <Dialog
        open={assignCasesDialogOpen}
        onClose={handleCloseAssignCasesDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Atribuir Casos para {selectedMember ? selectedMember.name : ''}</DialogTitle>
        <DialogContent>
          <List>
            {cases.map(caseItem => {
              const isAssigned = casesToAssign.includes(caseItem.id);

              return (
                <ListItemWrapper
                  key={caseItem.id}
                  button
                  onClick={() => handleToggleCaseAssignment(caseItem.id)}
                  sx={{
                    borderLeft: `4px solid ${getTierColor(caseItem.tier)}`,
                    mb: 1,
                    bgcolor: isAssigned ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getTierColor(caseItem.tier) }}>{caseItem.tier}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={caseItem.studentName}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {`Status: ${caseItem.status}`}
                        </Typography>
                        {` — ${caseItem.description.substring(0, 60)}...`}
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      checked={isAssigned}
                      onChange={() => handleToggleCaseAssignment(caseItem.id)}
                    />
                  </ListItemSecondaryAction>
                </ListItemWrapper>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignCasesDialog}>Cancelar</Button>
          <Button
            onClick={handleSaveAssignments}
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : undefined}
          >
            Salvar Atribuições
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Renderização principal do componente
  return (
    <Box sx={style ? { ...style } : {}} className={className}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Atribuição de Papéis e Responsabilidades
        </Typography>
        <Typography variant="body1" paragraph>
          Gerencie os papéis dos membros da equipe e atribua casos para cada profissional. Clique em
          um membro para ver seus detalhes ou use os botões para editar suas atribuições.
        </Typography>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao carregar atribuições: {error.message}
        </Alert>
      ) : (
        <GridContainer spacing={3}>
          <GridItem xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Membros da Equipe
            </Typography>
            <GridContainer spacing={2}>
              {members.map(member => (
                <GridItem xs={12} sm={6} key={member.id}>
                  {renderMemberCard(member)}
                </GridItem>
              ))}
            </GridContainer>
          </GridItem>

          <GridItem xs={12} md={4}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Casos Atribuídos
              </Typography>
              {selectedMember ? (
                <>
                  <Typography variant="subtitle1">
                    {selectedMember.name} - {selectedMember.role}
                  </Typography>
                  <List sx={{ mt: 2 }}>
                    {(assignedCasesByMember[selectedMember.id] || []).length > 0 ? (
                      (assignedCasesByMember[selectedMember.id] || []).map(caseId => {
                        const caseItem = cases.find(c => c.id === caseId);
                        if (!caseItem) return null;

                        return (
                          <ListItemWrapper key={caseId} sx={{ py: 1, px: 0 }}>
                            <ListItemText
                              primary={caseItem.studentName}
                              secondary={caseItem.description.substring(0, 60) + '...'}
                            />
                          </ListItemWrapper>
                        );
                      })
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Nenhum caso atribuído.
                      </Typography>
                    )}
                  </List>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Selecione um membro da equipe para ver seus casos atribuídos.
                </Typography>
              )}
            </Paper>
          </GridItem>
        </GridContainer>
      )}

      {/* Dialog para atribuir casos */}
      {renderCasesDialog()}

      {/* Snackbar para feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
