import React from 'react';
import Head from 'next/head';
import { Container, Box, Typography } from '@mui/material';
import RiskAnalysisDashboard from '@/components/risk/RiskAnalysisDashboard';
import { useRouter } from 'next/router';

const RiskAnalysisPage: React.FC = () => {
  const router = useRouter();

  const handleStudentClick = (studentId: string) => {
    console.log(`Navegando para perfil do estudante ${studentId}`);
    // Em um ambiente de produção, redirecionaria para a página do estudante
    // router.push(`/students/${studentId}`);
  };

  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    console.log(`Exportando dados em formato ${format}`);
    // Implementaria a exportação real aqui
  };

  return (
    <>
      <Head>
        <title>Análise de Risco Acadêmico | Innerview</title>
        <meta name="description" content="Dashboard para análise de risco acadêmico e identificação precoce de dificuldades" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <RiskAnalysisDashboard
          onStudentClick={handleStudentClick}
          onExportData={handleExportData}
        />
      </Container>
    </>
  );
};

export default RiskAnalysisPage;
