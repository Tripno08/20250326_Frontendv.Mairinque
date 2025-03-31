import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  Checkbox,
  FormGroup,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Timer as TimerIcon,
  OfflineBolt as OfflineIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { screeningService } from '../../services/screeningService';
import {
  ScreeningInstrument,
  ScreeningAdministration,
  ScreeningResponse,
  ScreeningAdministrationFormProps,
  Question,
  QuestionType,
} from '../../types/screening';

export const ScreeningAdministrationForm: React.FC<ScreeningAdministrationFormProps> = ({
  instrument,
  studentId,
  onComplete,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [administration, setAdministration] = useState<ScreeningAdministration | null>(null);
  const [responses, setResponses] = useState<ScreeningResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    const startAdministration = async () => {
      try {
        setLoading(true);
        const admin = await screeningService.startAdministration(
          instrument.id,
          studentId,
          'current-user-id' // TODO: Substituir pelo ID real do usuário
        );
        setAdministration(admin);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao iniciar administração'));
      } finally {
        setLoading(false);
      }
    };

    startAdministration();
  }, [instrument.id, studentId]);

  useEffect(() => {
    if (!administration) return;

    // Iniciar timer se o instrumento tiver limite de tempo
    if (instrument.administrationTime > 0) {
      setTimeRemaining(instrument.administrationTime * 60);
    }

    // Monitorar conexão
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [administration, instrument.administrationTime]);

  useEffect(() => {
    if (timeRemaining === null) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleResponse = (questionId: string, value: string | number | boolean | string[]) => {
    setResponses(prev => {
      const existingIndex = prev.findIndex(r => r.questionId === questionId);
      if (existingIndex >= 0) {
        return prev.map((r, i) =>
          i === existingIndex ? { ...r, value, timestamp: new Date() } : r
        );
      }
      return [...prev, { questionId, value, timestamp: new Date() }];
    });
  };

  const handleSubmit = async () => {
    if (!administration) return;

    try {
      setLoading(true);
      await screeningService.submitResponses(administration.id, responses);
      onComplete(administration);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao enviar respostas'));
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case 'radio':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.text}</FormLabel>
            <RadioGroup
              value={responses.find(r => r.questionId === question.id)?.value || ''}
              onChange={e => handleResponse(question.id, e.target.value)}
            >
              {question.options?.map((option: string) => (
                <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">{question.text}</FormLabel>
            <FormGroup>
              {question.options?.map((option: string) => (
                <FormControlLabel
                  key={option}
                  control={
                    <Checkbox
                      checked={(
                        (responses.find(r => r.questionId === question.id)?.value as string[]) || []
                      ).includes(option)}
                      onChange={e => {
                        const currentValue =
                          (responses.find(r => r.questionId === question.id)?.value as string[]) ||
                          [];
                        const newValue = e.target.checked
                          ? [...currentValue, option]
                          : currentValue.filter(v => v !== option);
                        handleResponse(question.id, newValue);
                      }}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      case 'slider':
        return (
          <Box sx={{ width: '100%' }}>
            <Typography gutterBottom>{question.text}</Typography>
            <Slider
              value={
                (responses.find(r => r.questionId === question.id)?.value as number) ||
                question.min ||
                0
              }
              onChange={(_, value) => handleResponse(question.id, value as number)}
              min={question.min || 0}
              max={question.max || 100}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
        );

      case 'text':
        return (
          <TextField
            fullWidth
            label={question.text}
            value={(responses.find(r => r.questionId === question.id)?.value as string) || ''}
            onChange={e => handleResponse(question.id, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error.message}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{instrument.name}</Typography>
        <Box>
          {timeRemaining !== null && (
            <Tooltip title="Tempo restante">
              <IconButton>
                <TimerIcon />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {Math.floor(timeRemaining / 60)}:
                  {(timeRemaining % 60).toString().padStart(2, '0')}
                </Typography>
              </IconButton>
            </Tooltip>
          )}
          {isOffline && (
            <Tooltip title="Modo offline">
              <IconButton color="warning">
                <OfflineIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Instruções">
            <IconButton onClick={() => setShowInstructions(!showInstructions)}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {showInstructions && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {instrument.instructions}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {instrument.questions.map((_, index: number) => (
          <Step key={index}>
            <StepLabel>Questão {index + 1}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mb: 3 }}>{renderQuestion(instrument.questions[activeStep], activeStep)}</Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
        >
          Anterior
        </Button>
        <Box>
          <Button onClick={onCancel} sx={{ mr: 1 }}>
            Cancelar
          </Button>
          {activeStep === instrument.questions.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              Finalizar
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() =>
                setActiveStep(prev => Math.min(instrument.questions.length - 1, prev + 1))
              }
            >
              Próxima
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
