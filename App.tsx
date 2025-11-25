
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WebsiteLayout } from './layouts/WebsiteLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout'; // New Layout
import { Home } from './pages/Public/Home';
import { Features } from './pages/Public/Features';
import { Products } from './pages/Public/Products';
import { About } from './pages/Public/About';
import { WhoWeSupport } from './pages/Public/WhoWeSupport';
import { Pricing } from './pages/Public/Pricing';
import { Contact } from './pages/Public/Contact';
import { AuthPage } from './pages/Auth/AuthPage';
import { DashboardOverview } from './pages/Dashboard/DashboardOverview';
import { Campaigns } from './pages/Dashboard/Campaigns';
import { CampaignDetails } from './pages/Dashboard/CampaignDetails';
import { PlanTier } from './types';
import { BillingSettings } from './pages/Dashboard/BillingSettings';
import { WhatsAppConnector } from './pages/Dashboard/WhatsAppConnector';
import { BillingSettings } from './pages/Dashboard/BillingSettings';

// Admin Pages
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { ContentManager } from './pages/Admin/ContentManager';
import { PricingManager } from './pages/Admin/PricingManager';

// Placeholder components for routes not fully implemented
const Placeholder: React.FC<{title: string}> = ({title}) => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-slate-400">
    <h1 className="text-3xl font-bold mb-4 text-slate-600 dark:text-slate-300">{title}</h1>
    <p>This module is under development.</p>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN' | null>(null);
  const [userPlan, setUserPlan] = useState<PlanTier>('Starter');

  const handleLogin = (role: 'USER' | 'ADMIN' = 'USER', plan: PlanTier = 'Starter') => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserPlan(plan);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserPlan('Starter');
  };

  return (
    <HashRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route element={isAuthenticated ? (userRole === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <WebsiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/products" element={<Products />} />
          <Route path="/who-we-support" element={<WhoWeSupport />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/partners" element={<Placeholder title="Partners" />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth Routes */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? (userRole === 'ADMIN' ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />) : <AuthPage onLogin={handleLogin} />} 
        />

        {/* Protected Dashboard Routes (User) */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated && userRole === 'USER' ? <DashboardLayout onLogout={handleLogout} plan={userPlan} /> : <Navigate to="/auth" />}
        >
          <Route index element={<DashboardOverview />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetails />} />
          <Route path="audience" element={<Placeholder title="Audience Management" />} />
          <Route path="whatsapp" element={<WhatsAppConnector />} />
          <Route path="integrations" element={<Placeholder title="Social Integrations" />} />
          <Route path="automation" element={<Placeholder title="Automation Builder" />} />
          <Route path="settings" element={<BillingSettings plan={userPlan} />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route 
          path="/admin"
          element={isAuthenticated && userRole === 'ADMIN' ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/auth" />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="media" element={<Placeholder title="Media Library" />} />
          <Route path="settings" element={<Placeholder title="Admin Settings" />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
