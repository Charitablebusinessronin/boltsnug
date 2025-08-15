// Zoho Calendar Integration for Healthcare Platform
// Interview scheduling, appointments, and healthcare events

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start_time: string; // ISO 8601 format
  end_time: string;   // ISO 8601 format
  location?: string;
  event_type: 'Interview' | 'Consultation' | 'Care Session' | 'Follow-up' | 'Training' | 'Meeting';
  participants: {
    email: string;
    name: string;
    role: 'Client' | 'Contractor' | 'Admin' | 'Employee' | 'Care Coordinator';
    status: 'Invited' | 'Accepted' | 'Declined' | 'Tentative';
  }[];
  healthcare_details?: {
    client_id?: string;
    contractor_id?: string;
    care_type?: string;
    session_notes?: string;
    pre_appointment_requirements?: string[];
  };
  reminder?: {
    method: 'Email' | 'SMS' | 'Push';
    minutes_before: number;
  }[];
  recurrence?: {
    frequency: 'Daily' | 'Weekly' | 'Monthly';
    interval: number;
    end_date?: string;
    days_of_week?: string[]; // For weekly recurrence
  };
  created_time?: string;
  modified_time?: string;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled' | 'Rescheduled';
  calendar_id?: string;
}

export interface CalendarAvailability {
  date: string;
  time_slots: {
    start_time: string;
    end_time: string;
    available: boolean;
    event_id?: string;
    event_title?: string;
  }[];
}

export interface InterviewSchedulingRequest {
  candidate_email: string;
  candidate_name: string;
  position: string;
  interviewer_emails: string[];
  preferred_dates: string[];
  duration_minutes: number;
  interview_type: 'Phone' | 'Video' | 'In-Person';
  location?: string;
  requirements?: string[];
}

class ZohoCalendarService {
  private baseURL = 'https://calendar.zoho.com/api/v1';
  private accessToken: string | null = null;
  private defaultCalendarId: string;

  constructor() {
    this.accessToken = import.meta.env.VITE_ZOHO_CALENDAR_ACCESS_TOKEN || null;
    this.defaultCalendarId = import.meta.env.VITE_ZOHO_CALENDAR_ID || 'primary';
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: unknown) {
    if (!this.accessToken) {
      throw new Error('Zoho Calendar access token not configured');
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
        throw new Error(`Calendar API Error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Zoho Calendar API Error:', error);
      throw error;
    }
  }

  // Event Management
  async getEvents(
    calendarId: string = this.defaultCalendarId,
    startDate?: string,
    endDate?: string,
    eventType?: string
  ): Promise<CalendarEvent[]> {
    let endpoint = `/calendars/${calendarId}/events`;
    const params: string[] = [];

    if (startDate) params.push(`start=${startDate}`);
    if (endDate) params.push(`end=${endDate}`);
    if (eventType) params.push(`eventType=${eventType}`);

    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }

    const response = await this.makeRequest(endpoint);
    return response.events || [];
  }

  async getEvent(eventId: string, calendarId: string = this.defaultCalendarId): Promise<CalendarEvent> {
    const response = await this.makeRequest(`/calendars/${calendarId}/events/${eventId}`);
    return response.event;
  }

  async createEvent(event: Omit<CalendarEvent, 'id' | 'created_time' | 'modified_time'>, calendarId: string = this.defaultCalendarId): Promise<{ id: string; status: string }> {
    const response = await this.makeRequest(`/calendars/${calendarId}/events`, 'POST', {
      event: {
        ...event,
        dateandtime: {
          start: event.start_time,
          end: event.end_time,
          timezone: 'America/New_York' // Default timezone, should be configurable
        },
        venue: event.location,
        attendees: event.participants.map(p => ({
          email: p.email,
          name: p.name,
          status: p.status.toLowerCase()
        }))
      }
    });
    return { id: response.event.uid, status: response.status };
  }

  async updateEvent(
    eventId: string,
    event: Partial<CalendarEvent>,
    calendarId: string = this.defaultCalendarId
  ): Promise<{ id: string; status: string }> {
    const updateData = {
      event: {
        ...event,
        ...(event.start_time && event.end_time && {
          dateandtime: {
            start: event.start_time,
            end: event.end_time,
            timezone: 'America/New_York'
          }
        }),
        ...(event.location && { venue: event.location }),
        ...(event.participants && {
          attendees: event.participants.map(p => ({
            email: p.email,
            name: p.name,
            status: p.status.toLowerCase()
          }))
        })
      }
    };

    const response = await this.makeRequest(`/calendars/${calendarId}/events/${eventId}`, 'PUT', updateData);
    return { id: response.event.uid, status: response.status };
  }

  async deleteEvent(eventId: string, calendarId: string = this.defaultCalendarId): Promise<{ status: string }> {
    const response = await this.makeRequest(`/calendars/${calendarId}/events/${eventId}`, 'DELETE');
    return { status: response.status };
  }

  // Healthcare-specific scheduling methods
  async scheduleClientInterview(request: InterviewSchedulingRequest): Promise<{ event_id: string; scheduled_time: string }> {
    // Find available time slot
    const availableSlot = await this.findAvailableTimeSlot(
      request.interviewer_emails,
      request.preferred_dates,
      request.duration_minutes
    );

    if (!availableSlot) {
      throw new Error('No available time slots found for the requested dates');
    }

    // Create interview event
    const event: Omit<CalendarEvent, 'id' | 'created_time' | 'modified_time'> = {
      title: `Healthcare Interview - ${request.candidate_name} (${request.position})`,
      description: `Interview for ${request.position} position\n\nCandidate: ${request.candidate_name}\nType: ${request.interview_type}\n\nRequirements:\n${request.requirements?.join('\n') || 'None'}`,
      start_time: availableSlot.start_time,
      end_time: availableSlot.end_time,
      location: request.location || (request.interview_type === 'Video' ? 'Video Conference' : 'TBD'),
      event_type: 'Interview',
      participants: [
        {
          email: request.candidate_email,
          name: request.candidate_name,
          role: 'Client',
          status: 'Invited'
        },
        ...request.interviewer_emails.map(email => ({
          email,
          name: 'Interviewer',
          role: 'Employee' as const,
          status: 'Invited' as const
        }))
      ],
      healthcare_details: {
        care_type: request.position,
        pre_appointment_requirements: request.requirements
      },
      reminder: [
        { method: 'Email', minutes_before: 60 },
        { method: 'Email', minutes_before: 15 }
      ],
      status: 'Scheduled'
    };

    const result = await this.createEvent(event);
    return {
      event_id: result.id,
      scheduled_time: availableSlot.start_time
    };
  }

  async scheduleConsultation(
    clientEmail: string,
    contractorEmail: string,
    consultationType: string,
    preferredDates: string[],
    durationMinutes: number = 60
  ): Promise<{ event_id: string; scheduled_time: string }> {
    const availableSlot = await this.findAvailableTimeSlot(
      [clientEmail, contractorEmail],
      preferredDates,
      durationMinutes
    );

    if (!availableSlot) {
      throw new Error('No available time slots found for consultation');
    }

    const event: Omit<CalendarEvent, 'id' | 'created_time' | 'modified_time'> = {
      title: `Healthcare Consultation - ${consultationType}`,
      description: `Healthcare consultation session\n\nType: ${consultationType}\nDuration: ${durationMinutes} minutes`,
      start_time: availableSlot.start_time,
      end_time: availableSlot.end_time,
      location: 'Video Conference',
      event_type: 'Consultation',
      participants: [
        {
          email: clientEmail,
          name: 'Client',
          role: 'Client',
          status: 'Invited'
        },
        {
          email: contractorEmail,
          name: 'Healthcare Provider',
          role: 'Contractor',
          status: 'Invited'
        }
      ],
      healthcare_details: {
        care_type: consultationType
      },
      reminder: [
        { method: 'Email', minutes_before: 60 },
        { method: 'SMS', minutes_before: 15 }
      ],
      status: 'Scheduled'
    };

    const result = await this.createEvent(event);
    return {
      event_id: result.id,
      scheduled_time: availableSlot.start_time
    };
  }

  async scheduleRecurringCareSession(
    clientEmail: string,
    contractorEmail: string,
    careType: string,
    startDate: string,
    frequency: 'Daily' | 'Weekly' | 'Monthly',
    interval: number,
    endDate: string,
    sessionDuration: number = 120
  ): Promise<{ event_id: string; recurrence_id: string }> {
    const startTime = new Date(startDate);
    const endTime = new Date(startTime.getTime() + sessionDuration * 60000);

    const event: Omit<CalendarEvent, 'id' | 'created_time' | 'modified_time'> = {
      title: `Recurring Care Session - ${careType}`,
      description: `Regular healthcare session\n\nCare Type: ${careType}\nDuration: ${sessionDuration} minutes`,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      location: 'Client Location',
      event_type: 'Care Session',
      participants: [
        {
          email: clientEmail,
          name: 'Client',
          role: 'Client',
          status: 'Accepted'
        },
        {
          email: contractorEmail,
          name: 'Healthcare Provider',
          role: 'Contractor',
          status: 'Accepted'
        }
      ],
      healthcare_details: {
        care_type: careType
      },
      recurrence: {
        frequency,
        interval,
        end_date: endDate
      },
      reminder: [
        { method: 'Email', minutes_before: 120 },
        { method: 'SMS', minutes_before: 30 }
      ],
      status: 'Confirmed'
    };

    const result = await this.createEvent(event);
    return {
      event_id: result.id,
      recurrence_id: result.id // Zoho returns the main event ID for recurring events
    };
  }

  // Availability checking
  async getAvailability(
    emails: string[],
    startDate: string,
    endDate: string
  ): Promise<{ [email: string]: CalendarAvailability[] }> {
    const availability: { [email: string]: CalendarAvailability[] } = {};

    for (const email of emails) {
      try {
        // Get calendar events for the user
        const events = await this.getEvents('primary', startDate, endDate);
        
        // Process availability (this would need to be enhanced based on Zoho Calendar's actual free/busy API)
        availability[email] = await this.processAvailability(events, startDate, endDate);
      } catch (error) {
        console.error(`Error getting availability for ${email}:`, error);
        availability[email] = [];
      }
    }

    return availability;
  }

  private async findAvailableTimeSlot(
    participantEmails: string[],
    preferredDates: string[],
    durationMinutes: number
  ): Promise<{ start_time: string; end_time: string } | null> {
    for (const date of preferredDates) {
      const startOfDay = new Date(date);
      startOfDay.setHours(9, 0, 0, 0); // Start checking from 9 AM

      const endOfDay = new Date(date);
      endOfDay.setHours(17, 0, 0, 0); // End checking at 5 PM

      // Check for available slots in 30-minute intervals
      for (let time = startOfDay; time < endOfDay; time.setMinutes(time.getMinutes() + 30)) {
        const slotEnd = new Date(time.getTime() + durationMinutes * 60000);
        
        if (slotEnd > endOfDay) break;

        // Check if this slot is available for all participants
        const isAvailable = await this.isTimeSlotAvailable(
          participantEmails,
          time.toISOString(),
          slotEnd.toISOString()
        );

        if (isAvailable) {
          return {
            start_time: time.toISOString(),
            end_time: slotEnd.toISOString()
          };
        }
      }
    }

    return null;
  }

  private async isTimeSlotAvailable(
    participantEmails: string[],
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    // This would need to be implemented based on Zoho Calendar's free/busy API
    // For now, we'll assume the slot is available (in a real implementation,
    // you would check each participant's calendar for conflicts)
    
    try {
      // Get events for the time period
      const events = await this.getEvents('primary', startTime, endTime);
      
      // Check if any events conflict with the proposed time slot
      const conflicts = events.filter(event => {
        const eventStart = new Date(event.start_time);
        const eventEnd = new Date(event.end_time);
        const slotStart = new Date(startTime);
        const slotEnd = new Date(endTime);
        
        return (slotStart < eventEnd && slotEnd > eventStart);
      });

      return conflicts.length === 0;
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return false;
    }
  }

  private async processAvailability(events: CalendarEvent[], startDate: string, endDate: string): Promise<CalendarAvailability[]> {
    const availability: CalendarAvailability[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate availability for each day
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayStart = new Date(date);
      dayStart.setHours(9, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(17, 0, 0, 0);

      const timeSlots = [];
      
      // Create 30-minute time slots
      for (let time = new Date(dayStart); time < dayEnd; time.setMinutes(time.getMinutes() + 30)) {
        const slotEnd = new Date(time.getTime() + 30 * 60000);
        
        // Check if this slot conflicts with any events
        const conflict = events.find(event => {
          const eventStart = new Date(event.start_time);
          const eventEnd = new Date(event.end_time);
          return (time < eventEnd && slotEnd > eventStart);
        });

        timeSlots.push({
          start_time: time.toISOString(),
          end_time: slotEnd.toISOString(),
          available: !conflict,
          ...(conflict && {
            event_id: conflict.id,
            event_title: conflict.title
          })
        });
      }

      availability.push({
        date: date.toISOString().split('T')[0],
        time_slots: timeSlots
      });
    }

    return availability;
  }
}

export const zohoCalendar = new ZohoCalendarService();