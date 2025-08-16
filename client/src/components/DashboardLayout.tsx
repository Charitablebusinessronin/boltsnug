import React from 'react';
import { User } from '../types/auth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar user={user} />
        <div className="flex-1 ml-0 lg:ml-64">
          <Header user={user} />
          <main className="p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};