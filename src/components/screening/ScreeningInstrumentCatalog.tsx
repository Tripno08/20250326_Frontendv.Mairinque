import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Compare as CompareIcon,
  Timer as TimerIcon,
  School as SchoolIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { screeningService } from '../../services/screeningService';
import { useScreeningInstrument } from '../../hooks/useScreening';
import {
  ScreeningInstrument,
  ScreeningArea,
  ScreeningCategory,
  ScreeningInstrumentCatalogProps,
} from '../../types/screening';

export const ScreeningInstrumentCatalog: React.FC<ScreeningInstrumentCatalogProps> = ({
  onInstrumentSelect,
  filters,
}) => {
  const [instruments, setInstruments] = useState<ScreeningInstrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<ScreeningInstrument | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<ScreeningInstrument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 18]);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        setLoading(true);
        const data = await screeningService.getInstruments(filters);
        setInstruments(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao buscar instrumentos'));
      } finally {
        setLoading(false);
      }
    };

    fetchInstruments();
  }, [filters]);

  const handleInstrumentClick = (instrument: ScreeningInstrument) => {
    if (compareMode) {
      setSelectedForComparison(prev => {
        if (prev.find(i => i.id === instrument.id)) {
          return prev.filter(i => i.id !== instrument.id);
        }
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, instrument];
      });
    } else {
      setSelectedInstrument(instrument);
    }
  };

  const handleFavoriteToggle = async (instrument: ScreeningInstrument) => {
    try {
      await screeningService.toggleFavoriteInstrument(instrument.id);
      setInstruments(prev =>
        prev.map(i => (i.id === instrument.id ? { ...i, isFavorite: !i.isFavorite } : i))
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao favoritar instrumento'));
    }
  };

  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch =
      instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instrument.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAge =
      instrument.ageRange.min >= ageRange[0] && instrument.ageRange.max <= ageRange[1];
    return matchesSearch && matchesAge;
  });

  const renderInstrumentCard = (instrument: ScreeningInstrument) => {
    const { instrument: favoriteStatus } = useScreeningInstrument(instrument.id);

    return (
      <Card
        key={instrument.id}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: 6,
          },
        }}
        onClick={() => handleInstrumentClick(instrument)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {instrument.name}
            </Typography>
            <IconButton
              onClick={e => {
                e.stopPropagation();
                handleFavoriteToggle(instrument);
              }}
            >
              {favoriteStatus?.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>

          <Typography color="text.secondary" gutterBottom>
            {instrument.description}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip
              icon={<SchoolIcon />}
              label={instrument.area}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<PsychologyIcon />}
              label={instrument.category}
              size="small"
              color="secondary"
              variant="outlined"
            />
            <Chip
              icon={<TimerIcon />}
              label={`${instrument.administrationTime} min`}
              size="small"
              color="info"
              variant="outlined"
            />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Faixa etária: {instrument.ageRange.min} - {instrument.ageRange.max} anos
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const renderComparisonDialog = () => (
    <Dialog open={compareMode} onClose={() => setCompareMode(false)} maxWidth="lg" fullWidth>
      <DialogTitle>Comparar Instrumentos</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {selectedForComparison.map(instrument => (
            <Grid item xs={12} md={4} key={instrument.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{instrument.name}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2">
                    <strong>Tempo de aplicação:</strong> {instrument.administrationTime} min
                  </Typography>
                  <Typography variant="body2">
                    <strong>Faixa etária:</strong> {instrument.ageRange.min} -{' '}
                    {instrument.ageRange.max} anos
                  </Typography>
                  <Typography variant="body2">
                    <strong>Pontos de corte:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Tier 1: {instrument.cutoffPoints.tier1}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Tier 2: {instrument.cutoffPoints.tier2}
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Tier 3: {instrument.cutoffPoints.tier3}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setCompareMode(false)}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );

  const renderInstrumentDetails = () => (
    <Dialog
      open={!!selectedInstrument}
      onClose={() => setSelectedInstrument(null)}
      maxWidth="md"
      fullWidth
    >
      {selectedInstrument && (
        <>
          <DialogTitle>{selectedInstrument.name}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" paragraph>
              {selectedInstrument.description}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Instruções de Aplicação
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedInstrument.instructions}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Pontos de Corte
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body2">
                  <strong>Tier 1:</strong> {selectedInstrument.cutoffPoints.tier1}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  <strong>Tier 2:</strong> {selectedInstrument.cutoffPoints.tier2}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2">
                  <strong>Tier 3:</strong> {selectedInstrument.cutoffPoints.tier3}
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Evidências de Eficácia
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedInstrument.evidence.description}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Referências:
            </Typography>
            <ul>
              {selectedInstrument.evidence.references.map((ref, index) => (
                <li key={index}>
                  <Typography variant="body2">{ref}</Typography>
                </li>
              ))}
            </ul>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Recursos Necessários
            </Typography>
            <ul>
              {selectedInstrument.resources.map((resource, index) => (
                <li key={index}>
                  <Typography variant="body2">{resource}</Typography>
                </li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedInstrument(null)}>Fechar</Button>
            <Button
              variant="contained"
              onClick={() => {
                onInstrumentSelect(selectedInstrument);
                setSelectedInstrument(null);
              }}
            >
              Selecionar Instrumento
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Faixa Etária</InputLabel>
          <Slider
            value={ageRange}
            onChange={(_, newValue) => setAgeRange(newValue as [number, number])}
            valueLabelDisplay="auto"
            min={0}
            max={18}
            marks
          />
        </FormControl>
        <Tooltip title={compareMode ? 'Fechar comparação' : 'Comparar instrumentos'}>
          <IconButton
            color={compareMode ? 'primary' : 'default'}
            onClick={() => setCompareMode(!compareMode)}
          >
            <CompareIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {filteredInstruments.map(instrument => (
          <Grid item xs={12} sm={6} md={4} key={instrument.id}>
            {renderInstrumentCard(instrument)}
          </Grid>
        ))}
      </Grid>

      {renderComparisonDialog()}
      {renderInstrumentDetails()}
    </Box>
  );
};
