import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IntegrationsPage from '@/pages/integrations';

export default function IntegrationsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<IntegrationsPage />} />
    </Routes>
  );
}
