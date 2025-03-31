import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IntegrationsRoutes from './integrations';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/integrations/*" element={<IntegrationsRoutes />} />
    </Routes>
  );
}
