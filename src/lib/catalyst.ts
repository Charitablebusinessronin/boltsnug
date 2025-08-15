// Zoho Catalyst SDK Integration
declare global {
  interface Window {
    catalyst: any;
  }
}

export interface CatalystConfig {
  projectId: string;
  environment: string;
  domain: string;
}

export class CatalystService {
  private static instance: CatalystService;
  private isInitialized = false;
  private config: CatalystConfig;

  constructor() {
    this.config = {
      projectId: process.env.NEXT_PUBLIC_CATALYST_PROJECT_ID || '30300000000011038',
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
      domain: process.env.NEXT_PUBLIC_CATALYST_APP_URL || 'https://project-rainfall-891140386.development.catalystserverless.com'
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
      // Wait for Catalyst SDK to load
      await this.waitForCatalyst();
      
      // Initialize Catalyst
      if (window.catalyst) {
        await window.catalyst.initialize({
          projectId: this.config.projectId,
          environment: this.config.environment
        });
        
        this.isInitialized = true;
        console.log('Catalyst SDK initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Catalyst SDK:', error);
      throw error;
    }
  }

  private waitForCatalyst(): Promise<void> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkCatalyst = () => {
        if (window.catalyst) {
          resolve();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkCatalyst, 100);
        } else {
          reject(new Error('Catalyst SDK failed to load'));
        }
      };
      
      checkCatalyst();
    });
  }

  public async signIn(email: string, password: string): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const response = await window.catalyst.auth.signIn({
        email,
        password
      });
      
      return response;
    } catch (error) {
      console.error('Catalyst sign in error:', error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      await window.catalyst.auth.signOut();
    } catch (error) {
      console.error('Catalyst sign out error:', error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<any> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      return await window.catalyst.auth.getCurrentUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  public async callFunction(functionName: string, data: any): Promise<any> {
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