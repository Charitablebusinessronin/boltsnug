// Zoho CRM Integration for Healthcare Platform
// Lead/contact management and workflow automation

export interface CRMContact {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: 'Client' | 'Contractor' | 'Employee' | 'Lead';
  healthcare_status?: 'Active' | 'Inactive' | 'Pending' | 'Completed';
  care_type?: string;
  preferred_contact_method?: 'Email' | 'Phone' | 'SMS';
  medical_conditions?: string[];
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  created_time?: string;
  modified_time?: string;
  owner?: {
    name: string;
    id: string;
    email: string;
  };
  tags?: string[];
  description?: string;
}

export interface CRMLead {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  lead_status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Closed';
  lead_source: 'Website' | 'Referral' | 'Social Media' | 'Advertisement' | 'Other';
  care_interest: 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare' | 'All Services';
  expected_care_date?: string;
  budget_range?: string;
  location?: string;
  notes?: string;
  created_time?: string;
  modified_time?: string;
  owner?: {
    name: string;
    id: string;
    email: string;
  };
}

export interface CRMWorkflow {
  id: string;
  name: string;
  description: string;
  trigger_type: 'Record Creation' | 'Field Update' | 'Time Based' | 'Manual';
  module: 'Contacts' | 'Leads' | 'Deals' | 'Accounts';
  status: 'Active' | 'Inactive';
  conditions?: {
    field: string;
    operator: string;
    value: string;
  }[];
  actions: {
    type: 'Email Alert' | 'Task Creation' | 'Field Update' | 'Webhook' | 'Function Call';
    details: Record<string, unknown>;
  }[];
}

class ZohoCRMService {
  private baseURL = 'https://www.zohoapis.com/crm/v6';
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = import.meta.env.VITE_ZOHO_CRM_ACCESS_TOKEN || null;
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: unknown) {
    if (!this.accessToken) {
      throw new Error('Zoho CRM access token not configured');
    }

    const headers: HeadersInit = {
      'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`CRM API Error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoho CRM API Error:', error);
      throw error;
    }
  }

  // Contact Management
  async getContacts(page = 1, perPage = 200): Promise<{ data: CRMContact[]; info: { more_records: boolean; page: number; per_page: number; count: number } }> {
    const response = await this.makeRequest(`/Contacts?page=${page}&per_page=${perPage}`);
    return response;
  }

  async getContact(contactId: string): Promise<CRMContact> {
    const response = await this.makeRequest(`/Contacts/${contactId}`);
    return response.data[0];
  }

  async createContact(contact: Omit<CRMContact, 'id' | 'created_time' | 'modified_time'>): Promise<{ id: string; message: string }> {
    const response = await this.makeRequest('/Contacts', 'POST', {
      data: [contact]
    });
    return response.data[0].details;
  }

  async updateContact(contactId: string, contact: Partial<CRMContact>): Promise<{ id: string; message: string }> {
    const response = await this.makeRequest(`/Contacts/${contactId}`, 'PUT', {
      data: [{ id: contactId, ...contact }]
    });
    return response.data[0].details;
  }

  async deleteContact(contactId: string): Promise<{ message: string }> {
    const response = await this.makeRequest(`/Contacts/${contactId}`, 'DELETE');
    return response.data[0].details;
  }

  // Lead Management
  async getLeads(page = 1, perPage = 200): Promise<{ data: CRMLead[]; info: { more_records: boolean; page: number; per_page: number; count: number } }> {
    const response = await this.makeRequest(`/Leads?page=${page}&per_page=${perPage}`);
    return response;
  }

  async getLead(leadId: string): Promise<CRMLead> {
    const response = await this.makeRequest(`/Leads/${leadId}`);
    return response.data[0];
  }

  async createLead(lead: Omit<CRMLead, 'id' | 'created_time' | 'modified_time'>): Promise<{ id: string; message: string }> {
    const response = await this.makeRequest('/Leads', 'POST', {
      data: [lead]
    });
    return response.data[0].details;
  }

  async convertLead(leadId: string, contactData?: Partial<CRMContact>): Promise<{ contact_id: string; message: string }> {
    const conversionData = {
      data: [
        {
          Lead: leadId,
          ...(contactData && { Contacts: contactData })
        }
      ]
    };

    const response = await this.makeRequest('/Leads/actions/convert', 'POST', conversionData);
    return response.data[0];
  }

  // Healthcare-specific methods
  async getClientsByStatus(status: 'Active' | 'Inactive' | 'Pending' | 'Completed'): Promise<CRMContact[]> {
    const response = await this.makeRequest(`/Contacts/search?criteria=(Healthcare_Status:equals:${status})`);
    return response.data || [];
  }

  async getContractorsBySpecialty(specialty: string): Promise<CRMContact[]> {
    const response = await this.makeRequest(`/Contacts/search?criteria=(Role:equals:Contractor)and(Care_Type:contains:${specialty})`);
    return response.data || [];
  }

  async createClientIntakeWorkflow(contactId: string): Promise<{ workflow_id: string; status: string }> {
    // Trigger client intake workflow
    const workflowData = {
      workflow: 'Client_Intake_Process',
      records: [contactId]
    };

    const response = await this.makeRequest('/actions/blueprint', 'POST', workflowData);
    return response;
  }

  async createContractorOnboardingWorkflow(contactId: string): Promise<{ workflow_id: string; status: string }> {
    // Trigger contractor onboarding workflow
    const workflowData = {
      workflow: 'Contractor_Onboarding_Process',
      records: [contactId]
    };

    const response = await this.makeRequest('/actions/blueprint', 'POST', workflowData);
    return response;
  }

  // Search and filtering
  async searchContacts(criteria: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    healthcare_status?: string;
  }): Promise<CRMContact[]> {
    const searchCriteria: string[] = [];

    if (criteria.name) {
      searchCriteria.push(`(Full_Name:contains:${criteria.name})`);
    }
    if (criteria.email) {
      searchCriteria.push(`(Email:equals:${criteria.email})`);
    }
    if (criteria.phone) {
      searchCriteria.push(`(Phone:equals:${criteria.phone})`);
    }
    if (criteria.role) {
      searchCriteria.push(`(Role:equals:${criteria.role})`);
    }
    if (criteria.healthcare_status) {
      searchCriteria.push(`(Healthcare_Status:equals:${criteria.healthcare_status})`);
    }

    const criteriaString = searchCriteria.join('and');
    const response = await this.makeRequest(`/Contacts/search?criteria=${criteriaString}`);
    return response.data || [];
  }

  // Workflow Management
  async getWorkflows(): Promise<CRMWorkflow[]> {
    const response = await this.makeRequest('/settings/workflows');
    return response.workflows || [];
  }

  async triggerWorkflow(workflowId: string, recordIds: string[]): Promise<{ status: string; message: string }> {
    const response = await this.makeRequest(`/settings/workflows/${workflowId}/actions/execute`, 'POST', {
      records: recordIds
    });
    return response;
  }

  // Healthcare-specific bulk operations
  async bulkUpdateClientStatus(contactIds: string[], status: 'Active' | 'Inactive' | 'Pending' | 'Completed'): Promise<{ updated_count: number; errors?: unknown[] }> {
    const bulkData = {
      data: contactIds.map(id => ({
        id,
        Healthcare_Status: status
      }))
    };

    const response = await this.makeRequest('/Contacts', 'PUT', bulkData);
    return {
      updated_count: response.data.length,
      errors: response.data.filter((item: { status: string }) => item.status === 'error')
    };
  }

  async assignCareCoordinator(contactIds: string[], coordinatorId: string): Promise<{ assigned_count: number }> {
    const bulkData = {
      data: contactIds.map(id => ({
        id,
        Owner: coordinatorId
      }))
    };

    const response = await this.makeRequest('/Contacts', 'PUT', bulkData);
    return { assigned_count: response.data.length };
  }
}

export const zohoCRM = new ZohoCRMService();