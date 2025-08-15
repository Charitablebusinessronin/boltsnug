// Zoho Learn Integration for Healthcare Platform
// Training modules, certification tracking, and learning management

export interface Course {
  id?: string;
  title: string;
  description: string;
  category: 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare' | 'Compliance' | 'Safety' | 'Professional Development';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Certification';
  duration_hours: number;
  prerequisites?: string[];
  learning_objectives: string[];
  modules: CourseModule[];
  certification_available: boolean;
  certification_requirements?: {
    passing_score: number;
    completion_rate: number;
    practical_assessment: boolean;
  };
  healthcare_compliance: {
    required_for_role: ('Client' | 'Contractor' | 'Employee')[];
    renewal_period_months?: number;
    regulatory_body?: string;
    compliance_tags: string[];
  };
  created_by: string;
  status: 'Draft' | 'Published' | 'Archived';
  created_time?: string;
  modified_time?: string;
}

export interface CourseModule {
  id?: string;
  title: string;
  description: string;
  module_type: 'Video' | 'Document' | 'Interactive' | 'Quiz' | 'Assignment' | 'Virtual Practice';
  content_url?: string;
  duration_minutes: number;
  resources: {
    type: 'PDF' | 'Video' | 'Link' | 'Document';
    title: string;
    url: string;
    description?: string;
  }[];
  quiz_questions?: QuizQuestion[];
  required_for_completion: boolean;
  order: number;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  type: 'Multiple Choice' | 'True/False' | 'Short Answer' | 'Essay' | 'Scenario Based';
  options?: string[];
  correct_answer: string | string[];
  explanation?: string;
  points: number;
  healthcare_context?: {
    scenario: string;
    clinical_relevance: string;
  };
}

export interface UserEnrollment {
  id?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: 'Client' | 'Contractor' | 'Employee';
  course_id: string;
  course_title: string;
  enrollment_date: string;
  start_date?: string;
  completion_date?: string;
  due_date?: string;
  progress: {
    modules_completed: number;
    total_modules: number;
    completion_percentage: number;
    time_spent_hours: number;
  };
  quiz_scores: {
    module_id: string;
    score: number;
    max_score: number;
    attempts: number;
    passed: boolean;
  }[];
  overall_score?: number;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Failed' | 'Expired';
  certification_earned?: {
    certificate_id: string;
    issue_date: string;
    expiry_date?: string;
    certificate_url: string;
  };
  healthcare_specific: {
    mandatory_training: boolean;
    compliance_requirement: string;
    supervisor_approval_required: boolean;
    practical_assessment_completed: boolean;
  };
}

export interface Certificate {
  id?: string;
  user_id: string;
  user_name: string;
  course_id: string;
  course_title: string;
  certificate_type: 'Completion' | 'Certification' | 'Continuing Education Units';
  issue_date: string;
  expiry_date?: string;
  certificate_number: string;
  issued_by: string;
  verification_url?: string;
  healthcare_credentials: {
    accreditation_body: string;
    ce_credits?: number;
    license_requirements_met: string[];
    renewal_requirements?: string[];
  };
  status: 'Valid' | 'Expired' | 'Revoked';
}

export interface LearningPath {
  id?: string;
  title: string;
  description: string;
  target_role: 'Client' | 'Contractor' | 'Employee' | 'All';
  courses: {
    course_id: string;
    order: number;
    required: boolean;
  }[];
  estimated_completion_time: number;
  healthcare_specialization: string;
  compliance_pathway: boolean;
  created_time?: string;
  modified_time?: string;
}

export interface TrainingReport {
  period_start: string;
  period_end: string;
  overall_stats: {
    total_enrollments: number;
    completed_courses: number;
    certificates_issued: number;
    average_completion_time: number;
  };
  compliance_tracking: {
    role: string;
    required_courses: number;
    completed_courses: number;
    compliance_rate: number;
    upcoming_renewals: number;
  }[];
  popular_courses: {
    course_id: string;
    course_title: string;
    enrollment_count: number;
    completion_rate: number;
    average_score: number;
  }[];
}

class ZohoLearnService {
  private baseURL = 'https://learn.zoho.com/api/v1';
  private accessToken: string | null = null;
  private schoolId: string;

  constructor() {
    this.accessToken = import.meta.env.VITE_ZOHO_LEARN_ACCESS_TOKEN || null;
    this.schoolId = import.meta.env.VITE_ZOHO_LEARN_SCHOOL_ID || '';
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: unknown) {
    if (!this.accessToken || !this.schoolId) {
      throw new Error('Zoho Learn access token and school ID must be configured');
    }

    const headers: HeadersInit = {
      'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
      'Content-Type': 'application/json',
    };

    const url = `${this.baseURL}/schools/${this.schoolId}${endpoint}`;

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
        throw new Error(`Learn API Error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoho Learn API Error:', error);
      throw error;
    }
  }

  // Course Management
  async createCourse(course: Omit<Course, 'id' | 'created_time' | 'modified_time'>): Promise<{ course_id: string }> {
    const courseData = {
      name: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration_hours,
      prerequisites: course.prerequisites,
      learning_objectives: course.learning_objectives,
      certification_enabled: course.certification_available,
      ...(course.certification_requirements && {
        passing_score: course.certification_requirements.passing_score,
        completion_threshold: course.certification_requirements.completion_rate
      }),
      custom_fields: {
        healthcare_compliance: JSON.stringify(course.healthcare_compliance),
        required_roles: course.healthcare_compliance.required_for_role.join(','),
        renewal_period: course.healthcare_compliance.renewal_period_months?.toString() || ''
      }
    };

    const response = await this.makeRequest('/courses', 'POST', courseData);
    return { course_id: response.course.course_id };
  }

  async getCourses(category?: string, level?: string): Promise<Course[]> {
    let endpoint = '/courses';
    const params: string[] = [];

    if (category) params.push(`category=${category}`);
    if (level) params.push(`level=${level}`);

    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }

    const response = await this.makeRequest(endpoint);
    return response.courses || [];
  }

  async getCourse(courseId: string): Promise<Course> {
    const response = await this.makeRequest(`/courses/${courseId}`);
    return response.course;
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<{ status: string }> {
    const response = await this.makeRequest(`/courses/${courseId}`, 'PUT', updates);
    return { status: response.status };
  }

  // Enrollment Management
  async enrollUser(
    userId: string,
    courseId: string,
    dueDate?: string,
    isMandatory = false
  ): Promise<{ enrollment_id: string }> {
    const enrollmentData = {
      user_id: userId,
      course_id: courseId,
      due_date: dueDate,
      is_mandatory: isMandatory
    };

    const response = await this.makeRequest('/enrollments', 'POST', enrollmentData);
    return { enrollment_id: response.enrollment.enrollment_id };
  }

  async getUserEnrollments(userId: string): Promise<UserEnrollment[]> {
    const response = await this.makeRequest(`/users/${userId}/enrollments`);
    return response.enrollments || [];
  }

  async getCourseEnrollments(courseId: string): Promise<UserEnrollment[]> {
    const response = await this.makeRequest(`/courses/${courseId}/enrollments`);
    return response.enrollments || [];
  }

  async updateEnrollmentProgress(
    enrollmentId: string,
    moduleId: string,
    completed: boolean,
    score?: number,
    timeSpent?: number
  ): Promise<{ status: string }> {
    const progressData = {
      module_id: moduleId,
      completed,
      score,
      time_spent_minutes: timeSpent
    };

    const response = await this.makeRequest(`/enrollments/${enrollmentId}/progress`, 'PUT', progressData);
    return { status: response.status };
  }

  // Healthcare-specific methods
  async enrollUserInComplianceTraining(
    userId: string,
    userRole: 'Client' | 'Contractor' | 'Employee'
  ): Promise<{ enrolled_courses: string[] }> {
    const courses = await this.getCourses();
    const complianceCourses = courses.filter(course => 
      course.healthcare_compliance.required_for_role.includes(userRole)
    );

    const enrolledCourses: string[] = [];

    for (const course of complianceCourses) {
      try {
        const dueDate = course.healthcare_compliance.renewal_period_months
          ? new Date(Date.now() + course.healthcare_compliance.renewal_period_months * 30 * 24 * 60 * 60 * 1000).toISOString()
          : undefined;

        const result = await this.enrollUser(userId, course.id!, dueDate, true);
        enrolledCourses.push(course.id!);
      } catch (error) {
        console.error(`Error enrolling user in course ${course.id}:`, error);
      }
    }

    return { enrolled_courses: enrolledCourses };
  }

  async getComplianceStatus(userId: string): Promise<{
    compliant: boolean;
    required_courses: number;
    completed_courses: number;
    expired_certificates: number;
    upcoming_renewals: { course_id: string; due_date: string }[];
  }> {
    const enrollments = await this.getUserEnrollments(userId);
    const mandatoryEnrollments = enrollments.filter(e => e.healthcare_specific.mandatory_training);

    const requiredCourses = mandatoryEnrollments.length;
    const completedCourses = mandatoryEnrollments.filter(e => e.status === 'Completed').length;
    
    // Check for expired certificates
    const certificates = await this.getUserCertificates(userId);
    const expiredCertificates = certificates.filter(cert => 
      cert.expiry_date && new Date(cert.expiry_date) < new Date() && cert.status !== 'Expired'
    ).length;

    // Check for upcoming renewals (within 30 days)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const upcomingRenewals = enrollments
      .filter(e => e.due_date && new Date(e.due_date) < thirtyDaysFromNow)
      .map(e => ({ course_id: e.course_id, due_date: e.due_date! }));

    return {
      compliant: completedCourses === requiredCourses && expiredCertificates === 0,
      required_courses: requiredCourses,
      completed_courses: completedCourses,
      expired_certificates: expiredCertificates,
      upcoming_renewals: upcomingRenewals
    };
  }

  async createHealthcareLearningPath(
    title: string,
    description: string,
    specialization: string,
    targetRole: 'Client' | 'Contractor' | 'Employee' | 'All',
    courseIds: string[]
  ): Promise<{ learning_path_id: string }> {
    const learningPathData = {
      title,
      description,
      target_role: targetRole,
      courses: courseIds.map((courseId, index) => ({
        course_id: courseId,
        order: index + 1,
        required: true
      })),
      healthcare_specialization: specialization,
      compliance_pathway: true
    };

    const response = await this.makeRequest('/learning-paths', 'POST', learningPathData);
    return { learning_path_id: response.learning_path.id };
  }

  // Certificate Management
  async issueCertificate(
    userId: string,
    courseId: string,
    certificateType: 'Completion' | 'Certification' | 'Continuing Education Units',
    ceCredits?: number
  ): Promise<{ certificate_id: string; certificate_url: string }> {
    const certificateData = {
      user_id: userId,
      course_id: courseId,
      certificate_type: certificateType,
      issue_date: new Date().toISOString(),
      ...(ceCredits && { ce_credits: ceCredits })
    };

    const response = await this.makeRequest('/certificates', 'POST', certificateData);
    return {
      certificate_id: response.certificate.certificate_id,
      certificate_url: response.certificate.download_url
    };
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    const response = await this.makeRequest(`/users/${userId}/certificates`);
    return response.certificates || [];
  }

  async verifyCertificate(certificateId: string): Promise<{
    valid: boolean;
    certificate?: Certificate;
    verification_details?: {
      verified_at: string;
      verified_by: string;
    };
  }> {
    try {
      const response = await this.makeRequest(`/certificates/${certificateId}/verify`);
      return {
        valid: true,
        certificate: response.certificate,
        verification_details: response.verification
      };
    } catch (error) {
      return { valid: false };
    }
  }

  // Reporting and Analytics
  async generateTrainingReport(
    startDate: string,
    endDate: string,
    role?: string
  ): Promise<TrainingReport> {
    const params: string[] = [`start_date=${startDate}`, `end_date=${endDate}`];
    if (role) params.push(`role=${role}`);

    const endpoint = `/reports/training?${params.join('&')}`;
    const response = await this.makeRequest(endpoint);

    return response.report;
  }

  async getCourseAnalytics(courseId: string): Promise<{
    enrollment_count: number;
    completion_rate: number;
    average_score: number;
    average_completion_time: number;
    user_feedback: {
      average_rating: number;
      total_reviews: number;
      common_feedback_themes: string[];
    };
  }> {
    const response = await this.makeRequest(`/courses/${courseId}/analytics`);
    return response.analytics;
  }

  async getComplianceDashboard(): Promise<{
    overall_compliance_rate: number;
    by_role: {
      role: string;
      compliance_rate: number;
      total_users: number;
      compliant_users: number;
    }[];
    expiring_certificates: {
      user_id: string;
      user_name: string;
      certificate_id: string;
      course_title: string;
      expiry_date: string;
    }[];
    overdue_training: {
      user_id: string;
      user_name: string;
      course_id: string;
      course_title: string;
      due_date: string;
      days_overdue: number;
    }[];
  }> {
    const response = await this.makeRequest('/reports/compliance');
    return response.compliance_dashboard;
  }

  // Bulk operations for healthcare management
  async bulkEnrollUsersInCompliance(
    userIds: string[],
    role: 'Client' | 'Contractor' | 'Employee'
  ): Promise<{ successful_enrollments: number; failed_enrollments: string[] }> {
    let successfulEnrollments = 0;
    const failedEnrollments: string[] = [];

    for (const userId of userIds) {
      try {
        await this.enrollUserInComplianceTraining(userId, role);
        successfulEnrollments++;
      } catch (error) {
        failedEnrollments.push(userId);
        console.error(`Failed to enroll user ${userId}:`, error);
      }
    }

    return { successful_enrollments: successfulEnrollments, failed_enrollments: failedEnrollments };
  }

  async renewExpiredCertificates(userId: string): Promise<{ renewed_certificates: string[] }> {
    const certificates = await this.getUserCertificates(userId);
    const expiredCerts = certificates.filter(cert => 
      cert.expiry_date && new Date(cert.expiry_date) < new Date()
    );

    const renewedCertificates: string[] = [];

    for (const cert of expiredCerts) {
      try {
        // Re-enroll user in the course for renewal
        await this.enrollUser(userId, cert.course_id);
        renewedCertificates.push(cert.id!);
      } catch (error) {
        console.error(`Failed to renew certificate ${cert.id}:`, error);
      }
    }

    return { renewed_certificates: renewedCertificates };
  }
}

export const zohoLearn = new ZohoLearnService();