import React from 'react';
import { Bell, Search, Settings, LogOut } from 'lucide-react';
import { User } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  user: User;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const { signOut } = useAuth();

  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      client: 'Client Portal',
      contractor: 'Contractor Portal',
      admin: 'Admin Portal',
      employee: 'Employee Portal'
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  return (
    <header className="bg-white border-b border-accent/20 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-primary">
            {getRoleDisplayName(user.role)}
          </h1>
          <p className="font-ui text-primary/60 text-sm">
            Welcome back, {user.name}
          </p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-80 border border-accent/30 rounded-lg font-ui text-sm focus:ring-2 focus:ring-luxury focus:border-luxury transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-primary/60 hover:text-primary hover:bg-accent/10 rounded-lg transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-luxury rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-primary/60 hover:text-primary hover:bg-accent/10 rounded-lg transition-all duration-200">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-accent/20">
            <div className="text-right">
              <p className="font-ui font-medium text-primary text-sm">{user.name}</p>
              <p className="font-ui text-primary/60 text-xs capitalize">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-luxury to-luxury-light flex items-center justify-center">
              <span className="font-ui font-semibold text-primary text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={signOut}
              className="p-2 text-primary/60 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};