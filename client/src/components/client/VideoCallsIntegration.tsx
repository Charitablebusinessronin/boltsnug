// Video Calls Integration for Client Dashboard
// Telemedicine functionality

import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, Phone, Monitor, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { catalystClientFunctions, VideoCallRequest } from '../../lib/catalyst-functions/client-functions';

interface VideoCallsIntegrationProps {
  clientId: string;
}

interface VideoAppointment {
  appointment_id: string;
  caregiver_name: string;
  appointment_type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Training';
  scheduled_datetime: string;
  duration_minutes: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  video_link?: string;
  meeting_notes?: string;
  caregiver_avatar?: string;
}

const VideoCallsIntegration: React.FC<VideoCallsIntegrationProps> = ({ clientId }) => {
  const [appointments, setAppointments] = useState<VideoAppointment[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCall, setActiveCall] = useState<VideoAppointment | null>(null);
  const [newCall, setNewCall] = useState<Partial<VideoCallRequest>>({
    client_id: clientId,
    appointment_type: 'Consultation',
    duration_minutes: 60,
    special_requirements: []
  });

  useEffect(() => {
    loadAppointments();
  }, [clientId]);

  const loadAppointments = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - would call actual API
      const mockAppointments: VideoAppointment[] = [
        {
          appointment_id: 'VA001',
          caregiver_name: 'Sarah Johnson, RN',
          appointment_type: 'Consultation',
          scheduled_datetime: '2025-08-16T14:00:00',
          duration_minutes: 60,
          status: 'Scheduled',
          video_link: 'https://meet.zoom.us/j/123456789',
          caregiver_avatar: '/images/caregiver-1.jpg'
        },
        {
          appointment_id: 'VA002',
          caregiver_name: 'Dr. Emily Chen',
          appointment_type: 'Follow-up',
          scheduled_datetime: '2025-08-18T10:30:00',
          duration_minutes: 30,
          status: 'Scheduled',
          video_link: 'https://meet.zoom.us/j/987654321'
        },
        {
          appointment_id: 'VA003',
          caregiver_name: 'Lisa Rodriguez, IBCLC',
          appointment_type: 'Consultation',
          scheduled_datetime: '2025-08-14T11:00:00',
          duration_minutes: 45,
          status: 'Completed',
          meeting_notes: 'Discussed breastfeeding techniques and positioning. Follow-up scheduled.'
        }
      ];
      setAppointments(mockAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scheduleVideoCall = async () => {
    if (!newCall.caregiver_id || !newCall.preferred_datetime) return;

    setIsLoading(true);
    try {
      const response = await catalystClientFunctions.scheduleVideoCall(newCall as VideoCallRequest);
      if (response.success) {
        setShowScheduleForm(false);
        setNewCall({
          client_id: clientId,
          appointment_type: 'Consultation',
          duration_minutes: 60,
          special_requirements: []
        });
        await loadAppointments();
      }
    } catch (error) {
      console.error('Error scheduling video call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const joinCall = (appointment: VideoAppointment) => {
    if (appointment.video_link) {
      setActiveCall(appointment);
      // In a real implementation, this would open the video call interface
      window.open(appointment.video_link, '_blank');
    }
  };

  const endCall = () => {
    setActiveCall(null);
    // Update appointment status to completed
    loadAppointments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'In Progress': return 'text-green-600 bg-green-50 border-green-200';
      case 'Completed': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled': return <Calendar className="w-4 h-4" />;
      case 'In Progress': return <Video className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'Consultation': return <Monitor className="w-5 h-5 text-blue-600" />;
      case 'Follow-up': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Emergency': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'Training': return <Video className="w-5 h-5 text-purple-600" />;
      default: return <Video className="w-5 h-5 text-gray-600" />;
    }
  };

  const isCallStartable = (appointment: VideoAppointment) => {
    const now = new Date();
    const scheduledTime = new Date(appointment.scheduled_datetime);
    const timeDiffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    return timeDiffMinutes <= 15 && timeDiffMinutes >= -15 && appointment.status === 'Scheduled';
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="healthcare-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-primary">Video Consultations</h2>
          <p className="text-gray-600 mt-1">Telemedicine appointments and virtual care</p>
        </div>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="healthcare-button-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Call</span>
        </button>
      </div>

      {/* Active Call Banner */}
      {activeCall && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold text-green-800">Call in Progress</h3>
                <p className="text-sm text-green-600">
                  {activeCall.caregiver_name} • {activeCall.appointment_type}
                </p>
              </div>
            </div>
            <button
              onClick={endCall}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No video appointments scheduled. Schedule your first consultation to get started.</p>
          </div>
        ) : (
          appointments.map((appointment) => {
            const { date, time } = formatDateTime(appointment.scheduled_datetime);
            const canStartCall = isCallStartable(appointment);

            return (
              <div key={appointment.appointment_id} className="healthcare-card border border-accent/20 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    {appointment.caregiver_avatar ? (
                      <img
                        src={appointment.caregiver_avatar}
                        alt={appointment.caregiver_name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                    )}

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getAppointmentTypeIcon(appointment.appointment_type)}
                        <h3 className="font-semibold text-primary">{appointment.caregiver_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span>{appointment.status}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{time} ({appointment.duration_minutes}min)</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Monitor className="w-4 h-4" />
                          <span>{appointment.appointment_type}</span>
                        </div>
                      </div>

                      {appointment.meeting_notes && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Meeting Notes:</h4>
                          <p className="text-sm text-gray-600">{appointment.meeting_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {canStartCall && appointment.video_link && (
                      <button
                        onClick={() => joinCall(appointment)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Call</span>
                      </button>
                    )}
                    
                    {appointment.status === 'Scheduled' && !canStartCall && (
                      <div className="text-xs text-gray-500 text-center">
                        Call available 15 min before
                      </div>
                    )}

                    <button className="healthcare-button-secondary text-sm">
                      Reschedule
                    </button>
                    
                    {appointment.status === 'Scheduled' && (
                      <button className="text-red-600 hover:text-red-800 text-sm">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Schedule Call Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-primary">Schedule Video Call</h3>
                <button
                  onClick={() => setShowScheduleForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); scheduleVideoCall(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  <select
                    value={newCall.appointment_type}
                    onChange={(e) => setNewCall({...newCall, appointment_type: e.target.value as VideoCallRequest['appointment_type']})}
                    className="healthcare-input"
                  >
                    <option value="Consultation">Initial Consultation</option>
                    <option value="Follow-up">Follow-up Visit</option>
                    <option value="Emergency">Emergency Consultation</option>
                    <option value="Training">Educational Session</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={newCall.preferred_datetime}
                    onChange={(e) => setNewCall({...newCall, preferred_datetime: e.target.value})}
                    className="healthcare-input"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newCall.duration_minutes}
                    onChange={(e) => setNewCall({...newCall, duration_minutes: parseInt(e.target.value)})}
                    className="healthcare-input"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    placeholder="Any specific topics to discuss or special needs..."
                    className="healthcare-input"
                    rows={3}
                    onChange={(e) => setNewCall({
                      ...newCall,
                      special_requirements: e.target.value.split('\n').filter(req => req.trim())
                    })}
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                    className="healthcare-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="healthcare-button-primary disabled:opacity-50"
                  >
                    {isLoading ? 'Scheduling...' : 'Schedule Call'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCallsIntegration;