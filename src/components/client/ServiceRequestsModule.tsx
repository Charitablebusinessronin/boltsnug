// Service Requests Module for Client Dashboard
// Request postpartum care services

import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, AlertCircle, Calendar, User, MapPin } from 'lucide-react';
import { catalystClientFunctions, ServiceRequest } from '../../lib/catalyst-functions/client-functions';

interface ServiceRequestsModuleProps {
  clientId: string;
}

const ServiceRequestsModule: React.FC<ServiceRequestsModuleProps> = ({ clientId }) => {
  const [requests, setRequests] = useState<(ServiceRequest & { request_id: string; status: string; created_date: string })[]>([]);
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newRequest, setNewRequest] = useState<Partial<ServiceRequest>>({
    client_id: clientId,
    service_category: 'Scheduled Care',
    service_type: 'Postpartum Care',
    urgency: 'Medium',
    preferred_start_date: '',
    specific_requirements: [],
    location_preferences: {
      in_home: true,
      virtual: false,
      clinic_visit: false
    }
  });

  useEffect(() => {
    loadServiceRequests();
  }, [clientId]);

  const loadServiceRequests = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - would call actual API
      const mockRequests = [
        {
          request_id: 'SR001',
          client_id: clientId,
          service_category: 'Scheduled Care' as const,
          service_type: 'Postpartum Care' as const,
          urgency: 'Medium' as const,
          preferred_start_date: '2025-08-20',
          duration_weeks: 4,
          hours_per_week: 20,
          specific_requirements: ['Breastfeeding support', 'Light housekeeping', 'Baby care basics'],
          budget_range: { min: 25, max: 40, payment_method: 'Insurance' as const },
          location_preferences: { in_home: true, virtual: false, clinic_visit: false },
          status: 'Under Review',
          created_date: '2025-08-15'
        }
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error loading service requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitServiceRequest = async () => {
    if (!newRequest.service_type || !newRequest.preferred_start_date) return;

    setIsLoading(true);
    try {
      const response = await catalystClientFunctions.submitServiceRequest(newRequest as ServiceRequest);
      if (response.success) {
        setShowNewRequestForm(false);
        setNewRequest({
          client_id: clientId,
          service_category: 'Scheduled Care',
          service_type: 'Postpartum Care',
          urgency: 'Medium',
          preferred_start_date: '',
          specific_requirements: [],
          location_preferences: { in_home: true, virtual: false, clinic_visit: false }
        });
        await loadServiceRequests();
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'In Progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'Under Review': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Under Review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="healthcare-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-bold text-primary">Service Requests</h2>
          <p className="text-gray-600 mt-1">Request postpartum care services</p>
        </div>
        <button
          onClick={() => setShowNewRequestForm(true)}
          className="healthcare-button-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Existing Requests */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No service requests yet. Create your first request to get started.</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.request_id} className="healthcare-card border border-accent/20 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {getStatusIcon(request.status)}
                    <h3 className="font-semibold text-primary">{request.service_type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {request.preferred_start_date}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{request.hours_per_week}h/week for {request.duration_weeks} weeks</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{request.location_preferences.in_home ? 'In-Home' : 'Virtual'}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Services Requested:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.specific_requirements.map((req, index) => (
                        <span key={index} className="px-2 py-1 bg-accent/20 text-primary text-xs rounded-full">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  {request.budget_range && (
                    <div className="text-sm text-gray-600">
                      Budget: ${request.budget_range.min}-${request.budget_range.max}/hour ({request.budget_range.payment_method})
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-2">
                    Requested: {request.created_date}
                  </div>
                  <button className="healthcare-button-secondary text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Request Form Modal */}
      {showNewRequestForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-primary">New Service Request</h3>
                <button
                  onClick={() => setShowNewRequestForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); submitServiceRequest(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type *
                    </label>
                    <select
                      value={newRequest.service_type}
                      onChange={(e) => setNewRequest({...newRequest, service_type: e.target.value as ServiceRequest['service_type']})}
                      className="healthcare-input"
                      required
                    >
                      <option value="Postpartum Care">Postpartum Care</option>
                      <option value="Lactation Support">Lactation Support</option>
                      <option value="Mental Health">Mental Health Support</option>
                      <option value="Childcare">Childcare</option>
                      <option value="Doula Services">Doula Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={newRequest.urgency}
                      onChange={(e) => setNewRequest({...newRequest, urgency: e.target.value as ServiceRequest['urgency']})}
                      className="healthcare-input"
                    >
                      <option value="Low">Low - Within 2 weeks</option>
                      <option value="Medium">Medium - Within 1 week</option>
                      <option value="High">High - Within 3 days</option>
                      <option value="Emergency">Emergency - ASAP</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Start Date *
                    </label>
                    <input
                      type="date"
                      value={newRequest.preferred_start_date}
                      onChange={(e) => setNewRequest({...newRequest, preferred_start_date: e.target.value})}
                      className="healthcare-input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (weeks)
                    </label>
                    <input
                      type="number"
                      value={newRequest.duration_weeks || ''}
                      onChange={(e) => setNewRequest({...newRequest, duration_weeks: parseInt(e.target.value) || undefined})}
                      className="healthcare-input"
                      min="1"
                      max="52"
                      placeholder="e.g., 4"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    value={newRequest.hours_per_week || ''}
                    onChange={(e) => setNewRequest({...newRequest, hours_per_week: parseInt(e.target.value) || undefined})}
                    className="healthcare-input"
                    min="1"
                    max="168"
                    placeholder="e.g., 20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Care Location Preferences
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRequest.location_preferences?.in_home || false}
                        onChange={(e) => setNewRequest({
                          ...newRequest,
                          location_preferences: {
                            ...newRequest.location_preferences!,
                            in_home: e.target.checked
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm">In-home care</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRequest.location_preferences?.virtual || false}
                        onChange={(e) => setNewRequest({
                          ...newRequest,
                          location_preferences: {
                            ...newRequest.location_preferences!,
                            virtual: e.target.checked
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm">Virtual consultations</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRequest.location_preferences?.clinic_visit || false}
                        onChange={(e) => setNewRequest({
                          ...newRequest,
                          location_preferences: {
                            ...newRequest.location_preferences!,
                            clinic_visit: e.target.checked
                          }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm">Clinic visits</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Requirements
                  </label>
                  <textarea
                    placeholder="Describe your specific care needs..."
                    className="healthcare-input"
                    rows={3}
                    onChange={(e) => setNewRequest({
                      ...newRequest,
                      specific_requirements: e.target.value.split('\n').filter(req => req.trim())
                    })}
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestForm(false)}
                    className="healthcare-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="healthcare-button-primary disabled:opacity-50"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Request'}
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

export default ServiceRequestsModule;