import React from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { DashboardLayout } from './components/DashboardLayout';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { ContractorDashboard } from './components/dashboards/ContractorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { EmployeeDashboard } from './components/dashboards/EmployeeDashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoadingFullscreen } from './components/common/Loading';

function App() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFullscreen />;
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
    <ErrorBoundary>
      <DashboardLayout user={user}>
        {renderDashboard()}
      </DashboardLayout>
    </ErrorBoundary>
  );
}

export default App;