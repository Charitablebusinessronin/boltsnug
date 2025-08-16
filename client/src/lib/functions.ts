// Catalyst Functions Integration
import { catalyst } from './catalyst';

export interface FunctionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class FunctionsService {
  private static instance: FunctionsService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_CATALYST_APP_URL || 'https://project-rainfall-891140386.development.catalystserverless.com';
  }

  public static getInstance(): FunctionsService {
    if (!FunctionsService.instance) {
      FunctionsService.instance = new FunctionsService();
    }
    return FunctionsService.instance;
  }

  private async callFunction(functionName: string, data: any = {}): Promise<FunctionResponse> {
    try {
      // Try Catalyst SDK first
      if (window.catalyst) {
        const response = await catalyst.callFunction(functionName, data);
        return {
          success: true,
          data: response
        };
      }

      // Fallback to direct HTTP call
      const response = await fetch(`${this.baseUrl}/server/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('catalyst-token') || ''}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      return {
        success: response.ok,
        data: result,
        error: response.ok ? undefined : result.message || 'Function call failed'
      };
    } catch (error) {
      console.error(`Function ${functionName} error:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Client Functions
  public async videoCall(data: { clientId: string; contractorId: string; scheduledTime?: string }): Promise<FunctionResponse> {
    return this.callFunction('video-call', data);
  }

  public async scheduleInterview(data: { clientId: string; contractorId: string; preferredTimes: string[] }): Promise<FunctionResponse> {
    return this.callFunction('interview', data);
  }

  public async createServiceRequest(data: { 
    clientId: string; 
    serviceType: string; 
    description: string; 
    urgency: 'low' | 'medium' | 'high';
    preferredDate?: string;
  }): Promise<FunctionResponse> {
    return this.callFunction('service-request', data);
  }

  public async submitInfoSheet(data: { 
    clientId: string; 
    medicalInfo: any; 
    preferences: any; 
    emergencyContacts: any[] 
  }): Promise<FunctionResponse> {
    return this.callFunction('info-sheet', data);
  }

  public async manageContracts(data: { 
    clientId: string; 
    action: 'create' | 'update' | 'terminate';
    contractData?: any;
  }): Promise<FunctionResponse> {
    return this.callFunction('contracts', data);
  }

  public async trackHours(data: { 
    clientId: string; 
    contractorId: string; 
    startTime: string; 
    endTime: string; 
    serviceType: string;
  }): Promise<FunctionResponse> {
    return this.callFunction('hours', data);
  }

  public async submitFeedback(data: { 
    clientId: string; 
    contractorId: string; 
    rating: number; 
    comments: string; 
    serviceDate: string;
  }): Promise<FunctionResponse> {
    return this.callFunction('feedback', data);
  }

  public async caregiverMatching(data: { 
    clientId: string; 
    requirements: any; 
    preferences: any;
  }): Promise<FunctionResponse> {
    return this.callFunction('caregiver-matching', data);
  }

  // Contractor Functions
  public async submitApplication(data: { 
    contractorId: string; 
    jobId: string; 
    coverLetter?: string; 
    availability: any;
  }): Promise<FunctionResponse> {
    return this.callFunction('application', data);
  }

  public async uploadDocuments(data: { 
    contractorId: string; 
    documents: { type: string; fileUrl: string; fileName: string }[];
  }): Promise<FunctionResponse> {
    return this.callFunction('documents', data);
  }

  public async completeOrientation(data: { 
    contractorId: string; 
    moduleId: string; 
    completionData: any;
  }): Promise<FunctionResponse> {
    return this.callFunction('orientation', data);
  }

  // Admin Functions
  public async triggerAutomation(data: { 
    automationType: string; 
    parameters: any; 
    targetUsers?: string[];
  }): Promise<FunctionResponse> {
    return this.callFunction('automation', data);
  }

  // HR Functions
  public async employeeOnboarding(data: { 
    employeeId: string; 
    onboardingData: any; 
    assignedBuddy?: string;
  }): Promise<FunctionResponse> {
    return this.callFunction('employee-onboarding', data);
  }

  public async trackPerformance(data: { 
    employeeId: string; 
    performanceData: any; 
    reviewPeriod: string;
  }): Promise<FunctionResponse> {
    return this.callFunction('performance-tracking', data);
  }

  public async monitorCompliance(data: { 
    employeeId?: string; 
    complianceType: string; 
    checkDate: string;
  }): Promise<FunctionResponse> {
    return this.callFunction('compliance-monitoring', data);
  }

  public async getRecruitmentAnalytics(data: { 
    dateRange: { start: string; end: string }; 
    metrics: string[];
  }): Promise<FunctionResponse> {
    return this.callFunction('recruitment-analytics', data);
  }

  // Utility Functions
  public async getQuickActions(userId: string, userRole: string): Promise<FunctionResponse> {
    return this.callFunction('quick-actions', { userId, userRole });
  }

  public async getZiaIntelligence(data: { 
    query: string; 
    context: any; 
    userId: string;
  }): Promise<FunctionResponse> {
    return this.callFunction('zia-intelligence', data);
  }

  public async sendNotification(data: { 
    recipients: string[]; 
    message: string; 
    type: 'email' | 'sms' | 'push';
    priority: 'low' | 'medium' | 'high';
  }): Promise<FunctionResponse> {
    return this.callFunction('notification-handler', data);
  }

  public async getAnalytics(data: { 
    reportType: string; 
    dateRange: { start: string; end: string }; 
    filters?: any;
  }): Promise<FunctionResponse> {
    return this.callFunction('analytics-engine', data);
  }
}

export const functions = FunctionsService.getInstance();