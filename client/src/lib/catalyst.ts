// Zoho Catalyst SDK Integration for Healthcare Platform
declare global {
  interface Window {
    catalyst: {
      auth: {
        signIn: (credentials: { email_id: string; password: string }) => Promise<{ status: string; data: CatalystUser; message?: string }>;
        signOut: () => Promise<void>;
        getCurrentUser: () => Promise<{ status: string; data: CatalystUser }>;
      };
      function: {
        execute: (functionName: string, data: unknown) => Promise<unknown>;
      };
    };
  }
}

export interface CatalystConfig {
  projectId: string;
  environment: string;
  domain: string;
}

export interface CatalystUser {
  user_id: string;
  email_id: string;
  first_name: string;
  last_name: string;
  user_role_details: {
    role_name: string;
  };
}

export class CatalystService {
  private static instance: CatalystService;
  private isInitialized = false;
  private config: CatalystConfig;

  constructor() {
    this.config = {
      projectId: import.meta.env.VITE_CATALYST_PROJECT_ID || '48697000000023005',
      environment: import.meta.env.VITE_CATALYST_ENV_ID || '891140386',
      domain: import.meta.env.VITE_CATALYST_DOMAIN || 'snugcrm-891124823.development.catalystserverless.com'
    };
  }

  public static getInstance(): CatalystService {
    if (!CatalystService.instance) {
      CatalystService.instance = new CatalystService();
    }
    return CatalystService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // With embedded auth, initialization is handled by /__catalyst/sdk/init.js
      // We just need to wait for the SDK to be available
      await this.waitForCatalyst();
      this.isInitialized = true;
      console.log('Catalyst SDK initialized via embedded auth script');
    } catch (error) {
      console.error('Failed to initialize Catalyst SDK:', error);
      throw error;
    }
  }

  private waitForCatalyst(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30; // Reduced attempts for development
      
      const checkCatalyst = () => {
        if (window.catalyst && window.catalyst.auth) {
          resolve();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkCatalyst, 100);
        } else {
          // In development/Replit, gracefully handle SDK unavailability
          console.warn('Catalyst SDK not fully available - running in development mode');
          reject(new Error('Catalyst SDK not available in development environment'));
        }
      };
      
      checkCatalyst();
    });
  }

  public async signIn(email: string, password: string): Promise<CatalystUser> {
    if (!this.isInitialized) {
      try {
        await this.initialize();
      } catch (error) {
        throw new Error('Catalyst authentication not available in development environment');
      }
    }

    try {
      if (!window.catalyst || !window.catalyst.auth || typeof window.catalyst.auth.signIn !== 'function') {
        throw new Error('Catalyst authentication not available');
      }

      const response = await window.catalyst.auth.signIn({
        email_id: email,
        password: password
      });
      
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Catalyst sign in error:', error);
      throw new Error('Invalid email or password. Please try again.');
    }
  }

  public async signOut(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      await window.catalyst.auth.signOut();
      localStorage.removeItem('catalyst_user');
      sessionStorage.removeItem('catalyst_session');
    } catch (error) {
      console.error('Catalyst sign out error:', error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<CatalystUser | null> {
    if (!this.isInitialized) {
      try {
        await this.initialize();
      } catch (error) {
        console.warn('Catalyst not available, running in development mode');
        return null;
      }
    }

    try {
      if (!window.catalyst || !window.catalyst.auth || typeof window.catalyst.auth.getCurrentUser !== 'function') {
        console.warn('Catalyst auth methods not available');
        return null;
      }
      
      const response = await window.catalyst.auth.getCurrentUser();
      if (response && response.status === 'success') {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch {
      return false;
    }
  }

  public mapCatalystRoleToAppRole(catalystRole: string): 'client' | 'contractor' | 'admin' | 'employee' {
    const roleMapping: { [key: string]: 'client' | 'contractor' | 'admin' | 'employee' } = {
      'Client': 'client',
      'CLIENT': 'client',
      'Contractor': 'contractor',
      'CONTRACTOR': 'contractor', 
      'Healthcare Provider': 'contractor',
      'HEALTHCARE_PROVIDER': 'contractor',
      'Admin': 'admin',
      'ADMIN': 'admin',
      'Administrator': 'admin',
      'ADMINISTRATOR': 'admin',
      'Employee': 'employee',
      'EMPLOYEE': 'employee',
      'Staff': 'employee',
      'STAFF': 'employee'
    };
    
    return roleMapping[catalystRole] || 'client';
  }

  public async callFunction(functionName: string, data: unknown): Promise<unknown> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const response = await window.catalyst.function.execute(functionName, data);
      return response;
    } catch (error) {
      console.error(`Function ${functionName} execution error:`, error);
      throw error;
    }
  }
}

export const catalyst = CatalystService.getInstance();