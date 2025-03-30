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
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { useScreeningInstrument } from '../../hooks/useScreening';
import {
  ScreeningInstrument,
  ScreeningInstrumentManagerProps,
  ScreeningArea,
  ScreeningCategory,
  Question,
  QuestionType
} from '../../types/screening';

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

const getCategoryLabel = (category: ScreeningCategory) => {
  switch (category) {
    case 'reading':
      return 'Leitura';
    case 'math':
      return 'Matemática';
    case 'writing':
      return 'Escrita';
    case 'attention':
      return 'Atenção';
    case 'behavior':
      return 'Comportamento';
    case 'social':
      return 'Social';
    case 'emotional':
      return 'Emocional';
    case 'physical':
      return 'Físico';
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
  onInstrumentUpdate
}) => {
  const [selectedInstrument, setSelectedInstrument] = useState<ScreeningInstrument | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ScreeningInstrument>>({
    name: '',
    description: '',
    area: 'academic',
    category: 'reading',
    administrationTime: 0,
    ageRange: { min: 0, max: 0 },
    questions: [],
    isFavorite: false
  });

  const handleCreateInstrument = () => {
    onInstrumentCreate(formData as Omit<ScreeningInstrument, 'id' | 'createdAt' | 'updatedAt'>);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      area: 'academic',
      category: 'reading',
      administrationTime: 0,
      ageRange: { min: 0, max: 0 },
      questions: [],
      isFavorite: false
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
      area: 'academic',
      category: 'reading',
      administrationTime: 0,
      ageRange: { min: 0, max: 0 },
      questions: [],
      isFavorite: false
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
      max: 0
    };
    setFormData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
  };

  const handleUpdateQuestion = (questionId: string, updatedQuestion: Question) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.map(q =>
        q.id === questionId ? updatedQuestion : q
      )
    }));
  };

  const handleDeleteQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== questionId)
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
            <Tooltip title={instrument.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}>
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
          <Typography variant="body2" color="text.secondary">
            Questões: {instrument.questions.length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const renderQuestionForm = (question: Question) => (
    <Box key={question.id} sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">
          Questão {formData.questions?.indexOf(question) + 1}
        </Typography>
        <IconButton
          color="error"
          onClick={() => handleDeleteQuestion(question.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Texto da questão"
            value={question.text}
            onChange={(e) => handleUpdateQuestion(question.id, { ...question, text: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={question.type}
              label="Tipo"
              onChange={(e) => handleUpdateQuestion(question.id, { ...question, type: e.target.value as QuestionType })}
            >
              <MenuItem value="radio">Escolha única</MenuItem>
              <MenuItem value="checkbox">Múltipla escolha</MenuItem>
              <MenuItem value="slider">Escala</MenuItem>
              <MenuItem value="text">Texto livre</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {(question.type === 'radio' || question.type === 'checkbox') && (
          <Grid item xs={12}>
            <TextField
              label="Opções (uma por linha)"
              value={question.options.join('\n')}
              onChange={(e) => handleUpdateQuestion(question.id, {
                ...question,
                options: e.target.value.split('\n').filter(opt => opt.trim())
              })}
              fullWidth
              multiline
              rows={4}
              helperText="Digite cada opção em uma linha diferente"
            />
          </Grid>
        )}

        {question.type === 'slider' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor mínimo"
                type="number"
                value={question.min}
                onChange={(e) => handleUpdateQuestion(question.id, { ...question, min: Number(e.target.value) })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Valor máximo"
                type="number"
                value={question.max}
                onChange={(e) => handleUpdateQuestion(question.id, { ...question, max: Number(e.target.value) })}
                fullWidth
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );

  const renderCreateDialog = () => (
    <Dialog
      open={isCreateDialogOpen}
      onClose={() => setIsCreateDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Criar Novo Instrumento</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Área</InputLabel>
            <Select
              value={formData.area}
              label="Área"
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value as ScreeningArea }))}
            >
              <MenuItem value="academic">Acadêmico</MenuItem>
              <MenuItem value="behavioral">Comportamental</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="emotional">Emocional</MenuItem>
              <MenuItem value="physical">Físico</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              label="Categoria"
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ScreeningCategory }))}
            >
              <MenuItem value="reading">Leitura</MenuItem>
              <MenuItem value="math">Matemática</MenuItem>
              <MenuItem value="writing">Escrita</MenuItem>
              <MenuItem value="attention">Atenção</MenuItem>
              <MenuItem value="behavior">Comportamento</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="emotional">Emocional</MenuItem>
              <MenuItem value="physical">Físico</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tempo de administração (minutos)"
            type="number"
            value={formData.administrationTime}
            onChange={(e) => setFormData(prev => ({ ...prev, administrationTime: Number(e.target.value) }))}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Idade mínima"
                type="number"
                value={formData.ageRange?.min}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange!, min: Number(e.target.value) }
                }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Idade máxima"
                type="number"
                value={formData.ageRange?.max}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange!, max: Number(e.target.value) }
                }))}
                fullWidth
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Questões
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
            >
              Nova Questão
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
      <DialogTitle>Editar Instrumento</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Nome"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Descrição"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Área</InputLabel>
            <Select
              value={formData.area}
              label="Área"
              onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value as ScreeningArea }))}
            >
              <MenuItem value="academic">Acadêmico</MenuItem>
              <MenuItem value="behavioral">Comportamental</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="emotional">Emocional</MenuItem>
              <MenuItem value="physical">Físico</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.category}
              label="Categoria"
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ScreeningCategory }))}
            >
              <MenuItem value="reading">Leitura</MenuItem>
              <MenuItem value="math">Matemática</MenuItem>
              <MenuItem value="writing">Escrita</MenuItem>
              <MenuItem value="attention">Atenção</MenuItem>
              <MenuItem value="behavior">Comportamento</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="emotional">Emocional</MenuItem>
              <MenuItem value="physical">Físico</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tempo de administração (minutos)"
            type="number"
            value={formData.administrationTime}
            onChange={(e) => setFormData(prev => ({ ...prev, administrationTime: Number(e.target.value) }))}
            fullWidth
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Idade mínima"
                type="number"
                value={formData.ageRange?.min}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange!, min: Number(e.target.value) }
                }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Idade máxima"
                type="number"
                value={formData.ageRange?.max}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  ageRange: { ...prev.ageRange!, max: Number(e.target.value) }
                }))}
                fullWidth
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Questões
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
            >
              Nova Questão
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
        <Typography variant="h5">
          Instrumentos de Rastreio
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Novo Instrumento
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* TODO: Implementar lista de instrumentos */}
      </Grid>

      {renderCreateDialog()}
      {renderEditDialog()}
    </Box>
  );
};
