'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  FormHelperText,
  InputAdornment,
  Autocomplete,
  Stack,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import type {
  GoalFormProps,
  SmartGoalFormData,
  GoalStatus,
  GoalPriority,
} from '@/types/smart-goals';
import type { Intervention } from '@/types/intervention';
import GridContainer from '@/components/GridContainer';
import GridItem from '@/components/GridItem';
import MenuItemWrapper from '@/components/MenuItemWrapper';
import ListItemWrapper from '@/components/ListItemWrapper';

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
  'Outro',
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
  onCancel,
}) => {
  // Estado do formulário
  const [formData, setFormData] = useState<SmartGoalFormData>({
    ...emptyFormData,
    ...initialData,
    studentId,
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
  const handleSelectChange = (
    e: React.ChangeEvent<{ name?: string; value: unknown }>,
    name: string
  ) => {
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
      achievementSteps: newSteps,
    }));
  };

  // Adicionar novo passo
  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      achievementSteps: [...prev.achievementSteps, ''],
    }));
  };

  // Remover passo
  const removeStep = (index: number) => {
    const newSteps = [...formData.achievementSteps];
    newSteps.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      achievementSteps: newSteps.length > 0 ? newSteps : [''],
    }));
  };

  // Manipulador para habilidades (skills)
  const handleSkillsChange = (event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      skills: newValue,
    }));
  };

  // Manipulador para intervenções
  const handleInterventionsChange = (event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      interventions: newValue,
    }));
  };

  // Manipulador para responsáveis
  const handleResponsibleChange = (event: React.SyntheticEvent, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      responsibleUsers: newValue,
    }));
  };

  // Validação do formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Campos obrigatórios
    if (!formData.title.trim()) newErrors.title = 'O título é obrigatório';
    if (!formData.specificDetails.trim())
      newErrors.specificDetails = 'Os detalhes específicos são obrigatórios';
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
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          {initialData?.id ? 'Editar Meta SMART' : 'Nova Meta SMART'}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={handleSubmit}>
          <GridContainer spacing={3}>
            {/* Título */}
            <GridItem xs={12}>
              <TextField
                fullWidth
                label="Título da Meta"
                name="title"
                value={formData.title}
                onChange={handleTextChange}
                error={!!errors.title}
                helperText={errors.title || 'Digite um título claro e específico para a meta'}
              />
            </GridItem>

            {/* Descrição */}
            <GridItem xs={12}>
              <TextField
                fullWidth
                label="Descrição Geral"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                multiline
                rows={2}
                helperText="Descreva brevemente o objetivo desta meta"
              />
            </GridItem>

            {/* Domínio e Prioridade */}
            <GridItem xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.domain}>
                <InputLabel id="domain-label">Domínio</InputLabel>
                <Select
                  labelId="domain-label"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={e => handleSelectChange(e as any, 'domain')}
                  label="Domínio"
                >
                  {DOMAINS.map(domain => (
                    <MenuItemWrapper key={domain} value={domain}>
                      {domain}
                    </MenuItemWrapper>
                  ))}
                </Select>
                {errors.domain && <FormHelperText>{errors.domain}</FormHelperText>}
              </FormControl>
            </GridItem>

            <GridItem xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Prioridade</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={e => handleSelectChange(e as any, 'priority')}
                  label="Prioridade"
                >
                  <MenuItemWrapper value="crítica">Crítica</MenuItemWrapper>
                  <MenuItemWrapper value="alta">Alta</MenuItemWrapper>
                  <MenuItemWrapper value="média">Média</MenuItemWrapper>
                  <MenuItemWrapper value="baixa">Baixa</MenuItemWrapper>
                </Select>
              </FormControl>
            </GridItem>

            {/* Detalhes específicos */}
            <GridItem xs={12}>
              <TextField
                fullWidth
                label="Detalhes Específicos"
                name="specificDetails"
                value={formData.specificDetails}
                onChange={handleTextChange}
                multiline
                rows={3}
                error={!!errors.specificDetails}
                helperText={
                  errors.specificDetails ||
                  'Descreva detalhadamente o que deve ser alcançado, com critérios específicos e mensuráveis'
                }
              />
            </GridItem>

            {/* Valores e Unidade */}
            <GridItem xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Inicial"
                name="initialValue"
                type="number"
                value={formData.initialValue}
                onChange={handleTextChange}
                error={!!errors.initialValue}
                helperText={errors.initialValue}
                InputProps={{
                  endAdornment: formData.unit ? (
                    <InputAdornment position="end">{formData.unit}</InputAdornment>
                  ) : null,
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={4}>
              <TextField
                fullWidth
                label="Valor Alvo"
                name="targetValue"
                type="number"
                value={formData.targetValue}
                onChange={handleTextChange}
                error={!!errors.targetValue}
                helperText={errors.targetValue}
                InputProps={{
                  endAdornment: formData.unit ? (
                    <InputAdornment position="end">{formData.unit}</InputAdornment>
                  ) : null,
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unidade de Medida"
                name="unit"
                value={formData.unit}
                onChange={handleTextChange}
                error={!!errors.unit}
                helperText={errors.unit || 'Ex: %, pontos, palavras por minuto'}
              />
            </GridItem>

            {/* Datas */}
            <GridItem xs={12} sm={6}>
              <DatePicker
                label="Data de Início"
                value={formData.startDate}
                onChange={date => handleDateChange(date, 'startDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                  },
                }}
              />
            </GridItem>

            <GridItem xs={12} sm={6}>
              <DatePicker
                label="Data Alvo"
                value={formData.targetDate}
                onChange={date => handleDateChange(date, 'targetDate')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.targetDate,
                    helperText: errors.targetDate,
                  },
                }}
              />
            </GridItem>

            {/* Status da Meta */}
            <GridItem xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={e => handleSelectChange(e as any, 'status')}
                  label="Status"
                >
                  <MenuItemWrapper value="não iniciada">Não Iniciada</MenuItemWrapper>
                  <MenuItemWrapper value="em andamento">Em Andamento</MenuItemWrapper>
                  <MenuItemWrapper value="atrasada">Atrasada</MenuItemWrapper>
                  <MenuItemWrapper value="concluída">Concluída</MenuItemWrapper>
                  <MenuItemWrapper value="cancelada">Cancelada</MenuItemWrapper>
                </Select>
              </FormControl>
            </GridItem>

            {/* Relevância */}
            <GridItem xs={12}>
              <TextField
                fullWidth
                label="Relevância"
                name="relevance"
                value={formData.relevance}
                onChange={handleTextChange}
                multiline
                rows={3}
                error={!!errors.relevance}
                helperText={
                  errors.relevance ||
                  'Explique por que esta meta é importante e como se relaciona com o desenvolvimento educacional do aluno'
                }
              />
            </GridItem>

            {/* Passos para alcançar a meta */}
            <GridItem xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Passos para alcançar a meta
              </Typography>
              {errors.achievementSteps && (
                <FormHelperText error>{errors.achievementSteps}</FormHelperText>
              )}
              {formData.achievementSteps.map((step, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Passo ${index + 1}`}
                    value={step}
                    onChange={e => handleStepChange(index, e.target.value)}
                    size="small"
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
                Adicionar passo
              </Button>
            </GridItem>

            {/* Habilidades */}
            <GridItem xs={12}>
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
                      key={option}
                    />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Habilidades a serem desenvolvidas"
                    placeholder="Digite e pressione Enter"
                    helperText="Digite as habilidades que serão desenvolvidas e pressione Enter"
                  />
                )}
              />
            </GridItem>

            {/* Intervenções relacionadas */}
            <GridItem xs={12}>
              <Autocomplete
                multiple
                options={interventionsLibrary}
                value={formData.interventions}
                onChange={handleInterventionsChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Intervenções Relacionadas"
                    placeholder="Selecione ou digite novas intervenções"
                  />
                )}
                freeSolo
              />
            </GridItem>

            {/* Responsáveis */}
            <GridItem xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={formData.responsibleUsers}
                onChange={handleResponsibleChange}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => <Chip label={option} {...getTagProps({ index })} />)
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Responsáveis"
                    placeholder="Digite os nomes dos responsáveis"
                  />
                )}
              />
            </GridItem>

            {/* Botões */}
            <GridItem xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                <Button variant="outlined" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button variant="contained" type="submit" color="primary">
                  {initialData?.id ? 'Atualizar Meta' : 'Criar Meta'}
                </Button>
              </Box>
            </GridItem>
          </GridContainer>
        </form>
      </Paper>
    </LocalizationProvider>
  );
};
