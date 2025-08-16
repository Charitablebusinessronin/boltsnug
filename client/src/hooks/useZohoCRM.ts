// React Hook for Zoho CRM Integration
import { useState, useCallback } from 'react';
import { zohoCRM, CRMContact, CRMLead } from '../lib/zoho-crm';

export interface UseCRMResult {
  // Contact operations
  contacts: CRMContact[];
  isLoadingContacts: boolean;
  getContacts: (page?: number, perPage?: number) => Promise<void>;
  createContact: (contact: Omit<CRMContact, 'id' | 'created_time' | 'modified_time'>) => Promise<{ id: string; message: string }>;
  updateContact: (contactId: string, contact: Partial<CRMContact>) => Promise<{ id: string; message: string }>;
  
  // Lead operations
  leads: CRMLead[];
  isLoadingLeads: boolean;
  getLeads: (page?: number, perPage?: number) => Promise<void>;
  createLead: (lead: Omit<CRMLead, 'id' | 'created_time' | 'modified_time'>) => Promise<{ id: string; message: string }>;
  convertLead: (leadId: string, contactData?: Partial<CRMContact>) => Promise<{ contact_id: string; message: string }>;
  
  // Healthcare-specific operations
  getClientsByStatus: (status: 'Active' | 'Inactive' | 'Pending' | 'Completed') => Promise<CRMContact[]>;
  getContractorsBySpecialty: (specialty: string) => Promise<CRMContact[]>;
  searchContacts: (criteria: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    healthcare_status?: string;
  }) => Promise<CRMContact[]>;
  
  // Workflow operations
  createClientIntakeWorkflow: (contactId: string) => Promise<{ workflow_id: string; status: string }>;
  createContractorOnboardingWorkflow: (contactId: string) => Promise<{ workflow_id: string; status: string }>;
  
  // State
  error: string | null;
  isLoading: boolean;
  clearError: () => void;
}

export const useZohoCRM = (): UseCRMResult => {
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Unknown CRM error occurred';
    setError(message);
    console.error('CRM Error:', err);
  }, []);

  // Contact operations
  const getContacts = useCallback(async (page = 1, perPage = 200) => {
    setIsLoadingContacts(true);
    setError(null);
    
    try {
      const response = await zohoCRM.getContacts(page, perPage);
      setContacts(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoadingContacts(false);
    }
  }, [handleError]);

  const createContact = useCallback(async (contact: Omit<CRMContact, 'id' | 'created_time' | 'modified_time'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.createContact(contact);
      // Refresh contacts list
      await getContacts();
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getContacts, handleError]);

  const updateContact = useCallback(async (contactId: string, contact: Partial<CRMContact>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.updateContact(contactId, contact);
      // Refresh contacts list
      await getContacts();
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getContacts, handleError]);

  // Lead operations
  const getLeads = useCallback(async (page = 1, perPage = 200) => {
    setIsLoadingLeads(true);
    setError(null);
    
    try {
      const response = await zohoCRM.getLeads(page, perPage);
      setLeads(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoadingLeads(false);
    }
  }, [handleError]);

  const createLead = useCallback(async (lead: Omit<CRMLead, 'id' | 'created_time' | 'modified_time'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.createLead(lead);
      // Refresh leads list
      await getLeads();
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getLeads, handleError]);

  const convertLead = useCallback(async (leadId: string, contactData?: Partial<CRMContact>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.convertLead(leadId, contactData);
      // Refresh both leads and contacts
      await Promise.all([getLeads(), getContacts()]);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getLeads, getContacts, handleError]);

  // Healthcare-specific operations
  const getClientsByStatus = useCallback(async (status: 'Active' | 'Inactive' | 'Pending' | 'Completed') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.getClientsByStatus(status);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const getContractorsBySpecialty = useCallback(async (specialty: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.getContractorsBySpecialty(specialty);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const searchContacts = useCallback(async (criteria: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    healthcare_status?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.searchContacts(criteria);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // Workflow operations
  const createClientIntakeWorkflow = useCallback(async (contactId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.createClientIntakeWorkflow(contactId);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const createContractorOnboardingWorkflow = useCallback(async (contactId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await zohoCRM.createContractorOnboardingWorkflow(contactId);
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    // Contact operations
    contacts,
    isLoadingContacts,
    getContacts,
    createContact,
    updateContact,
    
    // Lead operations
    leads,
    isLoadingLeads,
    getLeads,
    createLead,
    convertLead,
    
    // Healthcare-specific operations
    getClientsByStatus,
    getContractorsBySpecialty,
    searchContacts,
    
    // Workflow operations
    createClientIntakeWorkflow,
    createContractorOnboardingWorkflow,
    
    // State
    error,
    isLoading,
    clearError
  };
};