import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonIcon from '@mui/icons-material/Person';
import { StudentRiskData } from '@/types/risk-analysis';
import RiskLevelBadge from './RiskLevelBadge';

interface StudentRiskTableProps {
  data: StudentRiskData[];
  isLoading?: boolean;
  title?: string;
  onStudentClick?: (studentId: string) => void;
}

// Função para ordenação de dados
type Order = 'asc' | 'desc';
type OrderByKey = 'name' | 'grade' | 'riskScore' | 'changeTrend';

const StudentRiskTable: React.FC<StudentRiskTableProps> = ({
  data,
  isLoading = false,
  title = 'Estudantes em Risco',
  onStudentClick,
}) => {
  // Estado para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Estado para ordenação
  const [order, setOrder] = useState<Order>('desc');
  const [orderBy, setOrderBy] = useState<OrderByKey>('riskScore');

  // Estado para linha expandida
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Manipuladores de eventos
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: OrderByKey) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleExpandClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Função de ordenação
  const sortData = (data: StudentRiskData[], orderBy: OrderByKey, order: Order) => {
    return [...data].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      // Ordenação especial para tendências
      if (orderBy === 'changeTrend') {
        const trendOrder = { 'improving': 0, 'stable': 1, 'worsening': 2 };
        aValue = trendOrder[a.changeTrend];
        bValue = trendOrder[b.changeTrend];
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  };

  // Preparação dos dados
  const sortedData = sortData(data, orderBy, order);
  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Renderização condicional para loading
  if (isLoading) {
    return (
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 400,
          p: 2
        }}
      >
        <CircularProgress size={40} />
      </Paper>
    );
  }

  // Renderização condicional para dados vazios
  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 400,
          p: 2
        }}
      >
        <Typography color="text.secondary">Nenhum dado de estudante disponível</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ width: '100%' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
        <Typography variant="h6">{title}</Typography>
      </Box>
      <TableContainer>
        <Table aria-label="tabela de risco de estudantes">
          <TableHead>
            <TableRow>
              <TableCell width="50px" />
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleRequestSort('name')}
                >
                  Estudante
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'grade'}
                  direction={orderBy === 'grade' ? order : 'asc'}
                  onClick={() => handleRequestSort('grade')}
                >
                  Série
                </TableSortLabel>
              </TableCell>
              <TableCell>Nível de Risco</TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'riskScore'}
                  direction={orderBy === 'riskScore' ? order : 'asc'}
                  onClick={() => handleRequestSort('riskScore')}
                >
                  Pontuação
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'changeTrend'}
                  direction={orderBy === 'changeTrend' ? order : 'asc'}
                  onClick={() => handleRequestSort('changeTrend')}
                >
                  Tendência
                </TableSortLabel>
              </TableCell>
              <TableCell>Última Avaliação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((student) => (
              <React.Fragment key={student.id}>
                <TableRow
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                  onClick={() => onStudentClick && onStudentClick(student.id)}
                >
                  <TableCell>
                    <IconButton
                      aria-label="expandir linha"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExpandClick(student.id);
                      }}
                    >
                      {expandedId === student.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon color="primary" />
                      {student.name}
                    </Box>
                  </TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>
                    <RiskLevelBadge level={student.riskLevel} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      fontWeight="bold"
                      color={student.riskScore < 50 ? 'error' : student.riskScore < 70 ? 'warning.main' : 'success.main'}
                    >
                      {student.riskScore}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {student.changeTrend === 'improving' ? (
                      <Chip
                        icon={<KeyboardArrowDownIcon color="success" />}
                        label="Melhorando"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    ) : student.changeTrend === 'worsening' ? (
                      <Chip
                        icon={<KeyboardArrowUpIcon color="error" />}
                        label="Piorando"
                        color="error"
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Chip
                        label="Estável"
                        color="default"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>{new Date(student.lastAssessment).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                    <Collapse in={expandedId === student.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Typography variant="h6" gutterBottom component="div">
                          Detalhes por Domínio
                        </Typography>
                        <Table size="small" aria-label="domínios">
                          <TableHead>
                            <TableRow>
                              <TableCell>Domínio</TableCell>
                              <TableCell align="right">Pontuação</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(student.domains).map(([domain, data]) => (
                              <TableRow key={domain}>
                                <TableCell component="th" scope="row">
                                  {domain.charAt(0).toUpperCase() + domain.slice(1)}
                                </TableCell>
                                <TableCell align="right">
                                  <Tooltip title={`Limite: ${data.threshold}`} arrow>
                                    <Typography
                                      fontWeight="bold"
                                      color={
                                        data.status === 'critical' ? 'error' :
                                        data.status === 'at-risk' ? 'warning.main' :
                                        data.status === 'on-track' ? 'primary.main' :
                                        'success.main'
                                      }
                                    >
                                      {data.score}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      data.status === 'critical' ? 'Crítico' :
                                      data.status === 'at-risk' ? 'Em Risco' :
                                      data.status === 'on-track' ? 'Adequado' :
                                      'Acima da Média'
                                    }
                                    color={
                                      data.status === 'critical' ? 'error' :
                                      data.status === 'at-risk' ? 'warning' :
                                      data.status === 'on-track' ? 'primary' :
                                      'success'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>

                        {student.interventions.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Intervenções Atuais
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {student.interventions.map((intervention, index) => (
                                <Chip
                                  key={index}
                                  label={intervention}
                                  color="info"
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Paper>
  );
};

export default StudentRiskTable;
