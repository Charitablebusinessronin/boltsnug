import React, { useState, useEffect } from 'react';
import { Award, Calendar, Clock, Eye, MessageCircle, FileText, Filter, Search, AlertCircle, CheckCircle, XCircle, Timer } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  applied_date: string;
  status: 'Submitted' | 'Under Review' | 'Interview Scheduled' | 'Interview Completed' | 'Offer Extended' | 'Accepted' | 'Rejected' | 'Withdrawn';
  priority: 'Low' | 'Medium' | 'High';
  application_notes?: string;
  interview_details?: {
    date: string;
    time: string;
    type: 'Phone' | 'Video' | 'In-Person';
    interviewer: string;
    location?: string;
    video_link?: string;
    notes?: string;
  };
  offer_details?: {
    salary_offered: number;
    start_date: string;
    benefits: string[];
    response_deadline: string;
  };
  timeline: {
    submitted: string;
    reviewed?: string;
    interview_scheduled?: string;
    interview_completed?: string;
    decision_made?: string;
  };
  communication_log: {
    date: string;
    type: 'Email' | 'Phone' | 'Message' | 'Interview';
    from: string;
    subject: string;
    content: string;
  }[];
  documents_submitted: string[];
  next_steps?: string;
  feedback?: string;
}

interface ApplicationsTrackingProps {
  onViewApplication?: (applicationId: string) => void;
}

export const ApplicationsTracking: React.FC<ApplicationsTrackingProps> = ({
  onViewApplication
}) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app, this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockApplications: Application[] = [
        {
          id: 'app-1',
          job_id: 'job-1',
          job_title: 'Postpartum Care Specialist',
          company: 'Family Care Plus',
          applied_date: '2025-08-14T10:30:00Z',
          status: 'Interview Scheduled',
          priority: 'High',
          application_notes: 'Perfect match for my postpartum care experience and certifications.',
          interview_details: {
            date: '2025-08-18',
            time: '2:00 PM',
            type: 'Video',
            interviewer: 'Sarah Johnson, Care Manager',
            video_link: 'https://meet.google.com/abc-defg-hij',
            notes: 'Prepare portfolio of recent client testimonials'
          },
          timeline: {
            submitted: '2025-08-14T10:30:00Z',
            reviewed: '2025-08-15T09:15:00Z',
            interview_scheduled: '2025-08-15T14:20:00Z'
          },
          communication_log: [
            {
              date: '2025-08-15T14:20:00Z',
              type: 'Email',
              from: 'Sarah Johnson',
              subject: 'Interview Invitation - Postpartum Care Specialist',
              content: 'We were impressed with your application and would like to schedule an interview.'
            },
            {
              date: '2025-08-14T11:00:00Z',
              type: 'Email',
              from: 'Family Care Plus',
              subject: 'Application Received',
              content: 'Thank you for your application. We will review it and get back to you within 2-3 business days.'
            }
          ],
          documents_submitted: ['Resume', 'Certifications', 'References', 'Background Check'],
          next_steps: 'Prepare for video interview on August 18th at 2:00 PM'
        },
        {
          id: 'app-2',
          job_id: 'job-2',
          job_title: 'Mental Health Support Specialist',
          company: 'Wellness Care Network',
          applied_date: '2025-08-12T16:45:00Z',
          status: 'Under Review',
          priority: 'High',
          application_notes: 'Strong alignment with my LCSW background and perinatal mental health specialization.',
          timeline: {
            submitted: '2025-08-12T16:45:00Z',
            reviewed: '2025-08-13T08:30:00Z'
          },
          communication_log: [
            {
              date: '2025-08-13T08:30:00Z',
              type: 'Message',
              from: 'HR Team',
              subject: 'Application Status Update',
              content: 'Your application is currently under review by our clinical team. We expect to make a decision by end of week.'
            },
            {
              date: '2025-08-12T17:00:00Z',
              type: 'Email',
              from: 'Wellness Care Network',
              subject: 'Application Confirmation',
              content: 'Your application has been received and assigned tracking number WCN-2025-0234.'
            }
          ],
          documents_submitted: ['Resume', 'LCSW License', 'Malpractice Insurance', 'Portfolio'],
          next_steps: 'Wait for review completion by end of week'
        },
        {
          id: 'app-3',
          job_id: 'job-3',
          job_title: 'Lactation Consultant',
          company: 'Mother & Baby Wellness',
          applied_date: '2025-08-10T09:20:00Z',
          status: 'Offer Extended',
          priority: 'High',
          offer_details: {
            salary_offered: 45,
            start_date: '2025-08-25',
            benefits: ['Professional Development Fund', 'Flexible Scheduling', 'Travel Reimbursement'],
            response_deadline: '2025-08-20'
          },
          timeline: {
            submitted: '2025-08-10T09:20:00Z',
            reviewed: '2025-08-11T10:00:00Z',
            interview_scheduled: '2025-08-12T14:00:00Z',
            interview_completed: '2025-08-13T15:30:00Z',
            decision_made: '2025-08-14T11:15:00Z'
          },
          communication_log: [
            {
              date: '2025-08-14T11:15:00Z',
              type: 'Phone',
              from: 'Maria Rodriguez, Director',
              subject: 'Job Offer - Lactation Consultant Position',
              content: 'Congratulations! We would like to offer you the lactation consultant position. Details have been sent via email.'
            },
            {
              date: '2025-08-13T16:00:00Z',
              type: 'Email',
              from: 'Interview Team',
              subject: 'Thank you for your interview',
              content: 'Thank you for taking the time to interview with us today. We were impressed with your expertise and will be in touch soon.'
            }
          ],
          documents_submitted: ['Resume', 'IBCLC Certification', 'References', 'Continuing Education Records'],
          next_steps: 'Review offer details and respond by August 20th',
          feedback: 'Excellent technical knowledge and client communication skills demonstrated during interview.'
        },
        {
          id: 'app-4',
          job_id: 'job-4',
          job_title: 'Overnight Newborn Care',
          company: 'Elite Care Services',
          applied_date: '2025-08-08T11:10:00Z',
          status: 'Rejected',
          priority: 'Medium',
          timeline: {
            submitted: '2025-08-08T11:10:00Z',
            reviewed: '2025-08-09T13:20:00Z',
            decision_made: '2025-08-11T10:30:00Z'
          },
          communication_log: [
            {
              date: '2025-08-11T10:30:00Z',
              type: 'Email',
              from: 'Elite Care Services HR',
              subject: 'Application Status Update',
              content: 'Thank you for your interest in the overnight newborn care position. We have decided to move forward with other candidates at this time.'
            }
          ],
          documents_submitted: ['Resume', 'Newborn Care Certification'],
          feedback: 'While your qualifications are good, we selected a candidate with more specific overnight care experience.'
        },
        {
          id: 'app-5',
          job_id: 'job-5',
          job_title: 'Weekend Companion Care',
          company: 'Caring Hands Agency',
          applied_date: '2025-08-06T14:30:00Z',
          status: 'Submitted',
          priority: 'Low',
          timeline: {
            submitted: '2025-08-06T14:30:00Z'
          },
          communication_log: [
            {
              date: '2025-08-06T14:45:00Z',
              type: 'Email',
              from: 'Caring Hands Agency',
              subject: 'Application Received',
              content: 'Thank you for your application. We will review all applications and contact qualified candidates within 5-7 business days.'
            }
          ],
          documents_submitted: ['Resume', 'CPR Certification'],
          next_steps: 'Wait for initial review - follow up if no response by August 15th'
        }
      ];

      setApplications(mockApplications);
      setError(null);
    } catch {
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Interview Scheduled': return 'bg-purple-100 text-purple-800';
      case 'Interview Completed': return 'bg-indigo-100 text-indigo-800';
      case 'Offer Extended': return 'bg-green-100 text-green-800';
      case 'Accepted': return 'bg-emerald-100 text-emerald-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'Submitted': return <Timer className="h-4 w-4" />;
      case 'Under Review': return <Eye className="h-4 w-4" />;
      case 'Interview Scheduled': return <Calendar className="h-4 w-4" />;
      case 'Interview Completed': return <CheckCircle className="h-4 w-4" />;
      case 'Offer Extended': return <Award className="h-4 w-4" />;
      case 'Accepted': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Withdrawn': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: Application['priority']) => {
    switch (priority) {
      case 'High': return 'border-l-red-400';
      case 'Medium': return 'border-l-yellow-400';
      case 'Low': return 'border-l-green-400';
      default: return 'border-l-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || app.status === statusFilter;
    const matchesPriority = priorityFilter === '' || app.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return (
      <div className="healthcare-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-accent/20 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-accent/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="healthcare-card p-6">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <AlertCircle className="h-5 w-5" />
          <span className="font-body">{error}</span>
        </div>
        <button
          onClick={loadApplications}
          className="healthcare-button-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="healthcare-heading text-lg font-semibold flex items-center">
          <Award className="h-5 w-5 mr-2 text-luxury" />
          Application Tracking ({filteredApplications.length})
        </h3>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: applications.length, color: 'text-primary' },
          { label: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, color: 'text-yellow-600' },
          { label: 'Interviews', value: applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interview Completed').length, color: 'text-purple-600' },
          { label: 'Offers', value: applications.filter(a => a.status === 'Offer Extended').length, color: 'text-green-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-background p-4 rounded-lg text-center">
            <div className={`font-heading text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="font-ui text-xs text-primary/60">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-background p-4 rounded-lg space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
          <input
            type="text"
            placeholder="Search applications by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Offer Extended">Offer Extended</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
          >
            <option value="">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="healthcare-card p-8 text-center">
            <Award className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <h4 className="font-heading text-primary mb-2">No applications found</h4>
            <p className="font-body text-primary/60">
              {searchTerm || statusFilter || priorityFilter
                ? 'No applications match your search criteria.'
                : 'You haven\'t submitted any applications yet.'
              }
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application.id} className={`healthcare-card p-6 border-l-4 ${getPriorityColor(application.priority)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-heading text-lg font-semibold text-primary">
                      {application.job_title}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-ui font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{application.status}</span>
                    </span>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${
                      application.priority === 'High' ? 'bg-red-100 text-red-700' :
                      application.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {application.priority} Priority
                    </span>
                  </div>
                  
                  <p className="font-body text-primary/80 mb-2">
                    {application.company}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-primary/60">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied {getDaysAgo(application.applied_date)}
                    </span>
                    {application.interview_details && (
                      <span className="flex items-center text-purple-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        Interview: {formatDate(application.interview_details.date)} at {application.interview_details.time}
                      </span>
                    )}
                    {application.offer_details && (
                      <span className="flex items-center text-green-600">
                        <Award className="h-4 w-4 mr-1" />
                        Response due: {formatDate(application.offer_details.response_deadline)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {application.communication_log.length > 0 && (
                    <div className="flex items-center text-sm text-primary/60">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{application.communication_log.length} messages</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowApplicationDetails(true);
                    }}
                    className="healthcare-button-secondary text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Next Steps */}
              {application.next_steps && (
                <div className="bg-accent/10 p-3 rounded-lg mb-3">
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-accent mt-0.5" />
                    <div>
                      <span className="font-ui font-medium text-accent text-sm">Next Steps:</span>
                      <p className="font-body text-primary text-sm">{application.next_steps}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Interview Alert */}
              {application.interview_details && application.status === 'Interview Scheduled' && (
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="font-ui font-medium text-purple-800">Upcoming Interview</span>
                  </div>
                  <p className="font-body text-purple-700 text-sm">
                    {application.interview_details.type} interview with {application.interview_details.interviewer}
                  </p>
                  <p className="font-body text-purple-600 text-sm">
                    {formatDate(application.interview_details.date)} at {application.interview_details.time}
                  </p>
                </div>
              )}

              {/* Offer Alert */}
              {application.offer_details && application.status === 'Offer Extended' && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="font-ui font-medium text-green-800">Job Offer Received</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-ui text-green-700">Hourly Rate:</span>
                      <p className="font-body text-green-800">${application.offer_details.salary_offered}/hr</p>
                    </div>
                    <div>
                      <span className="font-ui text-green-700">Start Date:</span>
                      <p className="font-body text-green-800">{formatDate(application.offer_details.start_date)}</p>
                    </div>
                  </div>
                  <p className="font-body text-green-600 text-sm mt-2">
                    Respond by {formatDate(application.offer_details.response_deadline)}
                  </p>
                </div>
              )}

              {/* Application Notes */}
              {application.application_notes && (
                <div className="mt-3 pt-3 border-t border-accent/20">
                  <p className="font-body text-primary/70 text-sm italic">
                    "{application.application_notes}"
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Application Details Modal */}
      {showApplicationDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <div>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  {selectedApplication.job_title}
                </h2>
                <p className="font-body text-primary/70">
                  {selectedApplication.company} • Applied {formatDate(selectedApplication.applied_date)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowApplicationDetails(false);
                  setSelectedApplication(null);
                }}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="space-y-6">
                {/* Status and Timeline */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Application Timeline</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedApplication.timeline).map(([stage, date], index) => {
                      if (!date) return null;
                      return (
                        <div key={stage} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-luxury rounded-full"></div>
                          <div>
                            <span className="font-ui font-medium text-primary capitalize">
                              {stage.replace('_', ' ')}:
                            </span>
                            <span className="font-body text-primary/70 ml-2">
                              {formatDateTime(date)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interview Details */}
                {selectedApplication.interview_details && (
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-3">Interview Information</h3>
                    <div className="bg-background p-4 rounded-lg space-y-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-ui text-sm text-primary/70">Date & Time:</span>
                          <p className="font-body text-primary">
                            {formatDate(selectedApplication.interview_details.date)} at {selectedApplication.interview_details.time}
                          </p>
                        </div>
                        <div>
                          <span className="font-ui text-sm text-primary/70">Type:</span>
                          <p className="font-body text-primary">{selectedApplication.interview_details.type}</p>
                        </div>
                        <div>
                          <span className="font-ui text-sm text-primary/70">Interviewer:</span>
                          <p className="font-body text-primary">{selectedApplication.interview_details.interviewer}</p>
                        </div>
                        {selectedApplication.interview_details.video_link && (
                          <div>
                            <span className="font-ui text-sm text-primary/70">Video Link:</span>
                            <a 
                              href={selectedApplication.interview_details.video_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-body text-luxury underline text-sm block"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                      </div>
                      {selectedApplication.interview_details.notes && (
                        <div className="pt-2 border-t border-accent/20">
                          <span className="font-ui text-sm text-primary/70">Notes:</span>
                          <p className="font-body text-primary">{selectedApplication.interview_details.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Offer Details */}
                {selectedApplication.offer_details && (
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-3">Offer Details</h3>
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-ui text-sm text-green-700">Hourly Rate:</span>
                          <p className="font-body text-green-800 font-semibold">
                            ${selectedApplication.offer_details.salary_offered}/hour
                          </p>
                        </div>
                        <div>
                          <span className="font-ui text-sm text-green-700">Start Date:</span>
                          <p className="font-body text-green-800">
                            {formatDate(selectedApplication.offer_details.start_date)}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-ui text-sm text-green-700">Benefits:</span>
                        <ul className="list-disc list-inside font-body text-green-800 text-sm mt-1">
                          {selectedApplication.offer_details.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-2 border-t border-green-300">
                        <span className="font-ui text-sm text-green-700">Response Deadline:</span>
                        <p className="font-body text-green-800 font-semibold">
                          {formatDate(selectedApplication.offer_details.response_deadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Communication Log */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Communication History</h3>
                  <div className="space-y-3">
                    {selectedApplication.communication_log.map((comm, index) => (
                      <div key={index} className="bg-background p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-ui font-medium text-primary">{comm.subject}</span>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="font-body text-sm text-primary/70">From: {comm.from}</span>
                              <span className="font-body text-xs text-primary/50">
                                {formatDateTime(comm.date)}
                              </span>
                            </div>
                          </div>
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui ${
                            comm.type === 'Email' ? 'bg-blue-100 text-blue-700' :
                            comm.type === 'Phone' ? 'bg-green-100 text-green-700' :
                            comm.type === 'Interview' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {comm.type}
                          </span>
                        </div>
                        <p className="font-body text-primary/80 text-sm">{comm.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Documents Submitted</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.documents_submitted.map((doc, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-luxury/10 text-luxury rounded-full text-sm font-ui"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                {selectedApplication.feedback && (
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-3">Feedback</h3>
                    <div className="bg-accent/10 p-4 rounded-lg">
                      <p className="font-body text-primary">{selectedApplication.feedback}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};