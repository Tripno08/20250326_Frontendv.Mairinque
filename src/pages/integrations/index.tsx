import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import { IntegrationDashboard } from '@/components/integrations/IntegrationDashboard';
import { LTIConfig } from '@/components/integrations/LTIConfig';
import { MicrosoftConfig } from '@/components/integrations/MicrosoftConfig';
import { GoogleConfig } from '@/components/integrations/GoogleConfig';
import { WebhookConfig } from '@/components/integrations/WebhookConfig';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`integration-tabpanel-${index}`}
      aria-labelledby={`integration-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `integration-tab-${index}`,
    'aria-controls': `integration-tabpanel-${index}`,
  };
}

export default function IntegrationsPage() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Integrações
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="abas de integração"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab label="LTI" {...a11yProps(1)} />
            <Tab label="Microsoft" {...a11yProps(2)} />
            <Tab label="Google" {...a11yProps(3)} />
            <Tab label="Webhooks" {...a11yProps(4)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <IntegrationDashboard />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <LTIConfig />
        </TabPanel>

        <TabPanel value={value} index={2}>
          <MicrosoftConfig />
        </TabPanel>

        <TabPanel value={value} index={3}>
          <GoogleConfig />
        </TabPanel>

        <TabPanel value={value} index={4}>
          <WebhookConfig />
        </TabPanel>
      </Box>
    </Container>
  );
}
