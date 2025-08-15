// Zoho CRM Feedback Integration for Healthcare Platform
// Manages feedback records and integrations with CRM workflows

import { FeedbackSubmission } from './catalyst-functions/client-functions';

export interface ZohoFeedbackRecord {
  id?: string;
  Client_ID: string;
  Caregiver_ID?: string;
  Feedback_Type: 'Service Review' | 'Caregiver Review' | 'Platform Feedback' | 'Complaint' | 'Suggestion';
  Rating: 1 | 2 | 3 | 4 | 5;
  Service_Date?: string;
  Feedback_Text: string;
  Areas_Of_Concern?: string;
  Would_Recommend: boolean;
  Follow_Up_Requested: boolean;
  Anonymous: boolean;
  Status: 'Submitted' | 'Under Review' | 'Acknowledged' | 'Resolved' | 'Escalated';
  Response?: string;
  Response_Date?: string;
  Escalation_Level?: 'None' | 'Manager' | 'Director' | 'Quality Assurance';
  Created_Time?: string;
  Modified_Time?: string;
  Owner?: {
    name: string;
    id: string;
    email: string;
  };
}

export interface FeedbackAnalytics {
  total_feedback: number;
  average_rating: number;
  rating_distribution: { [key: number]: number };
  feedback_types: { [key: string]: number };
  response_times: {
    average_hours: number;
    under_24h: number;
    under_48h: number;
    over_48h: number;
  };
  caregiver_ratings: {
    caregiver_id: string;
    caregiver_name: string;
    average_rating: number;
    total_reviews: number;
    recommendation_rate: number;
  }[];
}

class ZohoFeedbackService {
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
        throw new Error(`Feedback API Error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoho Feedback API Error:', error);
      throw error;
    }
  }

  private convertFeedbackSubmissionToZoho(feedback: FeedbackSubmission): Omit<ZohoFeedbackRecord, 'id' | 'Created_Time' | 'Modified_Time' | 'Status' | 'Owner'> {
    return {
      Client_ID: feedback.client_id,
      Caregiver_ID: feedback.caregiver_id,
      Feedback_Type: feedback.feedback_type,
      Rating: feedback.rating,
      Service_Date: feedback.service_date,
      Feedback_Text: feedback.feedback_text,
      Areas_Of_Concern: feedback.areas_of_concern?.join(', '),
      Would_Recommend: feedback.would_recommend,
      Follow_Up_Requested: feedback.follow_up_requested,
      Anonymous: feedback.anonymous,
    };
  }

  // Create feedback record in Zoho CRM
  async createFeedbackRecord(feedback: FeedbackSubmission): Promise<{
    success: boolean;
    feedback_id: string;
    escalation_triggered: boolean;
    message: string;
  }> {
    try {
      const zohoRecord = this.convertFeedbackSubmissionToZoho(feedback);
      
      // Determine initial status and escalation
      let status: ZohoFeedbackRecord['Status'] = 'Submitted';
      let escalationTriggered = false;
      let escalationLevel: ZohoFeedbackRecord['Escalation_Level'] = 'None';

      // Auto-escalate based on rating and feedback type
      if (feedback.rating <= 2 || feedback.feedback_type === 'Complaint') {
        status = 'Escalated';
        escalationTriggered = true;
        escalationLevel = feedback.rating === 1 ? 'Director' : 'Manager';
      } else if (feedback.follow_up_requested) {
        status = 'Under Review';
      }

      const feedbackRecord: Partial<ZohoFeedbackRecord> = {
        ...zohoRecord,
        Status: status,
        Escalation_Level: escalationLevel,
      };

      // Create record in custom Feedback module (assuming it exists)
      const response = await this.makeRequest('/Feedback', 'POST', {
        data: [feedbackRecord]
      });

      const feedbackId = response.data[0].details.id;

      // If escalation is triggered, create workflow or task
      if (escalationTriggered) {
        await this.triggerEscalationWorkflow(feedbackId, escalationLevel, feedback);
      }

      // Update caregiver record with feedback reference
      if (feedback.caregiver_id) {
        await this.updateCaregiverFeedbackStats(feedback.caregiver_id, feedback.rating);
      }

      // Update client record with feedback activity
      await this.updateClientFeedbackActivity(feedback.client_id);

      return {
        success: true,
        feedback_id: feedbackId,
        escalation_triggered: escalationTriggered,
        message: escalationTriggered 
          ? 'Feedback submitted and escalated for immediate attention'
          : 'Feedback submitted successfully'
      };

    } catch (error) {
      console.error('Error creating feedback record:', error);
      return {
        success: false,
        feedback_id: '',
        escalation_triggered: false,
        message: error instanceof Error ? error.message : 'Failed to submit feedback'
      };
    }
  }

  // Get feedback history for a client
  async getClientFeedbackHistory(clientId: string, limit = 50): Promise<{
    success: boolean;
    feedback: ZohoFeedbackRecord[];
    total_count: number;
    message: string;
  }> {
    try {
      const response = await this.makeRequest(
        `/Feedback/search?criteria=(Client_ID:equals:${clientId})&sort_by=Created_Time&sort_order=desc&per_page=${limit}`
      );

      return {
        success: true,
        feedback: response.data || [],
        total_count: response.info?.count || 0,
        message: 'Feedback history retrieved successfully'
      };

    } catch (error) {
      console.error('Error retrieving feedback history:', error);
      return {
        success: false,
        feedback: [],
        total_count: 0,
        message: error instanceof Error ? error.message : 'Failed to retrieve feedback history'
      };
    }
  }

  // Get feedback for a specific caregiver
  async getCaregiverFeedback(caregiverId: string, limit = 50): Promise<{
    success: boolean;
    feedback: ZohoFeedbackRecord[];
    analytics: {
      average_rating: number;
      total_reviews: number;
      recommendation_rate: number;
      rating_distribution: { [key: number]: number };
    };
    message: string;
  }> {
    try {
      const response = await this.makeRequest(
        `/Feedback/search?criteria=(Caregiver_ID:equals:${caregiverId})&sort_by=Created_Time&sort_order=desc&per_page=${limit}`
      );

      const feedbackList: ZohoFeedbackRecord[] = response.data || [];
      
      // Calculate analytics
      const totalReviews = feedbackList.length;
      const averageRating = totalReviews > 0 
        ? feedbackList.reduce((sum, f) => sum + f.Rating, 0) / totalReviews 
        : 0;
      
      const recommendationRate = totalReviews > 0
        ? feedbackList.filter(f => f.Would_Recommend).length / totalReviews
        : 0;

      const ratingDistribution = [1, 2, 3, 4, 5].reduce((dist, rating) => {
        dist[rating] = feedbackList.filter(f => f.Rating === rating).length;
        return dist;
      }, {} as { [key: number]: number });

      return {
        success: true,
        feedback: feedbackList,
        analytics: {
          average_rating: Number(averageRating.toFixed(2)),
          total_reviews: totalReviews,
          recommendation_rate: Number(recommendationRate.toFixed(2)),
          rating_distribution: ratingDistribution
        },
        message: 'Caregiver feedback retrieved successfully'
      };

    } catch (error) {
      console.error('Error retrieving caregiver feedback:', error);
      return {
        success: false,
        feedback: [],
        analytics: {
          average_rating: 0,
          total_reviews: 0,
          recommendation_rate: 0,
          rating_distribution: {}
        },
        message: error instanceof Error ? error.message : 'Failed to retrieve caregiver feedback'
      };
    }
  }

  // Update feedback status and add response
  async updateFeedbackStatus(
    feedbackId: string, 
    status: ZohoFeedbackRecord['Status'],
    response?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updateData: Partial<ZohoFeedbackRecord> = {
        Status: status,
        ...(response && {
          Response: response,
          Response_Date: new Date().toISOString()
        })
      };

      await this.makeRequest(`/Feedback/${feedbackId}`, 'PUT', {
        data: [{ id: feedbackId, ...updateData }]
      });

      return {
        success: true,
        message: 'Feedback status updated successfully'
      };

    } catch (error) {
      console.error('Error updating feedback status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update feedback status'
      };
    }
  }

  // Get comprehensive feedback analytics
  async getFeedbackAnalytics(dateRange?: { start: string; end: string }): Promise<{
    success: boolean;
    analytics: FeedbackAnalytics;
    message: string;
  }> {
    try {
      let criteria = '';
      if (dateRange) {
        criteria = `(Created_Time:between:${dateRange.start}and${dateRange.end})`;
      }

      const response = await this.makeRequest(
        `/Feedback${criteria ? `/search?criteria=${criteria}&per_page=1000` : '?per_page=1000'}`
      );

      const feedbackList: ZohoFeedbackRecord[] = response.data || [];
      const totalFeedback = feedbackList.length;

      if (totalFeedback === 0) {
        return {
          success: true,
          analytics: {
            total_feedback: 0,
            average_rating: 0,
            rating_distribution: {},
            feedback_types: {},
            response_times: { average_hours: 0, under_24h: 0, under_48h: 0, over_48h: 0 },
            caregiver_ratings: []
          },
          message: 'No feedback data available for the specified period'
        };
      }

      // Calculate average rating
      const averageRating = feedbackList.reduce((sum, f) => sum + f.Rating, 0) / totalFeedback;

      // Rating distribution
      const ratingDistribution = [1, 2, 3, 4, 5].reduce((dist, rating) => {
        dist[rating] = feedbackList.filter(f => f.Rating === rating).length;
        return dist;
      }, {} as { [key: number]: number });

      // Feedback types distribution
      const feedbackTypes = feedbackList.reduce((types, f) => {
        types[f.Feedback_Type] = (types[f.Feedback_Type] || 0) + 1;
        return types;
      }, {} as { [key: string]: number });

      // Response times calculation
      const respondedFeedback = feedbackList.filter(f => f.Response_Date && f.Created_Time);
      const responseTimes = {
        average_hours: 0,
        under_24h: 0,
        under_48h: 0,
        over_48h: 0
      };

      if (respondedFeedback.length > 0) {
        const totalHours = respondedFeedback.reduce((sum, f) => {
          const created = new Date(f.Created_Time!).getTime();
          const responded = new Date(f.Response_Date!).getTime();
          return sum + (responded - created) / (1000 * 60 * 60); // Convert to hours
        }, 0);

        responseTimes.average_hours = Number((totalHours / respondedFeedback.length).toFixed(2));
        responseTimes.under_24h = respondedFeedback.filter(f => {
          const hours = (new Date(f.Response_Date!).getTime() - new Date(f.Created_Time!).getTime()) / (1000 * 60 * 60);
          return hours <= 24;
        }).length;
        responseTimes.under_48h = respondedFeedback.filter(f => {
          const hours = (new Date(f.Response_Date!).getTime() - new Date(f.Created_Time!).getTime()) / (1000 * 60 * 60);
          return hours > 24 && hours <= 48;
        }).length;
        responseTimes.over_48h = respondedFeedback.filter(f => {
          const hours = (new Date(f.Response_Date!).getTime() - new Date(f.Created_Time!).getTime()) / (1000 * 60 * 60);
          return hours > 48;
        }).length;
      }

      // Caregiver ratings
      const caregiverMap = new Map<string, ZohoFeedbackRecord[]>();
      feedbackList
        .filter(f => f.Caregiver_ID)
        .forEach(f => {
          const caregiverId = f.Caregiver_ID!;
          if (!caregiverMap.has(caregiverId)) {
            caregiverMap.set(caregiverId, []);
          }
          caregiverMap.get(caregiverId)!.push(f);
        });

      const caregiverRatings = Array.from(caregiverMap.entries()).map(([caregiverId, feedback]) => {
        const totalReviews = feedback.length;
        const averageRating = feedback.reduce((sum, f) => sum + f.Rating, 0) / totalReviews;
        const recommendationRate = feedback.filter(f => f.Would_Recommend).length / totalReviews;

        return {
          caregiver_id: caregiverId,
          caregiver_name: 'Caregiver Name', // This would need to be fetched from contacts
          average_rating: Number(averageRating.toFixed(2)),
          total_reviews: totalReviews,
          recommendation_rate: Number(recommendationRate.toFixed(2))
        };
      });

      return {
        success: true,
        analytics: {
          total_feedback: totalFeedback,
          average_rating: Number(averageRating.toFixed(2)),
          rating_distribution: ratingDistribution,
          feedback_types: feedbackTypes,
          response_times: responseTimes,
          caregiver_ratings: caregiverRatings
        },
        message: 'Analytics retrieved successfully'
      };

    } catch (error) {
      console.error('Error retrieving feedback analytics:', error);
      return {
        success: false,
        analytics: {
          total_feedback: 0,
          average_rating: 0,
          rating_distribution: {},
          feedback_types: {},
          response_times: { average_hours: 0, under_24h: 0, under_48h: 0, over_48h: 0 },
          caregiver_ratings: []
        },
        message: error instanceof Error ? error.message : 'Failed to retrieve analytics'
      };
    }
  }

  // Private helper methods
  private async triggerEscalationWorkflow(
    feedbackId: string, 
    escalationLevel: ZohoFeedbackRecord['Escalation_Level'],
    feedback: FeedbackSubmission
  ): Promise<void> {
    try {
      // Create a task for the appropriate team based on escalation level
      const taskData = {
        Subject: `Urgent Feedback Review - Rating: ${feedback.rating}/5`,
        Description: `Feedback ID: ${feedbackId}\nClient ID: ${feedback.client_id}\nType: ${feedback.feedback_type}\nDetails: ${feedback.feedback_text}`,
        Priority: escalationLevel === 'Director' ? 'High' : 'Medium',
        Status: 'Not Started',
        Due_Date: new Date(Date.now() + (escalationLevel === 'Director' ? 4 : 24) * 60 * 60 * 1000).toISOString()
      };

      await this.makeRequest('/Tasks', 'POST', {
        data: [taskData]
      });

    } catch (error) {
      console.error('Error triggering escalation workflow:', error);
    }
  }

  private async updateCaregiverFeedbackStats(caregiverId: string, rating: number): Promise<void> {
    try {
      // This would update the caregiver's contact record with updated feedback stats
      // Implementation would depend on custom fields in the CRM
      const statsUpdate = {
        Last_Feedback_Rating: rating,
        Last_Feedback_Date: new Date().toISOString()
      };

      await this.makeRequest(`/Contacts/${caregiverId}`, 'PUT', {
        data: [{ id: caregiverId, ...statsUpdate }]
      });

    } catch (error) {
      console.error('Error updating caregiver feedback stats:', error);
    }
  }

  private async updateClientFeedbackActivity(clientId: string): Promise<void> {
    try {
      // Update client record with last feedback activity
      const activityUpdate = {
        Last_Feedback_Date: new Date().toISOString()
      };

      await this.makeRequest(`/Contacts/${clientId}`, 'PUT', {
        data: [{ id: clientId, ...activityUpdate }]
      });

    } catch (error) {
      console.error('Error updating client feedback activity:', error);
    }
  }
}

export const zohoFeedback = new ZohoFeedbackService();