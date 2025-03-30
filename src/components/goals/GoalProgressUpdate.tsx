'use client';

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Slider,
  FormHelperText,
  Divider,
  InputAdornment
} from '@mui/material';
import type { GoalProgressUpdateProps } from '@/types/smart-goals';

export const GoalProgressUpdate: React.FC<GoalProgressUpdateProps> = ({
  goal,
  onUpdate,
  onCancel
}) => {
  // Estados
  const [value, setValue] = useState<number>(goal.measurement.currentValue);
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Valores mínimo e máximo para o progresso
  const minValue = Math.min(goal.measurement.initialValue, goal.measurement.targetValue);
  const maxValue = Math.max(goal.measurement.initialValue, goal.measurement.targetValue);

  // Manipulador para atualização do valor
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    validateValue(newValue);
  };

  // Manipulador para atualização via slider
  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
    validateValue(newValue as number);
  };

  // Manipulador para notas
  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
  };

  // Validação do valor
  const validateValue = (val: number): boolean => {
    if (isNaN(val)) {
      setError('O valor deve ser um número');
      return false;
    }

    setError('');
    return true;
  };

  // Submit do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateValue(value)) {
      onUpdate(goal.id, value, notes);
    }
  };

  // Calcular porcentagem de progresso
  const calculatePercentage = (value: number): number => {
    const { initialValue, targetValue } = goal.measurement;

    // Se o valor alvo é igual ao inicial, consideramos 100% completo se atingido
    if (initialValue === targetValue) {
      return value >= targetValue ? 100 : 0;
    }

    // Se o valor alvo é menor que o inicial (ex: reduzir algo)
    if (targetValue < initialValue) {
      if (value <= targetValue) return 100;
      if (value >= initialValue) return 0;
      return ((initialValue - value) / (initialValue - targetValue)) * 100;
    }

    // Caso normal: valor alvo maior que inicial (ex: aumentar algo)
    if (value >= targetValue) return 100;
    if (value <= initialValue) return 0;
    return ((value - initialValue) / (targetValue - initialValue)) * 100;
  };

  // Formatar valor do slider
  const valuetext = (value: number) => {
    return `${value} ${goal.measurement.unit}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Atualizar Progresso da Meta
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {goal.title}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Typography gutterBottom>
            Valor Atual: {value} {goal.measurement.unit} ({Math.round(calculatePercentage(value))}% concluído)
          </Typography>

          <Slider
            value={value}
            onChange={handleSliderChange}
            aria-labelledby="valor-atual-slider"
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={Math.abs(maxValue - minValue) > 100 ? 1 : 0.1}
            marks={[
              { value: goal.measurement.initialValue, label: `Inicial: ${goal.measurement.initialValue}` },
              { value: goal.measurement.targetValue, label: `Alvo: ${goal.measurement.targetValue}` }
            ]}
            min={minValue}
            max={maxValue}
            valueLabelFormat={valuetext}
          />

          <TextField
            fullWidth
            label={`Valor atual (${goal.measurement.unit})`}
            type="number"
            value={value}
            onChange={handleValueChange}
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: <InputAdornment position="end">{goal.measurement.unit}</InputAdornment>,
            }}
            inputProps={{
              min: minValue,
              max: maxValue,
              step: Math.abs(maxValue - minValue) > 100 ? 1 : 0.1
            }}
            sx={{ mt: 2 }}
          />
        </Box>

        <TextField
          fullWidth
          label="Observações"
          multiline
          rows={4}
          value={notes}
          onChange={handleNotesChange}
          placeholder="Descreva o progresso realizado, dificuldades encontradas ou outras observações relevantes"
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" type="submit">
            Atualizar Progresso
          </Button>
        </Box>
      </form>
    </Paper>
  );
};
