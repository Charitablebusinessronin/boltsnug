// Zoho Books Integration for Healthcare Platform
// Hour tracking, billing, invoicing, and financial management

export interface TimeEntry {
  id?: string;
  customer_id: string;
  customer_name?: string;
  project_id?: string;
  project_name?: string;
  task_id?: string;
  task_name?: string;
  user_id: string;
  user_name?: string;
  log_date: string;
  log_time: string;
  end_time?: string;
  hours: number;
  description: string;
  is_billable: boolean;
  billable_rate?: number;
  cost_rate?: number;
  healthcare_details: {
    care_type: 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare' | 'Training';
    service_category: 'Direct Care' | 'Documentation' | 'Travel' | 'Consultation' | 'Training';
    session_notes?: string;
    client_satisfaction?: 1 | 2 | 3 | 4 | 5;
  };
  status: 'Draft' | 'Submitted' | 'Approved' | 'Invoiced';
  created_time?: string;
  modified_time?: string;
}

export interface Invoice {
  id?: string;
  customer_id: string;
  customer_name?: string;
  invoice_number?: string;
  invoice_date: string;
  due_date: string;
  payment_terms?: string;
  payment_terms_label?: string;
  line_items: {
    item_id?: string;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
    tax_id?: string;
    healthcare_service_type?: string;
  }[];
  sub_total: number;
  tax_total: number;
  total: number;
  balance: number;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Overdue' | 'Paid' | 'Void';
  healthcare_billing: {
    care_period_start: string;
    care_period_end: string;
    total_care_hours: number;
    services_provided: string[];
    insurance_covered?: boolean;
    insurance_claim_number?: string;
  };
  notes?: string;
  terms?: string;
  created_time?: string;
  modified_time?: string;
}

export interface Customer {
  id?: string;
  customer_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  website?: string;
  billing_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  healthcare_profile: {
    client_type: 'Individual' | 'Family' | 'Corporate';
    care_plan: 'Basic' | 'Premium' | 'Enterprise';
    preferred_payment_method: 'Credit Card' | 'Bank Transfer' | 'Insurance' | 'Cash';
    insurance_provider?: string;
    policy_number?: string;
    emergency_contact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  payment_terms?: string;
  credit_limit?: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  created_time?: string;
  modified_time?: string;
}

export interface Project {
  id?: string;
  project_name: string;
  customer_id: string;
  customer_name?: string;
  description?: string;
  project_type: 'Individual Care' | 'Family Care' | 'Group Training' | 'Corporate Wellness';
  billing_type: 'Hourly' | 'Fixed Price' | 'Time and Materials';
  hourly_rate?: number;
  budget?: number;
  healthcare_project_details: {
    care_start_date: string;
    care_end_date?: string;
    care_coordinator: string;
    services_included: string[];
    special_requirements?: string[];
    care_plan_id?: string;
  };
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  created_time?: string;
  modified_time?: string;
}

export interface ExpenseReport {
  period_start: string;
  period_end: string;
  total_expenses: number;
  expense_categories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  top_expenses: {
    description: string;
    amount: number;
    date: string;
    category: string;
  }[];
}

export interface RevenueReport {
  period_start: string;
  period_end: string;
  total_revenue: number;
  revenue_by_service: {
    service_type: string;
    revenue: number;
    hours: number;
    avg_rate: number;
  }[];
  monthly_breakdown: {
    month: string;
    revenue: number;
    hours: number;
  }[];
}

class ZohoBooksService {
  private baseURL = 'https://books.zoho.com/api/v3';
  private organizationId: string;
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = import.meta.env.VITE_ZOHO_BOOKS_ACCESS_TOKEN || null;
    this.organizationId = import.meta.env.VITE_ZOHO_BOOKS_ORGANIZATION_ID || '';
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: unknown) {
    if (!this.accessToken || !this.organizationId) {
      throw new Error('Zoho Books access token and organization ID must be configured');
    }

    const headers: HeadersInit = {
      'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const url = `${this.baseURL}${endpoint}${endpoint.includes('?') ? '&' : '?'}organization_id=${this.organizationId}`;

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Books API Error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoho Books API Error:', error);
      throw error;
    }
  }

  // Time Tracking
  async logTime(timeEntry: Omit<TimeEntry, 'id' | 'created_time' | 'modified_time'>): Promise<{ time_entry_id: string }> {
    const response = await this.makeRequest('/projects/timeentries', 'POST', {
      customer_id: timeEntry.customer_id,
      project_id: timeEntry.project_id,
      task_id: timeEntry.task_id,
      user_id: timeEntry.user_id,
      log_date: timeEntry.log_date,
      log_time: timeEntry.log_time,
      end_time: timeEntry.end_time,
      hours: timeEntry.hours,
      description: timeEntry.description,
      is_billable: timeEntry.is_billable,
      billable_rate: timeEntry.billable_rate,
      custom_fields: [
        { customfield_id: 'care_type', value: timeEntry.healthcare_details.care_type },
        { customfield_id: 'service_category', value: timeEntry.healthcare_details.service_category },
        { customfield_id: 'session_notes', value: timeEntry.healthcare_details.session_notes || '' },
        { customfield_id: 'client_satisfaction', value: timeEntry.healthcare_details.client_satisfaction?.toString() || '' }
      ]
    });

    return { time_entry_id: response.time_entry.time_entry_id };
  }

  async getTimeEntries(
    customerId?: string,
    projectId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<TimeEntry[]> {
    let endpoint = '/projects/timeentries';
    const params: string[] = [];

    if (customerId) params.push(`customer_id=${customerId}`);
    if (projectId) params.push(`project_id=${projectId}`);
    if (startDate) params.push(`date_start=${startDate}`);
    if (endDate) params.push(`date_end=${endDate}`);

    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }

    const response = await this.makeRequest(endpoint);
    return response.time_entries || [];
  }

  async updateTimeEntry(timeEntryId: string, updates: Partial<TimeEntry>): Promise<{ status: string }> {
    const response = await this.makeRequest(`/projects/timeentries/${timeEntryId}`, 'PUT', updates);
    return { status: response.code === 0 ? 'success' : 'error' };
  }

  async deleteTimeEntry(timeEntryId: string): Promise<{ status: string }> {
    const response = await this.makeRequest(`/projects/timeentries/${timeEntryId}`, 'DELETE');
    return { status: response.code === 0 ? 'success' : 'error' };
  }

  // Customer Management
  async createCustomer(customer: Omit<Customer, 'id' | 'created_time' | 'modified_time'>): Promise<{ customer_id: string }> {
    const response = await this.makeRequest('/contacts', 'POST', {
      contact_name: customer.customer_name,
      company_name: customer.company_name,
      email: customer.email,
      phone: customer.phone,
      website: customer.website,
      billing_address: customer.billing_address,
      payment_terms: customer.payment_terms,
      credit_limit: customer.credit_limit,
      custom_fields: [
        { customfield_id: 'client_type', value: customer.healthcare_profile.client_type },
        { customfield_id: 'care_plan', value: customer.healthcare_profile.care_plan },
        { customfield_id: 'preferred_payment_method', value: customer.healthcare_profile.preferred_payment_method },
        { customfield_id: 'insurance_provider', value: customer.healthcare_profile.insurance_provider || '' },
        { customfield_id: 'policy_number', value: customer.healthcare_profile.policy_number || '' }
      ]
    });

    return { customer_id: response.contact.contact_id };
  }

  async getCustomers(): Promise<Customer[]> {
    const response = await this.makeRequest('/contacts');
    return response.contacts || [];
  }

  async getCustomer(customerId: string): Promise<Customer> {
    const response = await this.makeRequest(`/contacts/${customerId}`);
    return response.contact;
  }

  // Project Management
  async createProject(project: Omit<Project, 'id' | 'created_time' | 'modified_time'>): Promise<{ project_id: string }> {
    const response = await this.makeRequest('/projects', 'POST', {
      project_name: project.project_name,
      customer_id: project.customer_id,
      description: project.description,
      billing_type: project.billing_type,
      rate: project.hourly_rate,
      budget_type: 'total_project_cost',
      budget_value: project.budget,
      custom_fields: [
        { customfield_id: 'project_type', value: project.project_type },
        { customfield_id: 'care_start_date', value: project.healthcare_project_details.care_start_date },
        { customfield_id: 'care_end_date', value: project.healthcare_project_details.care_end_date || '' },
        { customfield_id: 'care_coordinator', value: project.healthcare_project_details.care_coordinator },
        { customfield_id: 'services_included', value: project.healthcare_project_details.services_included.join(',') }
      ]
    });

    return { project_id: response.project.project_id };
  }

  async getProjects(customerId?: string): Promise<Project[]> {
    let endpoint = '/projects';
    if (customerId) {
      endpoint += `?customer_id=${customerId}`;
    }

    const response = await this.makeRequest(endpoint);
    return response.projects || [];
  }

  // Invoice Management
  async createInvoice(invoice: Omit<Invoice, 'id' | 'invoice_number' | 'created_time' | 'modified_time'>): Promise<{ invoice_id: string; invoice_number: string }> {
    const response = await this.makeRequest('/invoices', 'POST', {
      customer_id: invoice.customer_id,
      date: invoice.invoice_date,
      due_date: invoice.due_date,
      payment_terms: invoice.payment_terms,
      line_items: invoice.line_items.map(item => ({
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        tax_id: item.tax_id
      })),
      notes: invoice.notes,
      terms: invoice.terms,
      custom_fields: [
        { customfield_id: 'care_period_start', value: invoice.healthcare_billing.care_period_start },
        { customfield_id: 'care_period_end', value: invoice.healthcare_billing.care_period_end },
        { customfield_id: 'total_care_hours', value: invoice.healthcare_billing.total_care_hours.toString() },
        { customfield_id: 'services_provided', value: invoice.healthcare_billing.services_provided.join(',') },
        { customfield_id: 'insurance_covered', value: invoice.healthcare_billing.insurance_covered?.toString() || 'false' }
      ]
    });

    return { 
      invoice_id: response.invoice.invoice_id, 
      invoice_number: response.invoice.invoice_number 
    };
  }

  async getInvoices(customerId?: string, status?: string): Promise<Invoice[]> {
    let endpoint = '/invoices';
    const params: string[] = [];

    if (customerId) params.push(`customer_id=${customerId}`);
    if (status) params.push(`status=${status}`);

    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }

    const response = await this.makeRequest(endpoint);
    return response.invoices || [];
  }

  async sendInvoice(invoiceId: string, emailOptions?: {
    to_mail_ids: string[];
    subject?: string;
    body?: string;
  }): Promise<{ status: string }> {
    const response = await this.makeRequest(`/invoices/${invoiceId}/email`, 'POST', emailOptions);
    return { status: response.code === 0 ? 'sent' : 'error' };
  }

  // Healthcare-specific billing methods
  async createCareSessionInvoice(
    customerId: string,
    careProvider: string,
    careType: string,
    sessions: {
      date: string;
      hours: number;
      rate: number;
      description: string;
    }[],
    carePeriodStart: string,
    carePeriodEnd: string
  ): Promise<{ invoice_id: string; invoice_number: string }> {
    const lineItems = sessions.map(session => ({
      name: `${careType} - ${session.date}`,
      description: session.description,
      quantity: session.hours,
      unit: 'hours',
      rate: session.rate,
      amount: session.hours * session.rate,
      healthcare_service_type: careType
    }));

    const totalHours = sessions.reduce((sum, session) => sum + session.hours, 0);
    const subTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);

    const invoice: Omit<Invoice, 'id' | 'invoice_number' | 'created_time' | 'modified_time'> = {
      customer_id: customerId,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      line_items: lineItems,
      sub_total: subTotal,
      tax_total: 0, // Assuming no tax for healthcare services
      total: subTotal,
      balance: subTotal,
      status: 'Draft',
      healthcare_billing: {
        care_period_start: carePeriodStart,
        care_period_end: carePeriodEnd,
        total_care_hours: totalHours,
        services_provided: [careType]
      },
      notes: `Healthcare services provided by ${careProvider} for the period ${carePeriodStart} to ${carePeriodEnd}.`,
      terms: 'Payment is due within 30 days. Late payments may incur additional fees.'
    };

    return await this.createInvoice(invoice);
  }

  async generateMonthlyInvoicesForAllClients(month: string, year: string): Promise<{ generated_invoices: { customer_id: string; invoice_id: string; amount: number }[] }> {
    const generatedInvoices: { customer_id: string; invoice_id: string; amount: number }[] = [];

    // Get all active projects
    const projects = await this.getProjects();
    
    for (const project of projects.filter(p => p.status === 'Active')) {
      // Get billable time entries for the month
      const startDate = `${year}-${month.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
      
      const timeEntries = await this.getTimeEntries(project.customer_id, project.id, startDate, endDate);
      const billableEntries = timeEntries.filter(entry => entry.is_billable && entry.status === 'Approved');

      if (billableEntries.length > 0) {
        const sessions = billableEntries.map(entry => ({
          date: entry.log_date,
          hours: entry.hours,
          rate: entry.billable_rate || project.hourly_rate || 0,
          description: entry.description
        }));

        const result = await this.createCareSessionInvoice(
          project.customer_id,
          'Healthcare Team',
          project.project_type,
          sessions,
          startDate,
          endDate
        );

        generatedInvoices.push({
          customer_id: project.customer_id,
          invoice_id: result.invoice_id,
          amount: sessions.reduce((sum, session) => sum + (session.hours * session.rate), 0)
        });
      }
    }

    return { generated_invoices: generatedInvoices };
  }

  // Reporting
  async getRevenueReport(startDate: string, endDate: string): Promise<RevenueReport> {
    const invoices = await this.getInvoices();
    const paidInvoices = invoices.filter(inv => 
      inv.status === 'Paid' && 
      inv.invoice_date >= startDate && 
      inv.invoice_date <= endDate
    );

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    
    // Get time entries for the period to calculate hours
    const timeEntries = await this.getTimeEntries(undefined, undefined, startDate, endDate);
    const billableEntries = timeEntries.filter(entry => entry.is_billable);
    const totalHours = billableEntries.reduce((sum, entry) => sum + entry.hours, 0);

    // Revenue by service type
    const revenueByService: { [key: string]: { revenue: number; hours: number } } = {};
    
    for (const entry of billableEntries) {
      const serviceType = entry.healthcare_details.care_type;
      if (!revenueByService[serviceType]) {
        revenueByService[serviceType] = { revenue: 0, hours: 0 };
      }
      revenueByService[serviceType].revenue += (entry.billable_rate || 0) * entry.hours;
      revenueByService[serviceType].hours += entry.hours;
    }

    return {
      period_start: startDate,
      period_end: endDate,
      total_revenue: totalRevenue,
      revenue_by_service: Object.entries(revenueByService).map(([service_type, data]) => ({
        service_type,
        revenue: data.revenue,
        hours: data.hours,
        avg_rate: data.hours > 0 ? data.revenue / data.hours : 0
      })),
      monthly_breakdown: [] // This would need additional implementation based on the date range
    };
  }
}

export const zohoBooks = new ZohoBooksService();