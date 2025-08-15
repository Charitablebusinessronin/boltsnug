import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { catalyst, CatalystUser } from '../lib/catalyst';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const convertCatalystUserToUser = (catalystUser: CatalystUser): User => {
    const roleName = catalystUser.user_role_details?.role_name || 'Client';
    const role = catalyst.mapCatalystRoleToAppRole(roleName);
    
    return {
      id: catalystUser.user_id,
      email: catalystUser.email_id,
      name: `${catalystUser.first_name} ${catalystUser.last_name || ''}`.trim() || catalystUser.email_id.split('@')[0],
      role: role,
      avatar: undefined, // Catalyst doesn't provide avatar by default
      lastLogin: new Date().toISOString()
    };
  };

  useEffect(() => {
    const initCatalyst = async () => {
      try {
        await catalyst.initialize();
        
        // Check if user is already authenticated with Catalyst
        const catalystUser = await catalyst.getCurrentUser();
        if (catalystUser) {
          const user = convertCatalystUserToUser(catalystUser);
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initCatalyst();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const catalystUser = await catalyst.signIn(email, password);
      
      if (catalystUser) {
        const user = convertCatalystUserToUser(catalystUser);

        // Store user session
        localStorage.setItem('snugs-user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: 'Authentication failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await catalyst.signOut();
    } catch (error) {
      console.error('Catalyst sign out error:', error);
    }
    
    localStorage.removeItem('snugs-user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  return {
    ...authState,
    signIn,
    signOut
  };
};