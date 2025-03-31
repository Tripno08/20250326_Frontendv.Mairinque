import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Badge,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PeopleAlt as PeopleIcon,
  AssignmentInd as AssignmentIcon,
  Assessment as AssessmentIcon,
  Forum as ForumIcon,
  Event as EventIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { Team, TeamMember, TeamRole } from '@/types/team';
import { useTeams } from '@/hooks/useTeam';
import { TeamManagementProps } from '@/types/team';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';

/**
 * Componente principal para gerenciamento de equipes multidisciplinares
 */
export const TeamManagement: React.FC<TeamManagementProps> = ({
  className,
  style,
  onTeamCreate,
  onTeamUpdate,
  onTeamDelete,
  onMemberAdd,
  onMemberRemove,
  onCaseAssign,
  onCaseUnassign,
}) => {
  // Estado local
  const [activeTab, setActiveTab] = useState(0);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [newTeam, setNewTeam] = useState<
    Partial<Omit<Team, 'id' | 'dateCreated' | 'dateModified'>>
  >({
    name: '',
    description: '',
    members: [],
    coordinator: '',
    caseIds: [],
    isActive: true,
  });
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
  const { teams, isLoading, error, fetchTeams, createTeam, updateTeam, deleteTeam } = useTeams();

  // Manipuladores de eventos
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenTeamDialog = (team?: Team) => {
    if (team) {
      setEditingTeam(team);
      setNewTeam({
        name: team.name,
        description: team.description,
        members: team.members,
        coordinator: team.coordinator,
        caseIds: team.caseIds,
        isActive: team.isActive,
      });
    } else {
      setEditingTeam(null);
      setNewTeam({
        name: '',
        description: '',
        members: [],
        coordinator: '',
        caseIds: [],
        isActive: true,
      });
    }
    setTeamDialogOpen(true);
  };

  const handleCloseTeamDialog = () => {
    setTeamDialogOpen(false);
    setEditingTeam(null);
  };

  const handleTeamInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateUpdateTeam = async () => {
    try {
      if (editingTeam) {
        // Atualizando equipe existente
        const result = onTeamUpdate
          ? await onTeamUpdate({ ...editingTeam, ...(newTeam as Partial<Team>) })
          : await updateTeam(editingTeam.id, newTeam);

        if (result) {
          setSnackbar({
            open: true,
            message: 'Equipe atualizada com sucesso.',
            severity: 'success',
          });
        }
      } else {
        // Criando nova equipe
        const teamData = newTeam as Omit<Team, 'id' | 'dateCreated' | 'dateModified'>;
        const result = onTeamCreate ? await onTeamCreate(teamData) : await createTeam(teamData);

        if (result) {
          setSnackbar({
            open: true,
            message: 'Equipe criada com sucesso.',
            severity: 'success',
          });
        }
      }
      handleCloseTeamDialog();
      fetchTeams();
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Erro ao ${editingTeam ? 'atualizar' : 'criar'} equipe: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        severity: 'error',
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (
      window.confirm('Tem certeza que deseja excluir esta equipe? Esta ação não pode ser desfeita.')
    ) {
      try {
        const success = onTeamDelete ? await onTeamDelete(teamId) : await deleteTeam(teamId);

        if (success) {
          setSnackbar({
            open: true,
            message: 'Equipe excluída com sucesso.',
            severity: 'success',
          });
          fetchTeams();
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: `Erro ao excluir equipe: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Funções auxiliares para renderização
  const renderTeamCard = (team: Team) => {
    return (
      <Card key={team.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h3">
              {team.name}
            </Typography>
            <Box>
              <Chip
                label={team.isActive ? 'Ativa' : 'Inativa'}
                color={team.isActive ? 'success' : 'default'}
                size="small"
                sx={{ mr: 1 }}
              />
              <Tooltip title="Editar equipe">
                <IconButton size="small" onClick={() => handleOpenTeamDialog(team)}>
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir equipe">
                <IconButton size="small" onClick={() => handleDeleteTeam(team.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {team.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
              {team.description}
            </Typography>
          )}

          <GridContainer spacing={2} sx={{ mt: 1 }}>
            <GridItem xs={6}>
              <Typography
                variant="body2"
                component="div"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                {team.members.length} membros
              </Typography>
            </GridItem>
            <GridItem xs={6}>
              <Typography
                variant="body2"
                component="div"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <AssignmentIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
                {team.caseIds.length} casos
              </Typography>
            </GridItem>
          </GridContainer>
        </CardContent>
        <Divider />
        <CardActions>
          <Button size="small" href={`/teams/${team.id}`}>
            Visualizar Detalhes
          </Button>
          <Button size="small" href={`/teams/${team.id}/members`}>
            Gerenciar Membros
          </Button>
          <Button size="small" href={`/teams/${team.id}/cases`}>
            Gerenciar Casos
          </Button>
        </CardActions>
      </Card>
    );
  };

  // Componente de diálogo para criar/editar equipes
  const renderTeamDialog = () => {
    return (
      <Dialog open={teamDialogOpen} onClose={handleCloseTeamDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTeam ? `Editar Equipe: ${editingTeam.name}` : 'Criar Nova Equipe'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <GridContainer spacing={2}>
              <GridItem xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Nome da Equipe"
                  name="name"
                  value={newTeam.name}
                  onChange={handleTeamInputChange}
                />
              </GridItem>
              <GridItem xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={newTeam.description || ''}
                  onChange={handleTeamInputChange}
                  multiline
                  rows={3}
                />
              </GridItem>
            </GridContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTeamDialog}>Cancelar</Button>
          <Button onClick={handleCreateUpdateTeam} variant="contained" disabled={!newTeam.name}>
            {editingTeam ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Renderização principal do componente
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, ...style }} className={className}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestão de Equipes Multidisciplinares
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenTeamDialog()}>
          Nova Equipe
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Todas as Equipes" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Equipes Ativas" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Equipes Inativas" id="tab-2" aria-controls="tabpanel-2" />
        </Tabs>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Erro ao carregar equipes: {error.message}
        </Alert>
      ) : teams.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Nenhuma equipe encontrada</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Clique no botão "Nova Equipe" para criar sua primeira equipe multidisciplinar.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenTeamDialog()}
            sx={{ mt: 2 }}
          >
            Criar Equipe
          </Button>
        </Paper>
      ) : (
        <Box role="tabpanel" hidden={activeTab !== 0} id="tabpanel-0">
          <GridContainer spacing={3}>
            {teams.map(team => (
              <GridItem xs={12} sm={6} md={4} key={team.id}>
                {renderTeamCard(team)}
              </GridItem>
            ))}
          </GridContainer>
        </Box>
      )}

      {/* Painel para equipes ativas */}
      <Box role="tabpanel" hidden={activeTab !== 1} id="tabpanel-1">
        <GridContainer spacing={3}>
          {teams
            .filter(team => team.isActive)
            .map(team => (
              <GridItem xs={12} sm={6} md={4} key={team.id}>
                {renderTeamCard(team)}
              </GridItem>
            ))}
        </GridContainer>
      </Box>

      {/* Painel para equipes inativas */}
      <Box role="tabpanel" hidden={activeTab !== 2} id="tabpanel-2">
        <GridContainer spacing={3}>
          {teams
            .filter(team => !team.isActive)
            .map(team => (
              <GridItem xs={12} sm={6} md={4} key={team.id}>
                {renderTeamCard(team)}
              </GridItem>
            ))}
        </GridContainer>
      </Box>

      {/* Diálogo para criar/editar equipes */}
      {renderTeamDialog()}

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
