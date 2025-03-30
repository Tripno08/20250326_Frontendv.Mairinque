import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  Divider,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import InfoIcon from '@mui/icons-material/Info';
import { RiskAnalysisDashboardProps, RiskAnalysisFilters, RiskLevel } from '@/types/risk-analysis';
import { useRiskAnalysisDashboard } from '@/hooks/useRiskAnalysis';
import RiskDistributionChart from './RiskDistributionChart';
import RiskTrendChart from './RiskTrendChart';
import RiskProjectionChart from './RiskProjectionChart';
import StudentRiskTable from './StudentRiskTable';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`risk-tabpanel-${index}`}
      aria-labelledby={`risk-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `risk-tab-${index}`,
    'aria-controls': `risk-tabpanel-${index}`,
  };
};

const RiskAnalysisDashboard: React.FC<RiskAnalysisDashboardProps> = (props) => {
  const [tabValue, setTabValue] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RiskAnalysisFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>([]);

  // Usar o hook para buscar todos os dados ou passar dados via props
  const {
    studentRiskData = props.studentRiskData || [],
    riskTrendData = props.riskTrendData || [],
    riskProjectionData = props.riskProjectionData || [],
    riskPatternData = props.riskPatternData || [],
    riskDistributionData = props.riskDistributionData || null,
    riskFactorData = props.riskFactorData || [],
    earlyWarningIndicators = props.earlyWarningIndicators || [],
    isLoading = props.isLoading || false,
    refetch,
    setFilters: setApiFilters
  } = useRiskAnalysisDashboard();

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleApplyFilters = () => {
    const newFilters: RiskAnalysisFilters = {
      grades: selectedGrades.length > 0 ? selectedGrades : undefined,
      riskLevels: selectedRiskLevels.length > 0 ? selectedRiskLevels : undefined,
      searchTerm: searchTerm.length > 0 ? searchTerm : undefined
    };

    setApiFilters(newFilters);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setSelectedGrades([]);
    setSelectedRiskLevels([]);
    setSearchTerm('');
    setApiFilters({});
    setFilters({});
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleGradeChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedGrades(typeof value === 'string' ? value.split(',') : value);
  };

  const handleRiskLevelChange = (event: SelectChangeEvent<RiskLevel[]>) => {
    const value = event.target.value;
    setSelectedRiskLevels(typeof value === 'string' ? [value as RiskLevel] : value as RiskLevel[]);
  };

  // Obter grades distintas para filtro
  const availableGrades = React.useMemo(() => {
    return Array.from(new Set(studentRiskData.map(student => student.grade)));
  }, [studentRiskData]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard de Análise de Risco
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Monitore, analise e preveja riscos acadêmicos para intervenção precoce
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch && refetch()}
            disabled={isLoading}
          >
            Atualizar
          </Button>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => props.onExportData && props.onExportData('csv')}
          >
            Exportar
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      {showFilters && (
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pesquisar estudante"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="grade-select-label">Série</InputLabel>
                <Select
                  labelId="grade-select-label"
                  id="grade-select"
                  multiple
                  value={selectedGrades}
                  onChange={handleGradeChange}
                  label="Série"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableGrades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="risk-level-select-label">Nível de Risco</InputLabel>
                <Select
                  labelId="risk-level-select-label"
                  id="risk-level-select"
                  multiple
                  value={selectedRiskLevels}
                  onChange={handleRiskLevelChange}
                  label="Nível de Risco"
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as RiskLevel[]).map((value) => (
                        <Chip
                          key={value}
                          label={
                            value === 'low' ? 'Baixo' :
                            value === 'moderate' ? 'Moderado' :
                            value === 'high' ? 'Alto' :
                            'Severo'
                          }
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="low">Baixo</MenuItem>
                  <MenuItem value="moderate">Moderado</MenuItem>
                  <MenuItem value="high">Alto</MenuItem>
                  <MenuItem value="severe">Severo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyFilters}
                  size="small"
                >
                  Aplicar
                </Button>

                <Button
                  variant="outlined"
                  onClick={handleResetFilters}
                  size="small"
                >
                  Limpar
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Chips para filtros aplicados */}
          {(filters.grades?.length || filters.riskLevels?.length || filters.searchTerm) && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Filtros ativos:
              </Typography>

              {filters.searchTerm && (
                <Chip
                  label={`Busca: ${filters.searchTerm}`}
                  size="small"
                  onDelete={() => {
                    setSearchTerm('');
                    setApiFilters({ ...filters, searchTerm: undefined });
                  }}
                />
              )}

              {filters.grades?.map(grade => (
                <Chip
                  key={grade}
                  label={`Série: ${grade}`}
                  size="small"
                  onDelete={() => {
                    const newGrades = selectedGrades.filter(g => g !== grade);
                    setSelectedGrades(newGrades);
                    setApiFilters({ ...filters, grades: newGrades.length > 0 ? newGrades : undefined });
                  }}
                />
              ))}

              {filters.riskLevels?.map(level => (
                <Chip
                  key={level}
                  label={`Risco: ${
                    level === 'low' ? 'Baixo' :
                    level === 'moderate' ? 'Moderado' :
                    level === 'high' ? 'Alto' :
                    'Severo'
                  }`}
                  size="small"
                  onDelete={() => {
                    const newLevels = selectedRiskLevels.filter(l => l !== level);
                    setSelectedRiskLevels(newLevels);
                    setApiFilters({ ...filters, riskLevels: newLevels.length > 0 ? newLevels : undefined });
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && (
        <>
          {/* Primeira linha - Visão geral */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <RiskDistributionChart
                data={riskDistributionData}
                title="Distribuição de Níveis de Risco"
                height={300}
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <RiskTrendChart
                data={riskTrendData}
                title="Tendências de Risco"
                height={300}
              />
            </Grid>
          </Grid>

          {/* Segunda linha - Projeções e Estudantes */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <RiskProjectionChart
                data={riskProjectionData}
                title="Projeções de Risco"
                height={350}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="tabs de risco"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Estudantes em Risco" {...a11yProps(0)} />
                  <Tab label="Alertas Precoces" {...a11yProps(1)} />
                  <Tab label="Fatores de Risco" {...a11yProps(2)} />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <StudentRiskTable
                    data={studentRiskData}
                    title="Estudantes em Situação de Risco"
                    onStudentClick={props.onStudentClick}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Alertas Precoces
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Indicadores que sinalizam potenciais dificuldades acadêmicas
                    </Typography>

                    {earlyWarningIndicators.map((indicator) => (
                      <Box key={indicator.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {indicator.name}
                          </Typography>
                          <Chip
                            size="small"
                            color={
                              indicator.status === 'normal' ? 'success' :
                              indicator.status === 'warning' ? 'warning' :
                              'error'
                            }
                            label={
                              indicator.status === 'normal' ? 'Normal' :
                              indicator.status === 'warning' ? 'Alerta' :
                              'Crítico'
                            }
                          />
                        </Box>

                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {indicator.description}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">
                            Valor atual: <b>{indicator.currentValue}</b> (Limite: {indicator.threshold})
                          </Typography>
                          <Typography variant="body2">
                            Afeta {indicator.affectedStudents} estudantes
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Paper>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Fatores de Risco
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Principais fatores correlacionados com baixo desempenho acadêmico
                    </Typography>

                    {riskFactorData.map((factor, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="medium">
                              {factor.factor}
                            </Typography>
                            <Chip
                              size="small"
                              label={`${(factor.weight * 100).toFixed(0)}%`}
                              color={
                                factor.significance === 'high' ? 'error' :
                                factor.significance === 'medium' ? 'warning' :
                                'success'
                              }
                              sx={{ ml: 1 }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {factor.students} estudantes
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            height: 8,
                            bgcolor: 'grey.200',
                            borderRadius: 1,
                            mb: 2
                          }}
                        >
                          <Box
                            sx={{
                              height: '100%',
                              width: `${factor.weight * 100}%`,
                              bgcolor:
                                factor.significance === 'high' ? 'error.main' :
                                factor.significance === 'medium' ? 'warning.main' :
                                'success.main',
                              borderRadius: 1
                            }}
                          />
                        </Box>

                        {index < riskFactorData.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </Paper>
                </TabPanel>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default RiskAnalysisDashboard;
