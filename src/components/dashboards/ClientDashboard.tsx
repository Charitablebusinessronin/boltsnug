import React, { useState } from 'react';
import { Heart, Clock, Calendar, Phone, Star, TrendingUp, AlertCircle, Video, FileText, Users, MessageCircle } from 'lucide-react';
import { FeedbackForm } from '../client/FeedbackForm';
import { FeedbackHistory } from '../client/FeedbackHistory';
import { ContractsManagement } from '../client/ContractsManagement';
import { CareMatching } from '../client/CareMatching';

export const ClientDashboard: React.FC = () => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showFeedbackHistory, setShowFeedbackHistory] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'contracts' | 'matching'>('overview');

  // Mock caregiver data for feedback form
  const caregivers = [
    { id: 'caregiver-1', name: 'Sarah Martinez', specialty: 'Postpartum Specialist' },
    { id: 'caregiver-2', name: 'John Davis', specialty: 'Medical Assistant' },
    { id: 'caregiver-3', name: 'Emily Johnson', specialty: 'Companion Care' },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-accent/20 p-1 mb-6">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Heart },
            { id: 'contracts', label: 'Contracts', icon: FileText },
            { id: 'matching', label: 'Care Matching', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as 'overview' | 'contracts' | 'matching')}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 flex-1 justify-center ${
                activeSection === tab.id
                  ? 'bg-luxury text-white shadow-md'
                  : 'text-primary/70 hover:text-primary hover:bg-accent/10'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="font-ui font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Welcome Section */}
      {activeSection === 'overview' && (
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Welcome to Your Care Portal</h2>
            <p className="font-body text-white/90">Manage your care services with confidence and ease</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Heart className="h-8 w-8 text-white" fill="currentColor" />
          </div>
        </div>
      </div>
      )}

      {/* Overview Content */}
      {activeSection === 'overview' && (
        <>
        {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Active Requests</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">3</p>
              <p className="font-ui text-green-600 text-xs mt-1">+1 this week</p>
            </div>
            <div className="bg-luxury/20 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-luxury" />
            </div>
          </div>
        </div>

        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Care Hours</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">142</p>
              <p className="font-ui text-blue-600 text-xs mt-1">This month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Next Appointment</p>
              <p className="font-heading text-lg font-bold text-primary mt-1">Today, 2:00 PM</p>
              <p className="font-ui text-orange-600 text-xs mt-1">With Sarah M.</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Satisfaction</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">4.9/5</p>
              <p className="font-ui text-green-600 text-xs mt-1">Excellent rating</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-green-600" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Service Requests */}
        <div className="healthcare-card p-6">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-luxury" />
            Recent Service Requests
          </h3>
          <div className="space-y-3">
            {[
              { id: 1, service: 'Personal Care Assistance', status: 'In Progress', caregiver: 'Sarah Martinez', time: '2 hours ago' },
              { id: 2, service: 'Medication Management', status: 'Completed', caregiver: 'John Davis', time: '1 day ago' },
              { id: 3, service: 'Companion Care', status: 'Scheduled', caregiver: 'Emily Johnson', time: 'Tomorrow 10 AM' }
            ].map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="font-ui font-medium text-primary">{request.service}</p>
                  <p className="font-ui text-sm text-primary/60">with {request.caregiver}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${
                    request.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {request.status}
                  </span>
                  <p className="font-ui text-xs text-primary/50 mt-1">{request.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="healthcare-card p-6">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-luxury" />
            Upcoming Appointments
          </h3>
          <div className="space-y-3">
            {[
              { date: 'Today', time: '2:00 PM - 4:00 PM', caregiver: 'Sarah Martinez', service: 'Personal Care' },
              { date: 'Tomorrow', time: '10:00 AM - 12:00 PM', caregiver: 'Emily Johnson', service: 'Companion Care' },
              { date: 'Friday', time: '3:00 PM - 5:00 PM', caregiver: 'John Davis', service: 'Medical Assistance' }
            ].map((appointment, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                <div className="bg-luxury text-primary p-2 rounded-lg text-xs font-ui font-semibold min-w-[60px] text-center">
                  {appointment.date}
                </div>
                <div className="flex-1">
                  <p className="font-ui font-medium text-primary">{appointment.service}</p>
                  <p className="font-ui text-sm text-primary/60">with {appointment.caregiver}</p>
                  <p className="font-ui text-sm text-primary/50">{appointment.time}</p>
                </div>
                <button className="text-luxury hover:text-luxury-light">
                  <Phone className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Healthcare Service Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Service Request */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-luxury" />
            Request Care Services
          </h3>
          <div className="space-y-4">
            {[
              { service: 'Personal Care Assistance', description: 'Daily living support and personal hygiene', urgent: false },
              { service: 'Postpartum Recovery Support', description: 'Specialized care for new mothers', urgent: true },
              { service: 'Companion Care', description: 'Emotional support and companionship', urgent: false },
              { service: 'Medical Assistance', description: 'Medication management and health monitoring', urgent: false }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-accent/10 transition-colors">
                <div className="flex-1">
                  <p className="healthcare-ui-text font-medium">{item.service}</p>
                  <p className="healthcare-text-secondary text-sm">{item.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {item.urgent && (
                    <span className="healthcare-status-warning">Urgent</span>
                  )}
                  <button className="healthcare-button-primary text-sm px-3 py-1">
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Consultations */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Video className="h-5 w-5 mr-2 text-luxury" />
            Video Consultations
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="healthcare-ui-text font-medium text-green-800">Next Video Call</p>
                <span className="healthcare-status-success">Scheduled</span>
              </div>
              <p className="healthcare-text-secondary text-sm mb-3">Today at 2:00 PM with Sarah Martinez</p>
              <button className="healthcare-button-primary text-sm">
                <Video className="h-4 w-4 mr-1" />
                Join Call
              </button>
            </div>
            
            <div className="space-y-2">
              <p className="healthcare-ui-text font-medium">Available Specialists</p>
              {[
                { name: 'Dr. Emily Chen', specialty: 'Postpartum Specialist', available: 'Today 3-5 PM' },
                { name: 'Sarah Martinez', specialty: 'Lactation Consultant', available: 'Tomorrow 10-12 PM' }
              ].map((specialist, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                  <div>
                    <p className="healthcare-ui-text text-sm font-medium">{specialist.name}</p>
                    <p className="healthcare-text-secondary text-xs">{specialist.specialty} • {specialist.available}</p>
                  </div>
                  <button className="healthcare-button-secondary text-xs px-2 py-1">
                    Schedule
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Care Hours & Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Care Hours Tracking */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-luxury" />
            Care Hours This Month
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="healthcare-text-primary">Total Hours</span>
              <span className="healthcare-heading text-2xl font-bold">142</span>
            </div>
            <div className="w-full bg-accent/20 rounded-full h-2">
              <div className="bg-luxury h-2 rounded-full" style={{width: '71%'}}></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="healthcare-text-secondary">Personal Care</p>
                <p className="healthcare-ui-text font-semibold">89 hrs</p>
              </div>
              <div>
                <p className="healthcare-text-secondary">Companion Care</p>
                <p className="healthcare-ui-text font-semibold">53 hrs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback System */}
        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="healthcare-heading text-lg font-semibold flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-luxury" />
              Feedback & Reviews
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFeedbackHistory(true)}
                className="healthcare-button-secondary text-sm"
              >
                View History
              </button>
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="healthcare-button-primary text-sm"
              >
                Leave Feedback
              </button>
            </div>
          </div>
          
          {/* Recent Feedback Preview */}
          <div className="space-y-3">
            {[
              { caregiver: 'Sarah Martinez', rating: 5, comment: 'Excellent care and very compassionate', date: '2 days ago', status: 'Acknowledged' },
              { caregiver: 'John Davis', rating: 4, comment: 'Professional and knowledgeable', date: '1 week ago', status: 'Resolved' }
            ].map((feedback, index) => (
              <div key={index} className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="healthcare-ui-text font-medium">{feedback.caregiver}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {[...Array(feedback.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${
                      feedback.status === 'Acknowledged' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {feedback.status}
                    </span>
                  </div>
                </div>
                <p className="healthcare-text-secondary text-sm">{feedback.comment}</p>
                <p className="healthcare-text-secondary text-xs mt-1">{feedback.date}</p>
              </div>
            ))}
            
            {/* Feedback Stats */}
            <div className="bg-gradient-to-r from-luxury/10 to-primary/10 rounded-lg p-3 mt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-heading text-lg font-bold text-primary">4.9</div>
                  <div className="font-ui text-xs text-primary/60">Avg Rating</div>
                </div>
                <div>
                  <div className="font-heading text-lg font-bold text-primary">12</div>
                  <div className="font-ui text-xs text-primary/60">Total Reviews</div>
                </div>
                <div>
                  <div className="font-heading text-lg font-bold text-primary">98%</div>
                  <div className="font-ui text-xs text-primary/60">Recommend</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="healthcare-card p-6">
        <h3 className="healthcare-heading text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Emergency Contact', icon: Phone, color: 'bg-red-100 text-red-600', onClick: () => alert('Emergency contact feature coming soon!') },
            { name: 'View Contracts', icon: FileText, color: 'bg-blue-100 text-blue-600', onClick: () => setActiveSection('contracts') },
            { name: 'Caregiver Matching', icon: Users, color: 'bg-green-100 text-green-600', onClick: () => setActiveSection('matching') },
            { name: 'Support Chat', icon: MessageCircle, color: 'bg-purple-100 text-purple-600', onClick: () => alert('Support chat feature coming soon!') }
          ].map((action, index) => (
            <button 
              key={index} 
              onClick={action.onClick}
              className="p-4 rounded-lg border border-accent/20 hover:shadow-md transition-all duration-200 text-center group"
            >
              <div className={`${action.color} p-3 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="h-6 w-6" />
              </div>
              <p className="healthcare-ui-text font-medium text-sm">{action.name}</p>
            </button>
          ))}
        </div>
      </div>
      </>
      )}

      {/* Contracts Section */}
      {activeSection === 'contracts' && (
        <ContractsManagement />
      )}

      {/* Care Matching Section */}
      {activeSection === 'matching' && (
        <CareMatching />
      )}

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm
          onClose={() => setShowFeedbackForm(false)}
          caregivers={caregivers}
        />
      )}

      {/* Feedback History Modal */}
      {showFeedbackHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <h2 className="font-heading text-xl font-semibold text-primary">
                Feedback History
              </h2>
              <button
                onClick={() => setShowFeedbackHistory(false)}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              <FeedbackHistory
                onNewFeedback={() => {
                  setShowFeedbackHistory(false);
                  setShowFeedbackForm(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};