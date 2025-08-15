import { useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';
import { catalyst } from '../lib/catalyst';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const initCatalyst = async () => {
      try {
        await catalyst.initialize();
        
        // Check if user is already authenticated with Catalyst
        const currentUser = await catalyst.getCurrentUser();
        if (currentUser) {
          const user: User = {
            id: currentUser.user_id || currentUser.id,
            email: currentUser.email_id || currentUser.email,
            name: currentUser.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : currentUser.email?.split('@')[0] || 'User',
            role: currentUser.role || 'client',
            avatar: currentUser.profile_picture,
            lastLogin: new Date().toISOString()
          };
          
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

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const catalystUser = await catalyst.signIn(email, password);
      
      if (catalystUser) {
        // Determine user role based on email domain or Catalyst user data
        const role = catalystUser.role || 
                    (email.includes('admin') ? 'admin' : 
                     email.includes('employee') ? 'employee' :
                     email.includes('contractor') ? 'contractor' : 'client');
        
        const user: User = {
          id: catalystUser.user_id || catalystUser.id,
          email: catalystUser.email_id || email,
          name: catalystUser.first_name ? `${catalystUser.first_name} ${catalystUser.last_name || ''}`.trim() : email.split('@')[0],
          role,
          avatar: catalystUser.profile_picture,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem('snugs-user', JSON.stringify(user));
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
        
        return true;
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return false;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
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