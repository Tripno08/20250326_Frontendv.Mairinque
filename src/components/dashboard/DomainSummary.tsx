import React, { useRef, useEffect, useState } from 'react'
import { Box, CircularProgress, Typography, Paper, Grid } from '@mui/material'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface DomainSummaryData {
  reading: number
  math: number
  writing: number
}

interface DomainSummaryProps {
  data: DomainSummaryData
  isLoading?: boolean
  error?: string
  width?: number
  height?: number
}

interface ChartDimensions {
  width: number
  height: number
}

export const DomainSummary: React.FC<DomainSummaryProps> = ({
  data,
  isLoading = false,
  error,
  width: propWidth,
  height: propHeight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: propWidth || 800,
    height: propHeight || 600
  })

  const chartData = [
    { domain: 'Leitura', value: data.reading },
    { domain: 'Matemática', value: data.math },
    { domain: 'Escrita', value: data.writing },
  ]

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current
        setDimensions({
          width: propWidth || Math.max(clientWidth, 300),
          height: propHeight || Math.max(clientHeight, 300)
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [propWidth, propHeight])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Desempenho por Domínio
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box
            ref={containerRef}
            height={dimensions.height}
            width={dimensions.width}
            role="img"
            aria-label="desempenho por domínio"
            sx={{
              minWidth: '300px',
              minHeight: '300px',
              position: 'relative'
            }}
          >
            <RadarChart
              width={dimensions.width}
              height={dimensions.height}
              data={chartData}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="Desempenho"
                dataKey="value"
                stroke="#1976d2"
                fill="#1976d2"
                fillOpacity={0.6}
              />
            </RadarChart>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Detalhes
            </Typography>
            {chartData.map((item) => (
              <Box key={item.domain} mb={1}>
                <Typography variant="body2" color="text.secondary">
                  {item.domain}
                </Typography>
                <Typography variant="h6">
                  {item.value}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}
