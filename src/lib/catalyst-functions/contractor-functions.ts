// Zoho Catalyst Contractor Functions for Healthcare Platform
// 3 serverless functions for contractor/caregiver services

export interface ContractorApplication {
  contractor_id?: string;
  personal_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    emergency_contact: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  professional_info: {
    specializations: ('Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare' | 'Doula Services')[];
    experience_years: number;
    education: {
      degree: string;
      institution: string;
      graduation_year: number;
    }[];
    certifications: {
      name: string;
      issuing_body: string;
      issue_date: string;
      expiry_date?: string;
      certification_number: string;
    }[];
    licenses: {
      type: string;
      state: string;
      license_number: string;
      issue_date: string;
      expiry_date: string;
    }[];
    previous_employment: {
      employer: string;
      position: string;
      start_date: string;
      end_date?: string;
      responsibilities: string[];
    }[];
  };
  availability: {
    days_available: string[];
    hours_available: {
      start_time: string;
      end_time: string;
    };
    max_hours_per_week: number;
    travel_distance_miles: number;
    reliable_transportation: boolean;
    overnight_availability: boolean;
  };
  preferences: {
    preferred_client_types: string[];
    services_willing_to_provide: string[];
    languages_spoken: string[];
    special_populations_experience?: string[];
  };
  references: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    years_known: number;
  }[];
  background_check_consent: boolean;
  terms_agreement: boolean;
  application_date: string;
}

export interface DocumentSubmission {
  contractor_id: string;
  document_type: 'Resume' | 'Certification' | 'License' | 'Background Check' | 'Reference Letter' | 'Insurance' | 'Tax Form' | 'Photo ID' | 'Other';
  document_category: 'Required' | 'Optional' | 'Renewal' | 'Update';
  file_name: string;
  file_size: number;
  file_type: string;
  document_data: string; // Base64 encoded file data
  expiry_date?: string;
  verification_required: boolean;
  notes?: string;
  related_certification_id?: string;
}

export interface OrientationSession {
  contractor_id: string;
  session_type: 'New Contractor' | 'Specialization Training' | 'Compliance Update' | 'Skills Refresh' | 'Mandatory Training';
  delivery_method: 'In-Person' | 'Virtual' | 'Self-Paced Online' | 'Hybrid';
  topics_covered: string[];
  materials_needed: string[];
  duration_hours: number;
  prerequisites?: string[];
  completion_requirements: {
    attendance_required: boolean;
    quiz_passing_score?: number;
    practical_demonstration?: boolean;
    final_assessment?: boolean;
  };
}

export interface ApplicationStatus {
  application_id: string;
  status: 'Submitted' | 'Under Review' | 'Background Check' | 'Interview Scheduled' | 'Approved' | 'Rejected' | 'Pending Documents';
  current_step: string;
  next_steps: string[];
  estimated_completion_date?: string;
  reviewer_notes?: string[];
  missing_documents?: string[];
  interview_scheduled?: {
    datetime: string;
    type: 'Phone' | 'Video' | 'In-Person';
    interviewer: string;
  };
}

export interface DocumentStatus {
  document_id: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Expired' | 'Renewal Required';
  verification_status: 'Not Verified' | 'In Progress' | 'Verified' | 'Failed';
  reviewer_notes?: string;
  expiry_reminder_sent?: boolean;
  renewal_deadline?: string;
}

export interface OrientationProgress {
  session_id: string;
  completion_percentage: number;
  modules_completed: number;
  total_modules: number;
  quiz_scores?: { module: string; score: number; passed: boolean }[];
  practical_assessments?: { skill: string; status: 'Passed' | 'Failed' | 'Pending' }[];
  certificate_earned?: {
    certificate_id: string;
    issue_date: string;
    download_url: string;
  };
  next_required_training?: string[];
}

// Catalyst Contractor Functions Service Class
class CatalystContractorFunctions {
  private async callCatalystFunction(functionName: string, data: unknown): Promise<unknown> {
    if (!window.catalyst?.function) {
      throw new Error('Catalyst SDK not available');
    }

    try {
      const response = await window.catalyst.function.execute(functionName, data);
      return response;
    } catch (error) {
      console.error(`Error calling Catalyst function ${functionName}:`, error);
      throw new Error(`Failed to execute ${functionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // 1. Application Management Function
  async submitApplication(application: ContractorApplication): Promise<{
    success: boolean;
    application_id: string;
    confirmation_number: string;
    next_steps: string[];
    estimated_review_time: string;
    document_upload_deadline: string;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-application', {
      action: 'submit',
      application_data: {
        ...application,
        submission_timestamp: new Date().toISOString(),
        application_source: 'web_portal'
      },
      validation_rules: {
        require_background_check: true,
        require_references: true,
        minimum_experience_years: 1
      }
    });

    return response as {
      success: boolean;
      application_id: string;
      confirmation_number: string;
      next_steps: string[];
      estimated_review_time: string;
      document_upload_deadline: string;
      message: string;
    };
  }

  async updateApplication(applicationId: string, updates: Partial<ContractorApplication>): Promise<{
    success: boolean;
    updated_fields: string[];
    validation_errors?: string[];
    review_status_changed: boolean;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-application', {
      action: 'update',
      application_id: applicationId,
      updates: updates,
      update_timestamp: new Date().toISOString()
    });

    return response as {
      success: boolean;
      updated_fields: string[];
      validation_errors?: string[];
      review_status_changed: boolean;
      message: string;
    };
  }

  async getApplicationStatus(applicationId: string): Promise<{
    success: boolean;
    application_status: ApplicationStatus;
    timeline: { date: string; status: string; notes?: string }[];
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-application', {
      action: 'get_status',
      application_id: applicationId
    });

    return response as {
      success: boolean;
      application_status: ApplicationStatus;
      timeline: { date: string; status: string; notes?: string }[];
      message: string;
    };
  }

  async withdrawApplication(applicationId: string, reason: string): Promise<{
    success: boolean;
    withdrawal_confirmation: string;
    refund_applicable: boolean;
    reapplication_timeline?: string;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-application', {
      action: 'withdraw',
      application_id: applicationId,
      withdrawal_reason: reason,
      withdrawal_timestamp: new Date().toISOString()
    });

    return response as {
      success: boolean;
      withdrawal_confirmation: string;
      refund_applicable: boolean;
      reapplication_timeline?: string;
      message: string;
    };
  }

  // 2. Document Management Function
  async uploadDocument(document: DocumentSubmission): Promise<{
    success: boolean;
    document_id: string;
    upload_url: string;
    verification_timeline?: string;
    auto_extracted_info?: Record<string, string>;
    compliance_check_results?: {
      compliant: boolean;
      issues?: string[];
    };
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-documents', {
      action: 'upload',
      contractor_id: document.contractor_id,
      document_type: document.document_type,
      document_category: document.document_category,
      file_info: {
        name: document.file_name,
        size: document.file_size,
        type: document.file_type
      },
      document_data: document.document_data,
      metadata: {
        expiry_date: document.expiry_date,
        verification_required: document.verification_required,
        notes: document.notes,
        related_certification_id: document.related_certification_id,
        upload_timestamp: new Date().toISOString()
      }
    });

    return response as {
      success: boolean;
      document_id: string;
      upload_url: string;
      verification_timeline?: string;
      auto_extracted_info?: Record<string, string>;
      compliance_check_results?: {
        compliant: boolean;
        issues?: string[];
      };
      message: string;
    };
  }

  async getDocumentStatus(contractorId: string, documentId?: string): Promise<{
    success: boolean;
    documents: (DocumentStatus & {
      document_type: string;
      upload_date: string;
      download_url?: string;
    })[];
    compliance_summary: {
      required_documents_complete: boolean;
      upcoming_expirations: { document_type: string; expiry_date: string }[];
      overdue_renewals: string[];
    };
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-documents', {
      action: 'get_status',
      contractor_id: contractorId,
      document_id: documentId
    });

    return response as {
      success: boolean;
      documents: (DocumentStatus & {
        document_type: string;
        upload_date: string;
        download_url?: string;
      })[];
      compliance_summary: {
        required_documents_complete: boolean;
        upcoming_expirations: { document_type: string; expiry_date: string }[];
        overdue_renewals: string[];
      };
      message: string;
    };
  }

  async renewDocument(documentId: string, newDocumentData: string): Promise<{
    success: boolean;
    new_document_id: string;
    renewal_processed: boolean;
    new_expiry_date?: string;
    verification_required: boolean;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-documents', {
      action: 'renew',
      document_id: documentId,
      new_document_data: newDocumentData,
      renewal_timestamp: new Date().toISOString()
    });

    return response as {
      success: boolean;
      new_document_id: string;
      renewal_processed: boolean;
      new_expiry_date?: string;
      verification_required: boolean;
      message: string;
    };
  }

  async requestDocumentVerification(documentId: string, urgentRequest = false): Promise<{
    success: boolean;
    verification_request_id: string;
    estimated_completion_time: string;
    priority_level: 'Standard' | 'Expedited' | 'Urgent';
    additional_fees?: number;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-documents', {
      action: 'request_verification',
      document_id: documentId,
      urgent_request: urgentRequest,
      request_timestamp: new Date().toISOString()
    });

    return response as {
      success: boolean;
      verification_request_id: string;
      estimated_completion_time: string;
      priority_level: 'Standard' | 'Expedited' | 'Urgent';
      additional_fees?: number;
      message: string;
    };
  }

  // 3. Orientation Management Function
  async enrollInOrientation(contractorId: string, sessionType: OrientationSession['session_type']): Promise<{
    success: boolean;
    orientation_id: string;
    session_details: {
      start_date: string;
      schedule: string[];
      location?: string;
      virtual_meeting_info?: {
        platform: string;
        meeting_link: string;
        meeting_id: string;
      };
    };
    materials_access: {
      portal_url: string;
      login_credentials?: {
        username: string;
        temporary_password: string;
      };
    };
    pre_orientation_tasks?: string[];
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-orientation', {
      action: 'enroll',
      contractor_id: contractorId,
      session_type: sessionType,
      enrollment_timestamp: new Date().toISOString(),
      delivery_preferences: {
        preferred_method: 'Virtual',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });

    return response as {
      success: boolean;
      orientation_id: string;
      session_details: {
        start_date: string;
        schedule: string[];
        location?: string;
        virtual_meeting_info?: {
          platform: string;
          meeting_link: string;
          meeting_id: string;
        };
      };
      materials_access: {
        portal_url: string;
        login_credentials?: {
          username: string;
          temporary_password: string;
        };
      };
      pre_orientation_tasks?: string[];
      message: string;
    };
  }

  async getOrientationProgress(contractorId: string, orientationId?: string): Promise<{
    success: boolean;
    orientations: (OrientationProgress & {
      session_type: string;
      start_date: string;
      completion_deadline: string;
      instructor: string;
    })[];
    overall_compliance_status: 'Compliant' | 'In Progress' | 'Overdue' | 'Non-Compliant';
    upcoming_renewals: {
      training_type: string;
      renewal_due_date: string;
    }[];
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-orientation', {
      action: 'get_progress',
      contractor_id: contractorId,
      orientation_id: orientationId
    });

    return response as {
      success: boolean;
      orientations: (OrientationProgress & {
        session_type: string;
        start_date: string;
        completion_deadline: string;
        instructor: string;
      })[];
      overall_compliance_status: 'Compliant' | 'In Progress' | 'Overdue' | 'Non-Compliant';
      upcoming_renewals: {
        training_type: string;
        renewal_due_date: string;
      }[];
      message: string;
    };
  }

  async submitOrientationAssessment(orientationId: string, assessmentData: {
    quiz_answers?: { question_id: string; answer: string }[];
    practical_demo_results?: { skill: string; demonstrated: boolean; notes?: string }[];
    feedback?: string;
  }): Promise<{
    success: boolean;
    assessment_id: string;
    results: {
      quiz_score?: number;
      quiz_passed?: boolean;
      practical_assessments_passed?: number;
      overall_pass: boolean;
    };
    certificate_info?: {
      certificate_id: string;
      download_url: string;
      issue_date: string;
      expiry_date?: string;
    };
    next_steps: string[];
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-orientation', {
      action: 'submit_assessment',
      orientation_id: orientationId,
      assessment_data: assessmentData,
      submission_timestamp: new Date().toISOString()
    });

    return response as {
      success: boolean;
      assessment_id: string;
      results: {
        quiz_score?: number;
        quiz_passed?: boolean;
        practical_assessments_passed?: number;
        overall_pass: boolean;
      };
      certificate_info?: {
        certificate_id: string;
        download_url: string;
        issue_date: string;
        expiry_date?: string;
      };
      next_steps: string[];
      message: string;
    };
  }

  async rescheduleOrientation(orientationId: string, newPreferences: {
    preferred_dates: string[];
    delivery_method?: 'In-Person' | 'Virtual' | 'Self-Paced Online';
    special_accommodations?: string[];
  }): Promise<{
    success: boolean;
    new_session_details: {
      start_date: string;
      schedule: string[];
      location?: string;
    };
    rescheduling_fee?: number;
    confirmation_number: string;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-orientation', {
      action: 'reschedule',
      orientation_id: orientationId,
      new_preferences: newPreferences,
      reschedule_reason: 'User requested',
      request_timestamp: new Date().toISOString()
    });

    return response as {
      success: boolean;
      new_session_details: {
        start_date: string;
        schedule: string[];
        location?: string;
      };
      rescheduling_fee?: number;
      confirmation_number: string;
      message: string;
    };
  }

  // Utility functions for contractors
  async getContractorDashboard(contractorId: string): Promise<{
    success: boolean;
    dashboard_data: {
      application_status?: ApplicationStatus;
      document_compliance: {
        compliant: boolean;
        required_actions: string[];
        upcoming_expirations: number;
      };
      orientation_status: {
        completed_orientations: number;
        pending_orientations: number;
        compliance_status: string;
      };
      next_action_items: {
        priority: 'High' | 'Medium' | 'Low';
        action: string;
        due_date?: string;
      }[];
    };
    message: string;
  }> {
    const response = await this.callCatalystFunction('contractor-dashboard', {
      contractor_id: contractorId,
      dashboard_type: 'overview'
    });

    return response as {
      success: boolean;
      dashboard_data: {
        application_status?: ApplicationStatus;
        document_compliance: {
          compliant: boolean;
          required_actions: string[];
          upcoming_expirations: number;
        };
        orientation_status: {
          completed_orientations: number;
          pending_orientations: number;
          compliance_status: string;
        };
        next_action_items: {
          priority: 'High' | 'Medium' | 'Low';
          action: string;
          due_date?: string;
        }[];
      };
      message: string;
    };
  }
}

export const catalystContractorFunctions = new CatalystContractorFunctions();