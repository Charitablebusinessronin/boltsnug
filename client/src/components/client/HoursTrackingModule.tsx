// Hours Tracking Module for Client Dashboard
// Track care hours and sessions

import React, { useState, useEffect } from 'react';
import { Clock, Calendar, User, CheckCircle, AlertCircle, Eye, Star, DollarSign, BarChart3 } from 'lucide-react';
import { catalystClientFunctions, HoursEntry } from '../../lib/catalyst-functions/client-functions';

interface HoursTrackingModuleProps {
  clientId: string;
}

interface HoursSession extends HoursEntry {
  entry_id: string;
  caregiver_name: string;
  status: 'Pending' | 'Approved' | 'Disputed' | 'Paid';
  cost: number;
  approved_by?: string;
  approval_date?: string;
}

interface HoursSummary {
  current_month: {
    total_hours: number;
    total_cost: number;
    sessions_count: number;
    average_satisfaction: number;
  };
  last_30_days: {
    total_hours: number;
    total_cost: number;
    trend: 'up' | 'down' | 'stable';
  };
  by_service_type: {
    service_type: string;
    hours: number;
    percentage: number;
  }[];
}

const HoursTrackingModule: React.FC<HoursTrackingModuleProps> = ({ clientId }) => {
  const [sessions, setSessions] = useState<HoursSession[]>([]);
  const [summary, setSummary] = useState<HoursSummary | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [showSessionDetails, setShowSessionDetails] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadHoursData();
  }, [clientId, selectedPeriod]);

  const loadHoursData = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - would call actual API
      const mockSessions: HoursSession[] = [
        {
          entry_id: 'HE001',
          client_id: clientId,
          caregiver_id: 'CG001',
          caregiver_name: 'Sarah Johnson, RN',
          service_date: '2025-08-15',
          start_time: '09:00',
          end_time: '13:00',
          total_hours: 4,
          service_type: 'Direct Care',
          activities_performed: [
            'Postpartum physical assessment',
            'Breastfeeding support and education',
            'Light meal preparation',
            'Baby care assistance'
          ],
          client_satisfaction: 5,
          notes: 'Excellent session. Very helpful with breastfeeding positioning.',
          requires_approval: false,
          status: 'Approved',
          cost: 120,
          approved_by: 'Care Coordinator',
          approval_date: '2025-08-15'
        },
        {
          entry_id: 'HE002',
          client_id: clientId,
          caregiver_id: 'CG002',
          caregiver_name: 'Maria Lopez, Doula',
          service_date: '2025-08-14',
          start_time: '14:00',
          end_time: '16:30',
          total_hours: 2.5,
          service_type: 'Consultation',
          activities_performed: [
            'Emotional support session',
            'Postpartum recovery guidance',
            'Family planning discussion'
          ],
          client_satisfaction: 4,
          notes: 'Great emotional support during a difficult time.',
          requires_approval: true,
          status: 'Pending',
          cost: 75
        },
        {
          entry_id: 'HE003',
          client_id: clientId,
          caregiver_id: 'CG001',
          caregiver_name: 'Sarah Johnson, RN',
          service_date: '2025-08-13',
          start_time: '10:00',
          end_time: '12:00',
          total_hours: 2,
          service_type: 'Training',
          activities_performed: [
            'Infant CPR training',
            'Safe sleep practices education',
            'Emergency contact protocols'
          ],
          client_satisfaction: 5,
          requires_approval: false,
          status: 'Approved',
          cost: 80,
          approved_by: 'Care Coordinator'
        }
      ];

      const mockSummary: HoursSummary = {
        current_month: {
          total_hours: 8.5,
          total_cost: 275,
          sessions_count: 3,
          average_satisfaction: 4.7
        },
        last_30_days: {
          total_hours: 12.5,
          total_cost: 375,
          trend: 'up'
        },
        by_service_type: [
          { service_type: 'Direct Care', hours: 4, percentage: 47 },
          { service_type: 'Consultation', hours: 2.5, percentage: 29 },
          { service_type: 'Training', hours: 2, percentage: 24 }
        ]
      };

      setSessions(mockSessions);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error loading hours data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'Pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Disputed': return 'text-red-600 bg-red-50 border-red-200';
      case 'Paid': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Disputed': return <AlertCircle className="w-4 h-4" />;
      case 'Paid': return <DollarSign className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderSatisfactionStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const filteredSessions = sessions.filter(session => {
    if (filterStatus === 'all') return true;
    return session.status.toLowerCase() === filterStatus;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '📊';
    }
  };

  return (
    <div className="healthcare-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-primary">Hours Tracking</h2>
          <p className="text-gray-600 mt-1">Track your care hours and session history</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className="healthcare-input py-2 px-3 text-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="healthcare-card border border-blue-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{summary.current_month.total_hours}</div>
                <div className="text-sm text-gray-600">Hours This Month</div>
              </div>
            </div>
          </div>

          <div className="healthcare-card border border-green-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">${summary.current_month.total_cost}</div>
                <div className="text-sm text-gray-600">Cost This Month</div>
              </div>
            </div>
          </div>

          <div className="healthcare-card border border-purple-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{summary.current_month.sessions_count}</div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
            </div>
          </div>

          <div className="healthcare-card border border-yellow-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{summary.current_month.average_satisfaction}/5</div>
                <div className="text-sm text-gray-600">Avg Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Type Breakdown */}
      {summary && (
        <div className="healthcare-card border border-accent/20 p-4 mb-6">
          <h3 className="font-semibold text-primary mb-4">Hours by Service Type</h3>
          <div className="space-y-3">
            {summary.by_service_type.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{service.service_type}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                    {service.hours}h ({service.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Sessions */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-primary">Session History</h3>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="healthcare-input py-2 px-3 text-sm"
        >
          <option value="all">All Sessions</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="disputed">Disputed</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading sessions...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No sessions found for the selected filters.</p>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div key={session.entry_id} className="healthcare-card border border-accent/20 p-4">
              <div className="flex items-start justify-between">
                <div className="flex space-x-4 flex-1">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-primary">{session.caregiver_name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span>{session.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{session.service_date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{session.start_time} - {session.end_time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <BarChart3 className="w-4 h-4" />
                        <span>{session.total_hours}h • {session.service_type}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>${session.cost}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">Activities:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {session.activities_performed.map((activity, index) => (
                          <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {session.client_satisfaction && (
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm text-gray-600">Your Rating:</span>
                        {renderSatisfactionStars(session.client_satisfaction)}
                        <span className="text-sm font-medium text-gray-700">({session.client_satisfaction}/5)</span>
                      </div>
                    )}

                    {session.notes && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-sm text-gray-700 mb-1">Your Feedback:</h4>
                        <p className="text-sm text-gray-600">{session.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setShowSessionDetails(showSessionDetails === session.entry_id ? null : session.entry_id)}
                    className="healthcare-button-secondary text-sm flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Details</span>
                  </button>

                  {session.status === 'Pending' && (
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Dispute
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {showSessionDetails === session.entry_id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Session Details</h4>
                      <div className="space-y-1">
                        <div>Entry ID: {session.entry_id}</div>
                        <div>Service Date: {session.service_date}</div>
                        <div>Duration: {session.total_hours} hours</div>
                        <div>Hourly Rate: ${(session.cost / session.total_hours).toFixed(2)}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Approval Status</h4>
                      <div className="space-y-1">
                        <div>Status: {session.status}</div>
                        {session.approved_by && <div>Approved by: {session.approved_by}</div>}
                        {session.approval_date && <div>Approved on: {session.approval_date}</div>}
                        <div>Approval Required: {session.requires_approval ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HoursTrackingModule;