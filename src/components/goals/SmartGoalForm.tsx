'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  FormHelperText,
  InputAdornment,
  Autocomplete,
  Stack,
  ListItem,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import type {
  GoalFormProps,
  SmartGoalFormData,
  GoalStatus,
  GoalPriority
} from '@/types/smart-goals';
import type { Intervention } from '@/types/intervention';

// Domínios educacionais
const DOMAINS = [
  'Língua Portuguesa',
  'Matemática',
  'Ciências',
  'História',
  'Geografia',
  'Artes',
  'Educação Física',
  'Inglês',
  'Competências Socioemocionais',
  'Outro'
];

// Estrutura inicial vazia do formulário
const emptyFormData: SmartGoalFormData = {
  studentId: '',
  title: '',
  description: '',
  specificDetails: '',
  initialValue: 0,
  targetValue: 0,
  unit: '',
  achievementSteps: [''],
  relevance: '',
  startDate: new Date(),
  targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
  status: 'não iniciada',
  priority: 'média',
  domain: '',
  skills: [],
  responsibleUsers: [],
  interventions: [],
};

export const SmartGoalForm: React.FC<GoalFormProps> = ({
  initialData,
  studentId,
  interventionsLibrary = [],
  onSave,
  onCancel
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<SmartGoalFormData>({
    ...emptyFormData,
    ...initialData,
    studentId
  });

  // Estado de validação
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Manipuladores para campos de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Limpa erro ao editar campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manipulador para campos de select
  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>, name: string) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));

    // Limpa erro ao editar campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manipulador para campos de data
  const handleDateChange = (date: Date | null, fieldName: string) => {
    if (date) {
      setFormData(prev => ({ ...prev, [fieldName]: date }));

      // Limpa erro ao editar campo
      if (errors[fieldName]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    }
  };

  // Manipulador para passos para atingir meta
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...formData.achievementSteps];
    newSteps[index] = value;

    setFormData(prev => ({
      ...prev,
      achievementSteps: newSteps
    }));
  };

  // Adicionar novo passo
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      achievementSteps: [...prev.achievementSteps, '']
    }));
  };

  // Remover passo
  const removeStep = (index: number) => {
    const newSteps = [...formData.achievementSteps];
    newSteps.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      achievementSteps: newSteps.length > 0 ? newSteps : ['']
    }));
  };

  // Manipulador para habilidades (skills)
  const handleSkillsChange = (event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      skills: newValue
    }));
  };

  // Manipulador para intervenções
  const handleInterventionsChange = (event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      interventions: newValue
    }));
  };

  // Manipulador para responsáveis
  const handleResponsibleChange = (event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      responsibleUsers: newValue
    }));
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Campos obrigatórios
    if (!formData.title.trim()) newErrors.title = 'O título é obrigatório';
    if (!formData.specificDetails.trim()) newErrors.specificDetails = 'Os detalhes específicos são obrigatórios';
    if (!formData.domain.trim()) newErrors.domain = 'O domínio é obrigatório';
    if (!formData.unit.trim()) newErrors.unit = 'A unidade de medida é obrigatória';
    if (formData.achievementSteps.length === 0 || !formData.achievementSteps[0].trim())
      newErrors.achievementSteps = 'Pelo menos um passo é obrigatório';
    if (!formData.relevance.trim()) newErrors.relevance = 'A relevância é obrigatória';

    // Validação numérica
    if (isNaN(formData.initialValue)) newErrors.initialValue = 'O valor inicial deve ser um número';
    if (isNaN(formData.targetValue)) newErrors.targetValue = 'O valor alvo deve ser um número';

    // Validação de datas
    if (!formData.startDate) newErrors.startDate = 'A data de início é obrigatória';
    if (!formData.targetDate) newErrors.targetDate = 'A data alvo é obrigatória';

    // Verifica se data alvo é posterior à data de início
    if (formData.startDate && formData.targetDate && formData.startDate >= formData.targetDate) {
      newErrors.targetDate = 'A data alvo deve ser posterior à data de início';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {initialData?.id ? 'Editar Meta SMART' : 'Nova Meta SMART'}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Título */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Meta"
                name="title"
                value={formData.title}
                onChange={handleTextChange}
                error={!!errors.title}
                helperText={errors.title || 'Título objetivo e claro da meta'}
                required
              />
            </Grid>

            {/* Descrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                multiline
                rows={2}
                helperText="Breve descrição da meta (opcional)"
              />
            </Grid>

            {/* Domínio */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.domain} required>
                <InputLabel id="domain-label">Domínio Educacional</InputLabel>
                <Select
                  labelId="domain-label"
                  name="domain"
                  value={formData.domain}
                  onChange={(e) => handleSelectChange(e as any, 'domain')}
                  label="Domínio Educacional"
                >
                  {DOMAINS.map(domain => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))}
                </Select>
                {errors.domain && <FormHelperText>{errors.domain}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Prioridade */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Prioridade</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority}
                  onChange={(e) => handleSelectChange(e as any, 'priority')}
                  label="Prioridade"
                >
                  <MenuItem value="baixa">Baixa</MenuItem>
                  <MenuItem value="média">Média</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                  <MenuItem value="crítica">Crítica</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Seção: Específica */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                S - Específica
              </Typography>
              <TextField
                fullWidth
                label="Detalhes específicos"
                name="specificDetails"
                value={formData.specificDetails}
                onChange={handleTextChange}
                multiline
                rows={3}
                error={!!errors.specificDetails}
                helperText={errors.specificDetails || 'Descreva detalhadamente o que se pretende alcançar'}
                required
              />
            </Grid>

            {/* Seção: Mensurável */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                M - Mensurável
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Valor Inicial"
                    name="initialValue"
                    type="number"
                    value={formData.initialValue}
                    onChange={handleTextChange}
                    error={!!errors.initialValue}
                    helperText={errors.initialValue}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Valor Alvo"
                    name="targetValue"
                    type="number"
                    value={formData.targetValue}
                    onChange={handleTextChange}
                    error={!!errors.targetValue}
                    helperText={errors.targetValue}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Unidade de Medida"
                    name="unit"
                    value={formData.unit}
                    onChange={handleTextChange}
                    placeholder="ex: pontos, %"
                    error={!!errors.unit}
                    helperText={errors.unit || 'Ex: palavras por minuto, % acertos'}
                    required
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Seção: Atingível */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                A - Atingível
              </Typography>

              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 2, borderColor: errors.achievementSteps ? 'error.main' : 'divider' }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Passos para atingir a meta:
                </Typography>

                {formData.achievementSteps.map((step, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                    <TextField
                      fullWidth
                      label={`Passo ${index + 1}`}
                      value={step}
                      onChange={(e) => handleStepChange(index, e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeStep(index)}
                      disabled={formData.achievementSteps.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  startIcon={<AddIcon />}
                  onClick={addStep}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Adicionar Passo
                </Button>

                {errors.achievementSteps && (
                  <FormHelperText error>{errors.achievementSteps}</FormHelperText>
                )}
              </Paper>

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.skills}
                onChange={handleSkillsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Habilidades relacionadas"
                    placeholder="Digite e pressione Enter"
                    helperText="Adicione habilidades a serem desenvolvidas"
                  />
                )}
              />
            </Grid>

            {/* Seção: Relevante */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                R - Relevante
              </Typography>
              <TextField
                fullWidth
                label="Relevância"
                name="relevance"
                value={formData.relevance}
                onChange={handleTextChange}
                multiline
                rows={2}
                error={!!errors.relevance}
                helperText={errors.relevance || 'Por que esta meta é importante para o aluno?'}
                required
              />
            </Grid>

            {/* Seção: Temporal */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2, color: 'primary.main' }}>
                T - Temporal
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Data de Início"
                    value={formData.startDate}
                    onChange={(date) => handleDateChange(date, 'startDate')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.startDate,
                        helperText: errors.startDate,
                        required: true
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Data Alvo (Conclusão)"
                    value={formData.targetDate}
                    onChange={(date) => handleDateChange(date, 'targetDate')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.targetDate,
                        helperText: errors.targetDate,
                        required: true
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Status da Meta */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleSelectChange(e as any, 'status')}
                  label="Status"
                >
                  <MenuItem value="não iniciada">Não Iniciada</MenuItem>
                  <MenuItem value="em andamento">Em Andamento</MenuItem>
                  <MenuItem value="atrasada">Atrasada</MenuItem>
                  <MenuItem value="concluída">Concluída</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Responsáveis */}
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.responsibleUsers}
                onChange={handleResponsibleChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Responsáveis"
                    placeholder="Adicione responsáveis"
                  />
                )}
              />
            </Grid>

            {/* Intervenções Relacionadas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Intervenções Relacionadas
              </Typography>

              <Autocomplete
                multiple
                options={interventionsLibrary.map(i => i.id)}
                getOptionLabel={(optionId) => {
                  const intervention = interventionsLibrary.find(i => i.id === optionId);
                  return intervention ? intervention.title : '';
                }}
                value={formData.interventions}
                onChange={handleInterventionsChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Intervenções"
                    placeholder="Selecione intervenções relacionadas"
                  />
                )}
                renderOption={(props, optionId) => {
                  const intervention = interventionsLibrary.find(i => i.id === optionId);
                  if (!intervention) return null;

                  return (
                    <ListItem {...props}>
                      <Box sx={{ mr: 2 }}>
                        <Chip
                          label={intervention.tier}
                          size="small"
                          color={
                            intervention.tier === 'Tier 1' ? 'success' :
                            intervention.tier === 'Tier 2' ? 'warning' : 'error'
                          }
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2">{intervention.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {intervention.domain} • {intervention.duration}
                        </Typography>
                      </Box>
                    </ListItem>
                  );
                }}
              />
            </Grid>

            {/* Botões de ação */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  {initialData?.id ? 'Atualizar Meta' : 'Criar Meta'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};
