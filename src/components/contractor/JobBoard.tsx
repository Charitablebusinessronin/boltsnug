import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Star, Filter, Search, Calendar, Heart, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: {
    address: string;
    distance_miles: number;
    type: 'In-Home' | 'Clinic' | 'Virtual' | 'Hospital';
  };
  compensation: {
    hourly_rate: number;
    estimated_hours: number;
    payment_frequency: 'Weekly' | 'Bi-weekly' | 'Monthly';
    benefits?: string[];
  };
  schedule: {
    start_date: string;
    end_date?: string;
    days_of_week: string[];
    time_ranges: string[];
    flexibility: 'Fixed' | 'Flexible' | 'Negotiable';
  };
  requirements: {
    experience_level: 'Entry Level' | 'Experienced' | 'Expert' | 'Certified Specialist';
    certifications_required: string[];
    skills_required: string[];
    background_check: boolean;
  };
  job_details: {
    client_age_group: 'Newborn' | 'Infant' | 'Toddler' | 'Child' | 'Adult' | 'Senior';
    care_type: 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare' | 'Elder Care' | 'Medical Care';
    special_needs?: string[];
    description: string;
  };
  urgency: 'Low' | 'Medium' | 'High' | 'Urgent';
  posted_date: string;
  application_deadline?: string;
  client_rating?: number;
  positions_available: number;
  applications_count: number;
  status: 'Active' | 'Filled' | 'Cancelled' | 'On Hold';
  match_score?: number;
}

interface JobBoardProps {
  onApplyToJob?: (jobId: string) => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({
  onApplyToJob
}) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    careType: '',
    location: '',
    payRange: { min: 15, max: 80 },
    experienceLevel: '',
    urgency: '',
    schedule: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app, this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockJobs: JobListing[] = [
        {
          id: 'job-1',
          title: 'Postpartum Care Specialist',
          company: 'Family Care Plus',
          location: {
            address: '123 Oak Street, Downtown',
            distance_miles: 2.1,
            type: 'In-Home'
          },
          compensation: {
            hourly_rate: 35,
            estimated_hours: 30,
            payment_frequency: 'Weekly',
            benefits: ['Health Insurance', 'Paid Time Off', 'Professional Development']
          },
          schedule: {
            start_date: '2025-08-20',
            end_date: '2025-11-20',
            days_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            time_ranges: ['9:00 AM - 5:00 PM'],
            flexibility: 'Flexible'
          },
          requirements: {
            experience_level: 'Experienced',
            certifications_required: ['CPR Certified', 'Postpartum Doula'],
            skills_required: ['Breastfeeding Support', 'Emotional Support', 'Light Housekeeping'],
            background_check: true
          },
          job_details: {
            client_age_group: 'Adult',
            care_type: 'Postpartum Care',
            special_needs: ['First-time mother', 'C-section recovery'],
            description: 'Seeking an experienced postpartum care specialist to support a first-time mother during her recovery. The role includes newborn care assistance, breastfeeding support, light meal preparation, and emotional support during this transition.'
          },
          urgency: 'High',
          posted_date: '2025-08-14',
          application_deadline: '2025-08-18',
          client_rating: 4.8,
          positions_available: 1,
          applications_count: 3,
          status: 'Active',
          match_score: 95
        },
        {
          id: 'job-2',
          title: 'Lactation Consultant',
          company: 'Mother & Baby Wellness',
          location: {
            address: '456 Pine Avenue, Suburbs',
            distance_miles: 5.3,
            type: 'In-Home'
          },
          compensation: {
            hourly_rate: 45,
            estimated_hours: 12,
            payment_frequency: 'Bi-weekly',
            benefits: ['Professional Development', 'Travel Reimbursement']
          },
          schedule: {
            start_date: '2025-08-25',
            days_of_week: ['Tuesday', 'Thursday', 'Saturday'],
            time_ranges: ['10:00 AM - 2:00 PM'],
            flexibility: 'Fixed'
          },
          requirements: {
            experience_level: 'Certified Specialist',
            certifications_required: ['IBCLC', 'RN or equivalent'],
            skills_required: ['Lactation Assessment', 'Pump Fitting', 'Breastfeeding Education'],
            background_check: true
          },
          job_details: {
            client_age_group: 'Adult',
            care_type: 'Lactation Support',
            special_needs: ['Premature baby', 'Low milk supply concerns'],
            description: 'International Board Certified Lactation Consultant needed for comprehensive lactation support. Client has premature baby with feeding challenges and needs expert guidance on establishing breastfeeding.'
          },
          urgency: 'Medium',
          posted_date: '2025-08-13',
          application_deadline: '2025-08-20',
          client_rating: 5.0,
          positions_available: 1,
          applications_count: 8,
          status: 'Active',
          match_score: 88
        },
        {
          id: 'job-3',
          title: 'Mental Health Support Specialist',
          company: 'Wellness Care Network',
          location: {
            address: '789 Maple Drive, Midtown',
            distance_miles: 3.7,
            type: 'Virtual'
          },
          compensation: {
            hourly_rate: 55,
            estimated_hours: 16,
            payment_frequency: 'Weekly',
            benefits: ['Health Insurance', 'Mental Health Days', 'Continuing Education']
          },
          schedule: {
            start_date: '2025-09-01',
            end_date: '2025-12-01',
            days_of_week: ['Monday', 'Wednesday', 'Friday'],
            time_ranges: ['2:00 PM - 6:00 PM'],
            flexibility: 'Negotiable'
          },
          requirements: {
            experience_level: 'Expert',
            certifications_required: ['LCSW', 'Perinatal Mental Health Specialist'],
            skills_required: ['CBT', 'Postpartum Depression Treatment', 'Group Therapy'],
            background_check: true
          },
          job_details: {
            client_age_group: 'Adult',
            care_type: 'Mental Health',
            special_needs: ['Postpartum anxiety', 'Previous trauma history'],
            description: 'Licensed Clinical Social Worker needed to provide specialized mental health support for postpartum mothers. Experience with perinatal mood and anxiety disorders required.'
          },
          urgency: 'High',
          posted_date: '2025-08-12',
          application_deadline: '2025-08-19',
          client_rating: 4.9,
          positions_available: 2,
          applications_count: 5,
          status: 'Active',
          match_score: 92
        },
        {
          id: 'job-4',
          title: 'Overnight Newborn Care',
          company: 'Elite Care Services',
          location: {
            address: '321 Cedar Lane, East Side',
            distance_miles: 8.2,
            type: 'In-Home'
          },
          compensation: {
            hourly_rate: 28,
            estimated_hours: 40,
            payment_frequency: 'Weekly',
            benefits: ['Overtime Pay', 'Flexible Scheduling']
          },
          schedule: {
            start_date: '2025-08-22',
            end_date: '2025-10-22',
            days_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            time_ranges: ['10:00 PM - 6:00 AM'],
            flexibility: 'Fixed'
          },
          requirements: {
            experience_level: 'Experienced',
            certifications_required: ['Newborn Care Specialist', 'CPR Certified'],
            skills_required: ['Infant Sleep Training', 'Feeding Support', 'Diaper Changes'],
            background_check: true
          },
          job_details: {
            client_age_group: 'Newborn',
            care_type: 'Childcare',
            special_needs: ['Twins', 'Sleep schedule establishment'],
            description: 'Experienced newborn care specialist needed for overnight care of twins. Focus on establishing healthy sleep patterns and supporting parents with feeding schedules.'
          },
          urgency: 'Urgent',
          posted_date: '2025-08-15',
          application_deadline: '2025-08-17',
          positions_available: 1,
          applications_count: 12,
          status: 'Active',
          match_score: 78
        },
        {
          id: 'job-5',
          title: 'Weekend Companion Care',
          company: 'Caring Hands Agency',
          location: {
            address: '654 Birch Road, West End',
            distance_miles: 6.8,
            type: 'In-Home'
          },
          compensation: {
            hourly_rate: 22,
            estimated_hours: 16,
            payment_frequency: 'Bi-weekly'
          },
          schedule: {
            start_date: '2025-08-24',
            days_of_week: ['Saturday', 'Sunday'],
            time_ranges: ['8:00 AM - 4:00 PM'],
            flexibility: 'Flexible'
          },
          requirements: {
            experience_level: 'Entry Level',
            certifications_required: ['CPR Certified'],
            skills_required: ['Companionship', 'Light Meal Preparation', 'Medication Reminders'],
            background_check: true
          },
          job_details: {
            client_age_group: 'Adult',
            care_type: 'Postpartum Care',
            description: 'Weekend companion care for new mother. Provide emotional support, light housekeeping, and assistance with daily activities while family rests.'
          },
          urgency: 'Low',
          posted_date: '2025-08-11',
          positions_available: 1,
          applications_count: 6,
          status: 'Active',
          match_score: 82
        }
      ];

      setJobs(mockJobs);
      setError(null);
    } catch {
      setError('Failed to load job listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToJob = async (jobId: string) => {
    try {
      // Mock application logic
      setAppliedJobs(prev => new Set([...prev, jobId]));
      
      if (onApplyToJob) {
        onApplyToJob(jobId);
      }
      
      // Show success message
      alert('Application submitted successfully!');
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    }
  };

  const getUrgencyColor = (urgency: JobListing['urgency']) => {
    switch (urgency) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_details.care_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCareType = filters.careType === '' || job.job_details.care_type === filters.careType;
    const matchesPayRange = job.compensation.hourly_rate >= filters.payRange.min && 
                           job.compensation.hourly_rate <= filters.payRange.max;
    const matchesExperience = filters.experienceLevel === '' || 
                             job.requirements.experience_level === filters.experienceLevel;
    const matchesUrgency = filters.urgency === '' || job.urgency === filters.urgency;

    return matchesSearch && matchesCareType && matchesPayRange && matchesExperience && matchesUrgency;
  });

  if (isLoading) {
    return (
      <div className="healthcare-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-accent/20 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-accent/10 rounded-lg"></div>
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
          onClick={loadJobs}
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
          <Briefcase className="h-5 w-5 mr-2 text-luxury" />
          Available Positions ({filteredJobs.length})
        </h3>
      </div>

      {/* Search and Filters */}
      <div className="bg-background p-4 rounded-lg space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or care type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.careType}
            onChange={(e) => setFilters(prev => ({ ...prev, careType: e.target.value }))}
            className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
          >
            <option value="">All Care Types</option>
            <option value="Postpartum Care">Postpartum Care</option>
            <option value="Lactation Support">Lactation Support</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Childcare">Childcare</option>
          </select>

          <select
            value={filters.experienceLevel}
            onChange={(e) => setFilters(prev => ({ ...prev, experienceLevel: e.target.value }))}
            className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
          >
            <option value="">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Experienced">Experienced</option>
            <option value="Expert">Expert</option>
            <option value="Certified Specialist">Certified Specialist</option>
          </select>

          <select
            value={filters.urgency}
            onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
            className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
          >
            <option value="">All Urgency Levels</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <div className="flex items-center space-x-2">
            <span className="font-ui text-sm text-primary/70 whitespace-nowrap">Pay:</span>
            <input
              type="range"
              min="15"
              max="80"
              value={filters.payRange.max}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                payRange: { ...prev.payRange, max: Number(e.target.value) }
              }))}
              className="flex-1"
            />
            <span className="font-ui text-sm text-primary font-medium w-16">
              ${filters.payRange.max}/hr
            </span>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="healthcare-card p-8 text-center">
            <Briefcase className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <h4 className="font-heading text-primary mb-2">No jobs found</h4>
            <p className="font-body text-primary/60 mb-4">
              {searchTerm || Object.values(filters).some(f => f !== '' && f !== filters.payRange)
                ? 'No jobs match your search criteria. Try adjusting your filters.'
                : 'No jobs are currently available.'
              }
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.id} className="healthcare-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-luxury/20 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-luxury" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-heading text-lg font-semibold text-primary">
                        {job.title}
                      </h4>
                      {job.match_score && (
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${getMatchScoreColor(job.match_score)}`}>
                          {job.match_score}% Match
                        </span>
                      )}
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium border ${getUrgencyColor(job.urgency)}`}>
                        {job.urgency}
                      </span>
                    </div>
                    
                    <p className="font-body text-primary/80 mb-3">
                      {job.company} • {job.job_details.care_type}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-primary/60" />
                        <span className="font-body text-sm text-primary">
                          {formatCurrency(job.compensation.hourly_rate)}/hr
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary/60" />
                        <span className="font-body text-sm text-primary">
                          {job.compensation.estimated_hours} hrs/week
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-primary/60" />
                        <span className="font-body text-sm text-primary">
                          {job.location.distance_miles} miles • {job.location.type}
                        </span>
                      </div>
                    </div>

                    <p className="font-body text-primary/70 text-sm line-clamp-2 mb-3">
                      {job.job_details.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-primary/50">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Posted {formatDate(job.posted_date)}
                      </span>
                      {job.application_deadline && (
                        <span className="flex items-center text-orange-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Apply by {formatDate(job.application_deadline)}
                        </span>
                      )}
                      <span>{job.applications_count} applicants</span>
                      {job.client_rating && (
                        <span className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                          {job.client_rating} client rating
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="text-right">
                    <div className="font-heading text-lg font-bold text-primary">
                      {formatCurrency(job.compensation.hourly_rate * job.compensation.estimated_hours)}/week
                    </div>
                    <div className="font-body text-xs text-primary/60">
                      Estimated earnings
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowJobDetails(true);
                      }}
                      className="healthcare-button-secondary text-sm"
                    >
                      View Details
                    </button>
                    
                    {appliedJobs.has(job.id) ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-ui text-sm">Applied</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApplyToJob(job.id)}
                        className="healthcare-button-primary text-sm"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Requirements Preview */}
              <div className="border-t border-accent/20 pt-3">
                <div className="flex flex-wrap gap-2">
                  {job.requirements.certifications_required.slice(0, 3).map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-luxury/10 text-luxury rounded-full text-xs font-ui"
                    >
                      <Award className="h-3 w-3 mr-1" />
                      {cert}
                    </span>
                  ))}
                  {job.requirements.certifications_required.length > 3 && (
                    <span className="inline-flex px-2 py-1 bg-accent/10 text-primary/60 rounded-full text-xs font-ui">
                      +{job.requirements.certifications_required.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <div>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  {selectedJob.title}
                </h2>
                <p className="font-body text-primary/70">
                  {selectedJob.company} • {selectedJob.job_details.care_type}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  setSelectedJob(null);
                }}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="space-y-6">
                {/* Job Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary mb-3">Compensation</h3>
                      <div className="bg-background p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="font-ui text-sm text-primary/70">Hourly Rate:</span>
                          <span className="font-body font-medium text-primary">{formatCurrency(selectedJob.compensation.hourly_rate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-ui text-sm text-primary/70">Estimated Hours:</span>
                          <span className="font-body text-primary">{selectedJob.compensation.estimated_hours}/week</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-ui text-sm text-primary/70">Weekly Estimate:</span>
                          <span className="font-body font-medium text-primary">
                            {formatCurrency(selectedJob.compensation.hourly_rate * selectedJob.compensation.estimated_hours)}
                          </span>
                        </div>
                        {selectedJob.compensation.benefits && (
                          <div className="pt-2 border-t border-accent/20">
                            <span className="font-ui text-sm text-primary/70">Benefits:</span>
                            <ul className="list-disc list-inside font-body text-sm text-primary mt-1">
                              {selectedJob.compensation.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-primary mb-3">Schedule</h3>
                      <div className="bg-background p-4 rounded-lg space-y-2">
                        <div>
                          <span className="font-ui text-sm text-primary/70">Start Date:</span>
                          <p className="font-body text-primary">{formatDate(selectedJob.schedule.start_date)}</p>
                        </div>
                        {selectedJob.schedule.end_date && (
                          <div>
                            <span className="font-ui text-sm text-primary/70">End Date:</span>
                            <p className="font-body text-primary">{formatDate(selectedJob.schedule.end_date)}</p>
                          </div>
                        )}
                        <div>
                          <span className="font-ui text-sm text-primary/70">Days:</span>
                          <p className="font-body text-primary">{selectedJob.schedule.days_of_week.join(', ')}</p>
                        </div>
                        <div>
                          <span className="font-ui text-sm text-primary/70">Hours:</span>
                          <p className="font-body text-primary">{selectedJob.schedule.time_ranges.join(', ')}</p>
                        </div>
                        <div>
                          <span className="font-ui text-sm text-primary/70">Flexibility:</span>
                          <p className="font-body text-primary">{selectedJob.schedule.flexibility}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Job Description</h3>
                  <p className="font-body text-primary leading-relaxed bg-background p-4 rounded-lg">
                    {selectedJob.job_details.description}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Requirements</h3>
                  <div className="bg-background p-4 rounded-lg space-y-3">
                    <div>
                      <span className="font-ui font-medium text-primary">Experience Level:</span>
                      <p className="font-body text-primary/80">{selectedJob.requirements.experience_level}</p>
                    </div>
                    
                    <div>
                      <span className="font-ui font-medium text-primary">Required Certifications:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedJob.requirements.certifications_required.map((cert, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-luxury/10 text-luxury rounded-full text-sm font-ui"
                          >
                            <Award className="h-4 w-4 mr-1" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-ui font-medium text-primary">Required Skills:</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedJob.requirements.skills_required.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex px-3 py-1 bg-accent/10 text-primary rounded-full text-sm font-ui"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Info */}
                <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                  <div className="space-y-1">
                    <p className="font-ui text-sm text-primary/70">
                      {selectedJob.applications_count} applicants • {selectedJob.positions_available} position{selectedJob.positions_available > 1 ? 's' : ''} available
                    </p>
                    {selectedJob.application_deadline && (
                      <p className="font-ui text-sm text-orange-600">
                        Application deadline: {formatDate(selectedJob.application_deadline)}
                      </p>
                    )}
                  </div>
                  
                  {appliedJobs.has(selectedJob.id) ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-ui">Application Submitted</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleApplyToJob(selectedJob.id);
                        setShowJobDetails(false);
                        setSelectedJob(null);
                      }}
                      className="healthcare-button-primary"
                    >
                      Apply for This Position
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};