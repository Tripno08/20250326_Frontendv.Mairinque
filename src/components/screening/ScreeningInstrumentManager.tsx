import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { useScreeningInstrument } from '../../hooks/useScreening';
import {
  ScreeningInstrument,
  ScreeningInstrumentManagerProps,
  ScreeningArea,
  ScreeningCategory,
  Question,
  QuestionType,
} from '../../types/screening';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';
import MenuItemWrapper from '@/components/MenuItemWrapper';

const getAreaLabel = (area: ScreeningArea) => {
  switch (area) {
    case 'reading':
      return 'Leitura';
    case 'math':
      return 'Matemática';
    case 'behavior':
      return 'Comportamento';
    case 'social_emotional':
      return 'Socioemocional';
    default:
      return area;
  }
};

const getCategoryLabel = (category: ScreeningCategory) => {
  switch (category) {
    case 'academic':
      return 'Acadêmico';
    case 'behavioral':
      return 'Comportamental';
    case 'socioemotional':
      return 'Socioemocional';
    default:
      return category;
  }
};

const getQuestionTypeLabel = (type: QuestionType) => {
  switch (type) {
    case 'radio':
      return 'Escolha única';
    case 'checkbox':
      return 'Múltipla escolha';
    case 'slider':
      return 'Escala';
    case 'text':
      return 'Texto livre';
    default:
      return type;
  }
};

export const ScreeningInstrumentManager: React.FC<ScreeningInstrumentManagerProps> = ({
  onInstrumentCreate,
  onInstrumentUpdate,
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState<ScreeningInstrument | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ScreeningInstrument>>({
    name: '',
    description: '',
    area: 'reading',
    category: 'academic',
    administrationTime: 0,
    ageRange: { min: 0, max: 0 },
    questions: [],
    isFavorite: false,
  });

  const handleCreateInstrument = () => {
    onInstrumentCreate(formData as Omit<ScreeningInstrument, 'id' | 'createdAt' | 'updatedAt'>);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      area: 'reading',
      category: 'academic',
      administrationTime: 0,
      ageRange: { min: 0, max: 0 },
      questions: [],
      isFavorite: false,
    });
  };

  const handleUpdateInstrument = () => {
    if (!selectedInstrument) return;
    onInstrumentUpdate(selectedInstrument.id, formData);
    setIsEditDialogOpen(false);
    setSelectedInstrument(null);
    setFormData({
      name: '',
      description: '',
      area: 'reading',
      category: 'academic',
      administrationTime: 0,
      ageRange: { min: 0, max: 0 },
      questions: [],
      isFavorite: false,
    });
  };

  const handleEditClick = (instrument: ScreeningInstrument) => {
    setSelectedInstrument(instrument);
    setFormData(instrument);
    setIsEditDialogOpen(true);
  };

  const handleToggleFavorite = (instrument: ScreeningInstrument) => {
    onInstrumentUpdate(instrument.id, { isFavorite: !instrument.isFavorite });
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'radio',
      text: '',
      options: [],
      min: 0,
      max: 0,
    };
    setFormData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));
  };

  const handleUpdateQuestion = (questionId: string, updatedQuestion: Question) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.map(q => (q.id === questionId ? updatedQuestion : q)),
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId),
    }));
  };

  const renderInstrumentCard = (instrument: ScreeningInstrument) => (
    <Card key={instrument.id}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2">
            {instrument.name}
          </Typography>
          <Box>
            <Tooltip
              title={instrument.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <IconButton onClick={() => handleToggleFavorite(instrument)}>
                {instrument.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton onClick={() => handleEditClick(instrument)}>
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
          {instrument.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip
            icon={<AssessmentIcon />}
            label={getAreaLabel(instrument.area)}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<CategoryIcon />}
            label={getCategoryLabel(instrument.category)}
            size="small"
            color="secondary"
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={`${instrument.administrationTime} min`}
            size="small"
            color="info"
            variant="outlined"
          />
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Faixa etária: {instrument.ageRange.min} - {instrument.ageRange.max} anos
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderQuestionForm = (question: Question) => {
    if (!question) return null;

    return (
      <Box key={question.id} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1">
            Questão {formData.questions?.indexOf(question) + 1}
          </Typography>
          <IconButton color="error" onClick={() => handleDeleteQuestion(question.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <GridContainer spacing={2}>
          <GridItem xs={12}>
            <TextField
              label="Texto da questão"
              value={question.text}
              onChange={e =>
                handleUpdateQuestion(question.id, { ...question, text: e.target.value })
              }
              fullWidth
              multiline
              rows={2}
            />
          </GridItem>

          <GridItem xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={question.type}
                label="Tipo"
                onChange={e =>
                  handleUpdateQuestion(question.id, {
                    ...question,
                    type: e.target.value as QuestionType,
                  })
                }
              >
                <MenuItemWrapper value="radio">Escolha única</MenuItemWrapper>
                <MenuItemWrapper value="checkbox">Múltipla escolha</MenuItemWrapper>
                <MenuItemWrapper value="slider">Escala</MenuItemWrapper>
                <MenuItemWrapper value="text">Texto livre</MenuItemWrapper>
              </Select>
            </FormControl>
          </GridItem>

          {(question.type === 'radio' || question.type === 'checkbox') && (
            <GridItem xs={12}>
              <TextField
                label="Opções (uma por linha)"
                value={question.options.join('\n')}
                onChange={e =>
                  handleUpdateQuestion(question.id, {
                    ...question,
                    options: e.target.value.split('\n').filter(opt => opt.trim()),
                  })
                }
                fullWidth
                multiline
                rows={4}
                helperText="Digite cada opção em uma linha diferente"
              />
            </GridItem>
          )}

          {question.type === 'slider' && (
            <>
              <GridItem xs={12} sm={6}>
                <TextField
                  label="Valor mínimo"
                  type="number"
                  value={question.min}
                  onChange={e =>
                    handleUpdateQuestion(question.id, { ...question, min: Number(e.target.value) })
                  }
                  fullWidth
                />
              </GridItem>
              <GridItem xs={12} sm={6}>
                <TextField
                  label="Valor máximo"
                  type="number"
                  value={question.max}
                  onChange={e =>
                    handleUpdateQuestion(question.id, { ...question, max: Number(e.target.value) })
                  }
                  fullWidth
                />
              </GridItem>
            </>
          )}
        </GridContainer>
      </Box>
    );
  };

  const renderCreateDialog = () => (
    <Dialog
      open={isCreateDialogOpen}
      onClose={() => setIsCreateDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Novo Instrumento de Rastreio</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1 }}>
          <GridContainer spacing={2}>
            <GridItem xs={12}>
              <TextField
                label="Nome do Instrumento"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
            </GridItem>
            <GridItem xs={12}>
              <TextField
                label="Descrição"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Área</InputLabel>
                <Select
                  value={formData.area}
                  label="Área"
                  onChange={e =>
                    setFormData({ ...formData, area: e.target.value as ScreeningArea })
                  }
                >
                  <MenuItemWrapper value="academic">Acadêmico</MenuItemWrapper>
                  <MenuItemWrapper value="behavioral">Comportamental</MenuItemWrapper>
                  <MenuItemWrapper value="social">Social</MenuItemWrapper>
                  <MenuItemWrapper value="emotional">Emocional</MenuItemWrapper>
                  <MenuItemWrapper value="physical">Físico</MenuItemWrapper>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  label="Categoria"
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value as ScreeningCategory })
                  }
                >
                  <MenuItemWrapper value="reading">Leitura</MenuItemWrapper>
                  <MenuItemWrapper value="math">Matemática</MenuItemWrapper>
                  <MenuItemWrapper value="writing">Escrita</MenuItemWrapper>
                  <MenuItemWrapper value="attention">Atenção</MenuItemWrapper>
                  <MenuItemWrapper value="behavior">Comportamento</MenuItemWrapper>
                  <MenuItemWrapper value="social">Social</MenuItemWrapper>
                  <MenuItemWrapper value="emotional">Emocional</MenuItemWrapper>
                  <MenuItemWrapper value="physical">Físico</MenuItemWrapper>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                label="Tempo de Administração (minutos)"
                type="number"
                value={formData.administrationTime}
                onChange={e =>
                  setFormData({ ...formData, administrationTime: Number(e.target.value) })
                }
                fullWidth
                margin="normal"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFavorite}
                    onChange={e => setFormData({ ...formData, isFavorite: e.target.checked })}
                  />
                }
                label="Favorito"
                sx={{ mt: 2 }}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                label="Idade Mínima"
                type="number"
                value={formData.ageRange?.min || 0}
                onChange={e =>
                  setFormData({
                    ...formData,
                    ageRange: { ...formData.ageRange, min: Number(e.target.value) },
                  })
                }
                fullWidth
                margin="normal"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                label="Idade Máxima"
                type="number"
                value={formData.ageRange?.max || 0}
                onChange={e =>
                  setFormData({
                    ...formData,
                    ageRange: { ...formData.ageRange, max: Number(e.target.value) },
                  })
                }
                fullWidth
                margin="normal"
              />
            </GridItem>
          </GridContainer>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6">Questões</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              sx={{ mt: 1 }}
            >
              Adicionar Questão
            </Button>
          </Box>

          {formData.questions?.map(renderQuestionForm)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsCreateDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleCreateInstrument} variant="contained">
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditDialog = () => (
    <Dialog
      open={isEditDialogOpen}
      onClose={() => setIsEditDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Editar Instrumento de Rastreio</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 1 }}>
          <GridContainer spacing={2}>
            <GridItem xs={12}>
              <TextField
                label="Nome do Instrumento"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                margin="normal"
                required
              />
            </GridItem>
            <GridItem xs={12}>
              <TextField
                label="Descrição"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Área</InputLabel>
                <Select
                  value={formData.area}
                  label="Área"
                  onChange={e =>
                    setFormData({ ...formData, area: e.target.value as ScreeningArea })
                  }
                >
                  <MenuItemWrapper value="academic">Acadêmico</MenuItemWrapper>
                  <MenuItemWrapper value="behavioral">Comportamental</MenuItemWrapper>
                  <MenuItemWrapper value="social">Social</MenuItemWrapper>
                  <MenuItemWrapper value="emotional">Emocional</MenuItemWrapper>
                  <MenuItemWrapper value="physical">Físico</MenuItemWrapper>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  label="Categoria"
                  onChange={e =>
                    setFormData({ ...formData, category: e.target.value as ScreeningCategory })
                  }
                >
                  <MenuItemWrapper value="reading">Leitura</MenuItemWrapper>
                  <MenuItemWrapper value="math">Matemática</MenuItemWrapper>
                  <MenuItemWrapper value="writing">Escrita</MenuItemWrapper>
                  <MenuItemWrapper value="attention">Atenção</MenuItemWrapper>
                  <MenuItemWrapper value="behavior">Comportamento</MenuItemWrapper>
                  <MenuItemWrapper value="social">Social</MenuItemWrapper>
                  <MenuItemWrapper value="emotional">Emocional</MenuItemWrapper>
                  <MenuItemWrapper value="physical">Físico</MenuItemWrapper>
                </Select>
              </FormControl>
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                label="Tempo de Administração (minutos)"
                type="number"
                value={formData.administrationTime}
                onChange={e =>
                  setFormData({ ...formData, administrationTime: Number(e.target.value) })
                }
                fullWidth
                margin="normal"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFavorite}
                    onChange={e => setFormData({ ...formData, isFavorite: e.target.checked })}
                  />
                }
                label="Favorito"
                sx={{ mt: 2 }}
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                label="Idade Mínima"
                type="number"
                value={formData.ageRange?.min || 0}
                onChange={e =>
                  setFormData({
                    ...formData,
                    ageRange: { ...formData.ageRange, min: Number(e.target.value) },
                  })
                }
                fullWidth
                margin="normal"
              />
            </GridItem>
            <GridItem xs={12} sm={6}>
              <TextField
                label="Idade Máxima"
                type="number"
                value={formData.ageRange?.max || 0}
                onChange={e =>
                  setFormData({
                    ...formData,
                    ageRange: { ...formData.ageRange, max: Number(e.target.value) },
                  })
                }
                fullWidth
                margin="normal"
              />
            </GridItem>
          </GridContainer>

          <Box sx={{ mt: 4, mb: 2 }}>
            <Typography variant="h6">Questões</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              sx={{ mt: 1 }}
            >
              Adicionar Questão
            </Button>
          </Box>

          {formData.questions?.map(renderQuestionForm)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
        <Button onClick={handleUpdateInstrument} variant="contained">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Instrumentos de Rastreio</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Novo Instrumento
        </Button>
      </Box>

      <GridContainer spacing={3}>{/* TODO: Implementar lista de instrumentos */}</GridContainer>

      {renderCreateDialog()}
      {renderEditDialog()}
    </Box>
  );
};
