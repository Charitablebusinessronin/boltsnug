// Zoho Zia Integration for Healthcare Platform
// OCR processing, sentiment analysis, AI matching, and intelligent automation

export interface OCRResult {
  id?: string;
  document_type: 'Medical Record' | 'Insurance Card' | 'License' | 'Certification' | 'Contract' | 'Form' | 'Other';
  extracted_text: string;
  confidence_score: number;
  structured_data: {
    fields: {
      field_name: string;
      field_value: string;
      confidence: number;
      coordinates?: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
    }[];
    tables?: {
      headers: string[];
      rows: string[][];
    }[];
  };
  healthcare_entities: {
    person_names: string[];
    medical_conditions: string[];
    medications: string[];
    dates: string[];
    phone_numbers: string[];
    addresses: string[];
    medical_numbers: string[];
  };
  processed_at: string;
  file_url: string;
  file_name: string;
}

export interface SentimentAnalysis {
  id?: string;
  text: string;
  overall_sentiment: 'Positive' | 'Negative' | 'Neutral';
  sentiment_score: number; // -1 to 1
  emotions: {
    emotion: 'Joy' | 'Anger' | 'Fear' | 'Sadness' | 'Surprise' | 'Disgust' | 'Trust' | 'Anticipation';
    confidence: number;
  }[];
  healthcare_context: {
    satisfaction_indicators: string[];
    concern_indicators: string[];
    urgency_level: 'Low' | 'Medium' | 'High';
    pain_points: string[];
    positive_mentions: string[];
  };
  key_phrases: {
    phrase: string;
    sentiment: 'Positive' | 'Negative' | 'Neutral';
    relevance_score: number;
  }[];
  processed_at: string;
}

export interface CaregiverMatchResult {
  caregiver_id: string;
  caregiver_name: string;
  match_score: number; // 0 to 1
  match_factors: {
    factor: string;
    importance: number;
    score: number;
    explanation: string;
  }[];
  availability: {
    available: boolean;
    next_available_date?: string;
    preferred_schedule: string[];
  };
  qualifications: {
    certifications: string[];
    specializations: string[];
    experience_years: number;
    languages: string[];
  };
  client_reviews: {
    average_rating: number;
    total_reviews: number;
    recent_feedback: string[];
  };
  location_compatibility: {
    distance_miles: number;
    travel_time_minutes: number;
    service_area: string;
  };
}

export interface AIInsight {
  id?: string;
  insight_type: 'Predictive' | 'Recommendation' | 'Alert' | 'Trend' | 'Anomaly';
  category: 'Client Care' | 'Operational' | 'Financial' | 'Compliance' | 'Quality';
  title: string;
  description: string;
  confidence_level: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  actionable_recommendations: {
    action: string;
    expected_impact: string;
    effort_level: 'Low' | 'Medium' | 'High';
  }[];
  supporting_data: {
    data_points: { metric: string; value: string | number; trend?: 'Up' | 'Down' | 'Stable' }[];
    time_period: string;
    sample_size?: number;
  };
  healthcare_impact: {
    client_satisfaction_impact: 'Positive' | 'Negative' | 'Neutral';
    care_quality_impact: 'Positive' | 'Negative' | 'Neutral';
    operational_efficiency: 'Positive' | 'Negative' | 'Neutral';
    cost_impact: 'Savings' | 'Cost' | 'Neutral';
  };
  generated_at: string;
  expires_at?: string;
}

export interface TextAnalysisRequest {
  text: string;
  analysis_type: 'Sentiment' | 'Entity Extraction' | 'Key Phrases' | 'Language Detection' | 'All';
  healthcare_context?: {
    document_type: string;
    client_id?: string;
    care_episode?: string;
  };
}

export interface EntityExtractionResult {
  entities: {
    entity_type: 'Person' | 'Location' | 'Organization' | 'Medical Condition' | 'Medication' | 'Date' | 'Phone' | 'Email';
    entity_value: string;
    confidence: number;
    start_position: number;
    end_position: number;
    healthcare_category?: string;
  }[];
  medical_entities: {
    conditions: string[];
    medications: string[];
    procedures: string[];
    symptoms: string[];
    body_parts: string[];
  };
}

class ZohoZiaService {
  private baseURL = 'https://zia.zoho.com/api/v1';
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = import.meta.env.VITE_ZOHO_ZIA_ACCESS_TOKEN || null;
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: unknown, isFormData = false) {
    if (!this.accessToken) {
      throw new Error('Zoho Zia access token not configured');
    }

    const headers: HeadersInit = {
      'Authorization': `Zoho-oauthtoken ${this.accessToken}`,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      if (isFormData) {
        config.body = data as FormData;
      } else if (method === 'POST' || method === 'PUT') {
        config.body = JSON.stringify(data);
      }
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Zia API Error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoho Zia API Error:', error);
      throw error;
    }
  }

  // OCR Processing
  async processDocument(
    file: File | Blob,
    documentType: 'Medical Record' | 'Insurance Card' | 'License' | 'Certification' | 'Contract' | 'Form' | 'Other'
  ): Promise<OCRResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    formData.append('extract_tables', 'true');
    formData.append('healthcare_mode', 'true');

    const response = await this.makeRequest('/ocr/extract', 'POST', formData, true);
    
    return {
      document_type: documentType,
      extracted_text: response.extracted_text,
      confidence_score: response.confidence_score,
      structured_data: response.structured_data,
      healthcare_entities: await this.extractHealthcareEntities(response.extracted_text),
      processed_at: new Date().toISOString(),
      file_url: response.file_url || '',
      file_name: file instanceof File ? file.name : 'uploaded_document'
    };
  }

  async extractHealthcareEntities(text: string): Promise<OCRResult['healthcare_entities']> {
    const entityResponse = await this.makeRequest('/nlp/extract-entities', 'POST', {
      text,
      entity_types: ['PERSON', 'MEDICAL_CONDITION', 'MEDICATION', 'DATE', 'PHONE', 'ADDRESS', 'MEDICAL_NUMBER'],
      healthcare_context: true
    });

    return {
      person_names: entityResponse.entities?.filter((e: { type: string }) => e.type === 'PERSON').map((e: { value: string }) => e.value) || [],
      medical_conditions: entityResponse.entities?.filter((e: { type: string }) => e.type === 'MEDICAL_CONDITION').map((e: { value: string }) => e.value) || [],
      medications: entityResponse.entities?.filter((e: { type: string }) => e.type === 'MEDICATION').map((e: { value: string }) => e.value) || [],
      dates: entityResponse.entities?.filter((e: { type: string }) => e.type === 'DATE').map((e: { value: string }) => e.value) || [],
      phone_numbers: entityResponse.entities?.filter((e: { type: string }) => e.type === 'PHONE').map((e: { value: string }) => e.value) || [],
      addresses: entityResponse.entities?.filter((e: { type: string }) => e.type === 'ADDRESS').map((e: { value: string }) => e.value) || [],
      medical_numbers: entityResponse.entities?.filter((e: { type: string }) => e.type === 'MEDICAL_NUMBER').map((e: { value: string }) => e.value) || []
    };
  }

  // Sentiment Analysis
  async analyzeSentiment(
    text: string,
    healthcareContext?: {
      document_type: string;
      client_id?: string;
      care_episode?: string;
    }
  ): Promise<SentimentAnalysis> {
    const response = await this.makeRequest('/nlp/sentiment', 'POST', {
      text,
      context: healthcareContext,
      detailed_analysis: true,
      healthcare_specific: true
    });

    return {
      text,
      overall_sentiment: response.overall_sentiment,
      sentiment_score: response.sentiment_score,
      emotions: response.emotions || [],
      healthcare_context: {
        satisfaction_indicators: response.healthcare_analysis?.satisfaction_indicators || [],
        concern_indicators: response.healthcare_analysis?.concern_indicators || [],
        urgency_level: response.healthcare_analysis?.urgency_level || 'Low',
        pain_points: response.healthcare_analysis?.pain_points || [],
        positive_mentions: response.healthcare_analysis?.positive_mentions || []
      },
      key_phrases: response.key_phrases || [],
      processed_at: new Date().toISOString()
    };
  }

  async analyzeFeedbackBatch(feedbacks: {
    id: string;
    text: string;
    client_id: string;
    service_type: string;
  }[]): Promise<{
    overall_satisfaction: number;
    sentiment_breakdown: { positive: number; negative: number; neutral: number };
    common_themes: { theme: string; sentiment: string; frequency: number }[];
    action_items: { priority: string; action: string; affected_clients: string[] }[];
  }> {
    const analysisResults: SentimentAnalysis[] = [];
    
    for (const feedback of feedbacks) {
      try {
        const analysis = await this.analyzeSentiment(feedback.text, {
          document_type: 'Client Feedback',
          client_id: feedback.client_id
        });
        analysisResults.push(analysis);
      } catch (error) {
        console.error(`Error analyzing feedback ${feedback.id}:`, error);
      }
    }

    // Calculate overall metrics
    const sentimentScores = analysisResults.map(a => a.sentiment_score);
    const overallSatisfaction = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;

    const sentimentBreakdown = {
      positive: analysisResults.filter(a => a.overall_sentiment === 'Positive').length,
      negative: analysisResults.filter(a => a.overall_sentiment === 'Negative').length,
      neutral: analysisResults.filter(a => a.overall_sentiment === 'Neutral').length
    };

    // Extract common themes (simplified implementation)
    const allConcerns = analysisResults.flatMap(a => a.healthcare_context.concern_indicators);
    const commonThemes = this.extractCommonThemes(allConcerns);

    return {
      overall_satisfaction: overallSatisfaction,
      sentiment_breakdown: sentimentBreakdown,
      common_themes: commonThemes,
      action_items: this.generateActionItems(analysisResults, feedbacks)
    };
  }

  // AI-Powered Caregiver Matching
  async findBestCaregiverMatch(
    clientProfile: {
      client_id: string;
      care_needs: string[];
      location: { latitude: number; longitude: number };
      preferred_schedule: string[];
      language_preference?: string;
      special_requirements?: string[];
      budget_range?: { min: number; max: number };
    },
    availableCaregivers: {
      caregiver_id: string;
      specializations: string[];
      location: { latitude: number; longitude: number };
      availability: string[];
      hourly_rate: number;
      languages: string[];
      certifications: string[];
      ratings: { average: number; total: number };
    }[]
  ): Promise<CaregiverMatchResult[]> {
    const matchingRequest = {
      client_profile: clientProfile,
      caregivers: availableCaregivers,
      matching_criteria: {
        specialization_weight: 0.3,
        location_weight: 0.25,
        availability_weight: 0.2,
        rating_weight: 0.15,
        cost_weight: 0.1
      },
      max_results: 5
    };

    const response = await this.makeRequest('/ai/caregiver-matching', 'POST', matchingRequest);

    return response.matches?.map((match: {
      caregiver_id: string;
      match_score: number;
      match_factors: { factor: string; importance: number; score: number; explanation: string }[];
      caregiver_details: {
        name: string;
        certifications: string[];
        specializations: string[];
        experience_years: number;
        languages: string[];
        average_rating: number;
        total_reviews: number;
        recent_feedback: string[];
      };
      availability: { available: boolean; next_available_date?: string; preferred_schedule: string[] };
      location_info: { distance_miles: number; travel_time_minutes: number; service_area: string };
    }) => ({
      caregiver_id: match.caregiver_id,
      caregiver_name: match.caregiver_details.name,
      match_score: match.match_score,
      match_factors: match.match_factors,
      availability: match.availability,
      qualifications: {
        certifications: match.caregiver_details.certifications,
        specializations: match.caregiver_details.specializations,
        experience_years: match.caregiver_details.experience_years,
        languages: match.caregiver_details.languages
      },
      client_reviews: {
        average_rating: match.caregiver_details.average_rating,
        total_reviews: match.caregiver_details.total_reviews,
        recent_feedback: match.caregiver_details.recent_feedback
      },
      location_compatibility: match.location_info
    })) || [];
  }

  // AI Insights and Predictions
  async generateHealthcareInsights(
    dataScope: {
      time_period: { start: string; end: string };
      include_metrics: ('client_satisfaction' | 'operational_efficiency' | 'financial_performance' | 'quality_indicators')[];
      client_segments?: string[];
      service_types?: string[];
    }
  ): Promise<AIInsight[]> {
    const response = await this.makeRequest('/ai/healthcare-insights', 'POST', {
      scope: dataScope,
      insight_types: ['predictive', 'recommendation', 'trend', 'anomaly'],
      confidence_threshold: 0.7
    });

    return response.insights?.map((insight: {
      type: string;
      category: string;
      title: string;
      description: string;
      confidence: number;
      priority: string;
      recommendations: { action: string; impact: string; effort: string }[];
      data: { metrics: { metric: string; value: string | number; trend?: string }[]; period: string; samples?: number };
      healthcare_impact: {
        satisfaction: string;
        quality: string;
        efficiency: string;
        cost: string;
      };
      generated_at: string;
      expires_at?: string;
    }) => ({
      insight_type: insight.type as AIInsight['insight_type'],
      category: insight.category as AIInsight['category'],
      title: insight.title,
      description: insight.description,
      confidence_level: insight.confidence,
      priority: insight.priority as AIInsight['priority'],
      actionable_recommendations: insight.recommendations.map(rec => ({
        action: rec.action,
        expected_impact: rec.impact,
        effort_level: rec.effort as 'Low' | 'Medium' | 'High'
      })),
      supporting_data: {
        data_points: insight.data.metrics.map(m => ({
          metric: m.metric,
          value: m.value,
          trend: m.trend as 'Up' | 'Down' | 'Stable' | undefined
        })),
        time_period: insight.data.period,
        sample_size: insight.data.samples
      },
      healthcare_impact: {
        client_satisfaction_impact: insight.healthcare_impact.satisfaction as 'Positive' | 'Negative' | 'Neutral',
        care_quality_impact: insight.healthcare_impact.quality as 'Positive' | 'Negative' | 'Neutral',
        operational_efficiency: insight.healthcare_impact.efficiency as 'Positive' | 'Negative' | 'Neutral',
        cost_impact: insight.healthcare_impact.cost as 'Savings' | 'Cost' | 'Neutral'
      },
      generated_at: insight.generated_at,
      expires_at: insight.expires_at
    })) || [];
  }

  async predictClientChurn(clientIds: string[]): Promise<{
    predictions: {
      client_id: string;
      churn_probability: number;
      risk_level: 'Low' | 'Medium' | 'High';
      key_factors: { factor: string; importance: number }[];
      recommended_actions: string[];
    }[];
    model_accuracy: number;
  }> {
    const response = await this.makeRequest('/ai/churn-prediction', 'POST', {
      client_ids: clientIds,
      prediction_horizon_days: 90,
      include_recommendations: true
    });

    return response;
  }

  // Text Processing Utilities
  async processText(request: TextAnalysisRequest): Promise<{
    sentiment?: SentimentAnalysis;
    entities?: EntityExtractionResult;
    key_phrases?: { phrase: string; relevance: number }[];
    language?: { code: string; confidence: number };
  }> {
    const results: {
      sentiment?: SentimentAnalysis;
      entities?: EntityExtractionResult;
      key_phrases?: { phrase: string; relevance: number }[];
      language?: { code: string; confidence: number };
    } = {};

    if (request.analysis_type === 'Sentiment' || request.analysis_type === 'All') {
      results.sentiment = await this.analyzeSentiment(request.text, request.healthcare_context);
    }

    if (request.analysis_type === 'Entity Extraction' || request.analysis_type === 'All') {
      const entityResponse = await this.makeRequest('/nlp/extract-entities', 'POST', {
        text: request.text,
        healthcare_context: true
      });
      results.entities = entityResponse;
    }

    if (request.analysis_type === 'Key Phrases' || request.analysis_type === 'All') {
      const phrasesResponse = await this.makeRequest('/nlp/key-phrases', 'POST', {
        text: request.text
      });
      results.key_phrases = phrasesResponse.key_phrases;
    }

    if (request.analysis_type === 'Language Detection' || request.analysis_type === 'All') {
      const languageResponse = await this.makeRequest('/nlp/detect-language', 'POST', {
        text: request.text
      });
      results.language = languageResponse.language;
    }

    return results;
  }

  // Helper methods
  private extractCommonThemes(concerns: string[]): { theme: string; sentiment: string; frequency: number }[] {
    const themeMap = new Map<string, number>();
    
    concerns.forEach(concern => {
      const theme = concern.toLowerCase();
      themeMap.set(theme, (themeMap.get(theme) || 0) + 1);
    });

    return Array.from(themeMap.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Top 10 themes
      .map(([theme, frequency]) => ({
        theme,
        sentiment: 'Negative', // Concerns are typically negative
        frequency
      }));
  }

  private generateActionItems(
    analyses: SentimentAnalysis[],
    feedbacks: { id: string; text: string; client_id: string; service_type: string }[]
  ): { priority: string; action: string; affected_clients: string[] }[] {
    const actionItems: { priority: string; action: string; affected_clients: string[] }[] = [];

    // Find high-priority issues
    const urgentConcerns = analyses.filter(a => a.healthcare_context.urgency_level === 'High');
    if (urgentConcerns.length > 0) {
      actionItems.push({
        priority: 'High',
        action: 'Immediate follow-up required for urgent client concerns',
        affected_clients: urgentConcerns.map((_, index) => feedbacks[index]?.client_id || 'unknown')
      });
    }

    // Find common pain points
    const allPainPoints = analyses.flatMap(a => a.healthcare_context.pain_points);
    if (allPainPoints.length > 2) {
      actionItems.push({
        priority: 'Medium',
        action: 'Address recurring service quality issues',
        affected_clients: feedbacks.slice(0, 3).map(f => f.client_id)
      });
    }

    return actionItems;
  }
}

export const zohoZia = new ZohoZiaService();