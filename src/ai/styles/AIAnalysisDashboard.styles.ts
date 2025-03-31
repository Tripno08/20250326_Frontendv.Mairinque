import { Theme } from '@mui/material/styles';

export const styles = (theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  cardHeader: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  cardContent: {
    flexGrow: 1,
  },
  summaryMetricValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  chartContainer: {
    height: 300,
    marginTop: theme.spacing(2),
  },
  anomalyCard: {
    borderLeft: `4px solid ${theme.palette.error.main}`,
  },
  trendCard: {
    borderLeft: `4px solid ${theme.palette.success.main}`,
  },
  metricLabel: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  },
  metricValue: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },
  errorAlert: {
    margin: theme.spacing(2),
  },
});
