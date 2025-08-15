import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { DashboardLayout } from './components/DashboardLayout';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { ContractorDashboard } from './components/dashboards/ContractorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { EmployeeDashboard } from './components/dashboards/EmployeeDashboard';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginForm />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'client':
        return <ClientDashboard />;
      case 'contractor':
        return <ContractorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'employee':
        return <EmployeeDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <DashboardLayout user={user}>
      {renderDashboard()}
    </DashboardLayout>
  );
}

export default App;