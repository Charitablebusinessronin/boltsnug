// Zoho API Integration Layer
export interface ZohoAPIConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  baseUrls: {
    crm: string;
    books: string;
    campaigns: string;
    bookings: string;
    analytics: string;
    sign: string;
  };
}

export class ZohoAPIService {
  private static instance: ZohoAPIService;
  private config: ZohoAPIConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      clientId: process.env.ZOHO_CLIENT_ID || '',
      clientSecret: process.env.ZOHO_CLIENT_SECRET || '',
      refreshToken: process.env.ZOHO_REFRESH_TOKEN || '',
      baseUrls: {
        crm: process.env.ZOHO_CRM_API_URL || 'https://www.zohoapis.com/crm/v6',
        books: process.env.ZOHO_BOOKS_API_URL || 'https://books.zoho.com/api/v3',
        campaigns: process.env.ZOHO_CAMPAIGNS_API_URL || 'https://campaigns.zoho.com/api/v1.1',
        bookings: process.env.ZOHO_BOOKINGS_API_URL || 'https://bookings.zoho.com/api/v1',
        analytics: process.env.ZOHO_ANALYTICS_API_URL || 'https://analyticsapi.zoho.com/api',
        sign: process.env.ZOHO_SIGN_API_URL || 'https://sign.zoho.com/api/v1'
      }
    };
  }

  public static getInstance(): ZohoAPIService {
    if (!ZohoAPIService.instance) {
      ZohoAPIService.instance = new ZohoAPIService();
    }
    return ZohoAPIService.instance;
  }

  private async refreshAccessToken(): Promise<string> {
    try {
      const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: this.config.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token'
        })
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);
        return this.accessToken;
      } else {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  private async getValidAccessToken(): Promise<string> {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.refreshAccessToken();
    }
    return this.accessToken!;
  }

  public async makeAPICall(
    service: keyof ZohoAPIConfig['baseUrls'],
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<any> {
    try {
      const token = await this.getValidAccessToken();
      const baseUrl = this.config.baseUrls[service];
      
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Zoho API call error (${service}${endpoint}):`, error);
      throw error;
    }
  }

  // CRM Methods
  public async getCRMRecords(module: string, params?: any): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeAPICall('crm', `/${module}${queryString}`);
  }

  public async createCRMRecord(module: string, data: any): Promise<any> {
    return this.makeAPICall('crm', `/${module}`, 'POST', { data: [data] });
  }

  public async updateCRMRecord(module: string, id: string, data: any): Promise<any> {
    return this.makeAPICall('crm', `/${module}/${id}`, 'PUT', { data: [data] });
  }

  // Books Methods
  public async getBooksData(endpoint: string, params?: any): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeAPICall('books', `${endpoint}${queryString}`);
  }

  // Analytics Methods
  public async getAnalyticsData(workspaceId: string, viewId: string, params?: any): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.makeAPICall('analytics', `/workspaces/${workspaceId}/views/${viewId}/data${queryString}`);
  }

  // Sign Methods
  public async createSignDocument(data: any): Promise<any> {
    return this.makeAPICall('sign', '/requests', 'POST', data);
  }
}

export const zohoAPI = ZohoAPIService.getInstance();