export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'contractor' | 'admin' | 'employee';
  avatar?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}