// Zoho Catalyst Client Functions for Healthcare Platform
// 8 serverless functions for client-facing healthcare services

export interface VideoCallRequest {
  client_id: string;
  caregiver_id: string;
  appointment_type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Training';
  preferred_datetime: string;
  duration_minutes: number;
  special_requirements?: string[];
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface InterviewRequest {
  client_id: string;
  service_type: 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare';
  preferred_dates: string[];
  preferred_times: string[];
  interview_method: 'Phone' | 'Video' | 'In-Person';
  special_needs?: string[];
  questions?: string[];
}

export interface ServiceRequest {
  client_id: string;
  service_category: 'Immediate Care' | 'Scheduled Care' | 'Consultation' | 'Education' | 'Support Group';
  service_type: 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare' | 'Doula Services';
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  preferred_start_date: string;
  duration_weeks?: number;
  hours_per_week?: number;
  specific_requirements: string[];
  budget_range?: {
    min: number;
    max: number;
    payment_method: 'Insurance' | 'Private Pay' | 'Sliding Scale';
  };
  location_preferences: {
    in_home: boolean;
    virtual: boolean;
    clinic_visit: boolean;
  };
}

export interface InfoSheetData {
  client_id: string;
  personal_info: {
    emergency_contacts: {
      primary: { name: string; phone: string; relationship: string };
      secondary?: { name: string; phone: string; relationship: string };
    };
    medical_history: {
      conditions: string[];
      medications: string[];
      allergies: string[];
      previous_pregnancies?: number;
      complications?: string[];
    };
    preferences: {
      language: string;
      communication_method: 'Phone' | 'Text' | 'Email' | 'App';
      cultural_considerations?: string[];
      religious_considerations?: string[];
    };
  };
  postpartum_specific?: {
    delivery_date: string;
    delivery_type: 'Vaginal' | 'C-Section';
    baby_info: {
      name?: string;
      weight: number;
      feeding_method: 'Breastfeeding' | 'Formula' | 'Mixed';
      special_needs?: string[];
    };
    recovery_concerns: string[];
    support_system: string[];
  };
}

export interface ContractRequest {
  client_id: string;
  service_type: string;
  caregiver_id?: string;
  contract_type: 'Service Agreement' | 'Care Plan' | 'Consulting Agreement' | 'Training Agreement';
  terms: {
    start_date: string;
    end_date?: string;
    hours_per_week: number;
    hourly_rate: number;
    total_estimated_cost: number;
  };
  services_included: string[];
  special_provisions?: string[];
  cancellation_policy: string;
  payment_terms: string;
  insurance_info?: {
    provider: string;
    policy_number: string;
    coverage_details: string;
  };
}

export interface HoursEntry {
  client_id: string;
  caregiver_id: string;
  service_date: string;
  start_time: string;
  end_time: string;
  total_hours: number;
  service_type: 'Direct Care' | 'Consultation' | 'Travel' | 'Documentation' | 'Training';
  activities_performed: string[];
  client_satisfaction?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  requires_approval: boolean;
}

export interface FeedbackSubmission {
  client_id: string;
  feedback_type: 'Service Review' | 'Caregiver Review' | 'Platform Feedback' | 'Complaint' | 'Suggestion';
  rating: 1 | 2 | 3 | 4 | 5;
  service_date?: string;
  caregiver_id?: string;
  feedback_text: string;
  areas_of_concern?: ('Communication' | 'Punctuality' | 'Service Quality' | 'Professionalism' | 'Safety' | 'Cost')[];
  would_recommend: boolean;
  follow_up_requested: boolean;
  anonymous: boolean;
}

export interface CaregiverMatchingRequest {
  client_id: string;
  care_needs: {
    primary_need: 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare';
    specific_services: string[];
    experience_level_required: 'Entry Level' | 'Experienced' | 'Expert' | 'Certified Specialist';
    certifications_required?: string[];
  };
  schedule_preferences: {
    days_of_week: string[];
    time_ranges: string[];
    flexibility: 'Rigid' | 'Somewhat Flexible' | 'Very Flexible';
  };
  location_info: {
    address: string;
    max_travel_distance: number;
    transportation_provided: boolean;
  };
  personal_preferences: {
    gender_preference?: 'Male' | 'Female' | 'No Preference';
    age_range?: { min: number; max: number };
    language_requirements?: string[];
    personality_traits?: string[];
  };
  budget_constraints: {
    hourly_rate_max: number;
    total_budget_max?: number;
    insurance_coverage: boolean;
  };
}

// Catalyst Function Service Class
class CatalystClientFunctions {
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

  // 1. Video Call Scheduling Function
  async scheduleVideoCall(request: VideoCallRequest): Promise<{
    success: boolean;
    appointment_id: string;
    video_link?: string;
    calendar_event_id?: string;
    message: string;
  }> {
    const response = await this.callCatalystFunction('video-call-scheduler', {
      action: 'schedule',
      client_id: request.client_id,
      caregiver_id: request.caregiver_id,
      appointment_type: request.appointment_type,
      preferred_datetime: request.preferred_datetime,
      duration_minutes: request.duration_minutes,
      special_requirements: request.special_requirements,
      emergency_contact: request.emergency_contact
    });

    return response as {
      success: boolean;
      appointment_id: string;
      video_link?: string;
      calendar_event_id?: string;
      message: string;
    };
  }

  // 2. Interview Scheduling Function
  async scheduleInterview(request: InterviewRequest): Promise<{
    success: boolean;
    interview_id: string;
    scheduled_datetime?: string;
    interviewer_assigned?: string;
    preparation_materials?: string[];
    message: string;
  }> {
    const response = await this.callCatalystFunction('interview-scheduler', {
      action: 'schedule_interview',
      client_id: request.client_id,
      service_type: request.service_type,
      preferred_dates: request.preferred_dates,
      preferred_times: request.preferred_times,
      interview_method: request.interview_method,
      special_needs: request.special_needs,
      questions: request.questions
    });

    return response as {
      success: boolean;
      interview_id: string;
      scheduled_datetime?: string;
      interviewer_assigned?: string;
      preparation_materials?: string[];
      message: string;
    };
  }

  // 3. Service Request Processing Function
  async submitServiceRequest(request: ServiceRequest): Promise<{
    success: boolean;
    request_id: string;
    estimated_response_time: string;
    care_coordinator_assigned?: string;
    next_steps: string[];
    message: string;
  }> {
    const response = await this.callCatalystFunction('service-request-processor', {
      action: 'create_request',
      client_id: request.client_id,
      service_category: request.service_category,
      service_type: request.service_type,
      urgency: request.urgency,
      preferred_start_date: request.preferred_start_date,
      duration_weeks: request.duration_weeks,
      hours_per_week: request.hours_per_week,
      specific_requirements: request.specific_requirements,
      budget_range: request.budget_range,
      location_preferences: request.location_preferences
    });

    return response as {
      success: boolean;
      request_id: string;
      estimated_response_time: string;
      care_coordinator_assigned?: string;
      next_steps: string[];
      message: string;
    };
  }

  // 4. Info Sheet Management Function
  async submitInfoSheet(data: InfoSheetData): Promise<{
    success: boolean;
    info_sheet_id: string;
    completeness_score: number;
    missing_fields?: string[];
    recommendations?: string[];
    message: string;
  }> {
    const response = await this.callCatalystFunction('info-sheet-manager', {
      action: 'submit',
      client_id: data.client_id,
      personal_info: data.personal_info,
      postpartum_specific: data.postpartum_specific
    });

    return response as {
      success: boolean;
      info_sheet_id: string;
      completeness_score: number;
      missing_fields?: string[];
      recommendations?: string[];
      message: string;
    };
  }

  async getInfoSheet(clientId: string): Promise<{
    success: boolean;
    info_sheet?: InfoSheetData;
    last_updated: string;
    completeness_score: number;
    message: string;
  }> {
    const response = await this.callCatalystFunction('info-sheet-manager', {
      action: 'retrieve',
      client_id: clientId
    });

    return response as {
      success: boolean;
      info_sheet?: InfoSheetData;
      last_updated: string;
      completeness_score: number;
      message: string;
    };
  }

  // 5. Contract Management Function
  async requestContract(request: ContractRequest): Promise<{
    success: boolean;
    contract_id: string;
    contract_url?: string;
    review_deadline: string;
    legal_review_required: boolean;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contract-manager', {
      action: 'generate',
      client_id: request.client_id,
      service_type: request.service_type,
      caregiver_id: request.caregiver_id,
      contract_type: request.contract_type,
      terms: request.terms,
      services_included: request.services_included,
      special_provisions: request.special_provisions,
      cancellation_policy: request.cancellation_policy,
      payment_terms: request.payment_terms,
      insurance_info: request.insurance_info
    });

    return response as {
      success: boolean;
      contract_id: string;
      contract_url?: string;
      review_deadline: string;
      legal_review_required: boolean;
      message: string;
    };
  }

  async signContract(contractId: string, clientId: string, signature: string): Promise<{
    success: boolean;
    signed_contract_url: string;
    effective_date: string;
    message: string;
  }> {
    const response = await this.callCatalystFunction('contract-manager', {
      action: 'sign',
      contract_id: contractId,
      client_id: clientId,
      signature: signature,
      signed_datetime: new Date().toISOString()
    });

    return response as {
      success: boolean;
      signed_contract_url: string;
      effective_date: string;
      message: string;
    };
  }

  // 6. Hours Tracking Function
  async submitHoursEntry(entry: HoursEntry): Promise<{
    success: boolean;
    entry_id: string;
    approval_required: boolean;
    estimated_cost: number;
    message: string;
  }> {
    const response = await this.callCatalystFunction('hours-tracker', {
      action: 'log_hours',
      client_id: entry.client_id,
      caregiver_id: entry.caregiver_id,
      service_date: entry.service_date,
      start_time: entry.start_time,
      end_time: entry.end_time,
      total_hours: entry.total_hours,
      service_type: entry.service_type,
      activities_performed: entry.activities_performed,
      client_satisfaction: entry.client_satisfaction,
      notes: entry.notes,
      requires_approval: entry.requires_approval
    });

    return response as {
      success: boolean;
      entry_id: string;
      approval_required: boolean;
      estimated_cost: number;
      message: string;
    };
  }

  async getHoursHistory(clientId: string, startDate?: string, endDate?: string): Promise<{
    success: boolean;
    hours_entries: (HoursEntry & { entry_id: string; status: string; approved_by?: string })[];
    total_hours: number;
    total_cost: number;
    message: string;
  }> {
    const response = await this.callCatalystFunction('hours-tracker', {
      action: 'get_history',
      client_id: clientId,
      start_date: startDate,
      end_date: endDate
    });

    return response as {
      success: boolean;
      hours_entries: (HoursEntry & { entry_id: string; status: string; approved_by?: string })[];
      total_hours: number;
      total_cost: number;
      message: string;
    };
  }

  // 7. Feedback Management Function
  async submitFeedback(feedback: FeedbackSubmission): Promise<{
    success: boolean;
    feedback_id: string;
    acknowledgment: string;
    follow_up_timeline?: string;
    escalation_triggered: boolean;
    message: string;
  }> {
    const response = await this.callCatalystFunction('feedback-manager', {
      action: 'submit',
      client_id: feedback.client_id,
      feedback_type: feedback.feedback_type,
      rating: feedback.rating,
      service_date: feedback.service_date,
      caregiver_id: feedback.caregiver_id,
      feedback_text: feedback.feedback_text,
      areas_of_concern: feedback.areas_of_concern,
      would_recommend: feedback.would_recommend,
      follow_up_requested: feedback.follow_up_requested,
      anonymous: feedback.anonymous,
      submitted_at: new Date().toISOString()
    });

    return response as {
      success: boolean;
      feedback_id: string;
      acknowledgment: string;
      follow_up_timeline?: string;
      escalation_triggered: boolean;
      message: string;
    };
  }

  // 8. Caregiver Matching Function
  async findCaregiverMatches(request: CaregiverMatchingRequest): Promise<{
    success: boolean;
    matches: {
      caregiver_id: string;
      match_score: number;
      availability: string[];
      estimated_cost: number;
      distance_miles: number;
      key_qualifications: string[];
    }[];
    matching_criteria_used: string[];
    total_candidates_evaluated: number;
    message: string;
  }> {
    const response = await this.callCatalystFunction('caregiver-matching', {
      action: 'find_matches',
      client_id: request.client_id,
      care_needs: request.care_needs,
      schedule_preferences: request.schedule_preferences,
      location_info: request.location_info,
      personal_preferences: request.personal_preferences,
      budget_constraints: request.budget_constraints,
      matching_algorithm: 'ai_enhanced',
      max_results: 10
    });

    return response as {
      success: boolean;
      matches: {
        caregiver_id: string;
        match_score: number;
        availability: string[];
        estimated_cost: number;
        distance_miles: number;
        key_qualifications: string[];
      }[];
      matching_criteria_used: string[];
      total_candidates_evaluated: number;
      message: string;
    };
  }

  async selectCaregiver(clientId: string, caregiverId: string, matchingRequestId: string): Promise<{
    success: boolean;
    assignment_id: string;
    onboarding_steps: string[];
    first_meeting_scheduled: string;
    message: string;
  }> {
    const response = await this.callCatalystFunction('caregiver-matching', {
      action: 'select_caregiver',
      client_id: clientId,
      caregiver_id: caregiverId,
      matching_request_id: matchingRequestId,
      selection_datetime: new Date().toISOString()
    });

    return response as {
      success: boolean;
      assignment_id: string;
      onboarding_steps: string[];
      first_meeting_scheduled: string;
      message: string;
    };
  }
}

export const catalystClientFunctions = new CatalystClientFunctions();