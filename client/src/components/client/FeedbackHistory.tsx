import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Calendar, User, AlertCircle, Search, Trash2 } from 'lucide-react';
import { FeedbackSubmission } from '../../lib/catalyst-functions/client-functions';

interface FeedbackHistoryEntry extends FeedbackSubmission {
  id: string;
  submitted_at: string;
  status: 'Submitted' | 'Under Review' | 'Acknowledged' | 'Resolved';
  response?: string;
  response_date?: string;
  caregiver_name?: string;
}

interface FeedbackHistoryProps {
  onNewFeedback: () => void;
}

export const FeedbackHistory: React.FC<FeedbackHistoryProps> = ({
  onNewFeedback
}) => {
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const loadFeedbackHistory = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData: FeedbackHistoryEntry[] = [
          {
            id: '1',
            client_id: 'client-123',
            feedback_type: 'Caregiver Review',
            rating: 5,
            service_date: '2025-08-12',
            caregiver_id: 'caregiver-1',
            caregiver_name: 'Sarah Martinez',
            feedback_text: 'Sarah was absolutely wonderful! She was compassionate, professional, and really helped me through my recovery. I would highly recommend her services.',
            areas_of_concern: undefined,
            would_recommend: true,
            follow_up_requested: false,
            anonymous: false,
            submitted_at: '2025-08-13T10:30:00Z',
            status: 'Acknowledged',
            response: 'Thank you for your positive feedback! We\'ve shared your comments with Sarah and the team.',
            response_date: '2025-08-13T14:20:00Z'
          },
          {
            id: '2',
            client_id: 'client-123',
            feedback_type: 'Service Review',
            rating: 4,
            service_date: '2025-08-05',
            caregiver_id: 'caregiver-2',
            caregiver_name: 'John Davis',
            feedback_text: 'Overall good service. John was knowledgeable and helpful, though communication could have been better.',
            areas_of_concern: ['Communication'],
            would_recommend: true,
            follow_up_requested: true,
            anonymous: false,
            submitted_at: '2025-08-06T16:45:00Z',
            status: 'Resolved',
            response: 'We appreciate your feedback and have discussed communication improvements with John. We\'ll follow up with you within the next week.',
            response_date: '2025-08-07T09:15:00Z'
          },
          {
            id: '3',
            client_id: 'client-123',
            feedback_type: 'Platform Feedback',
            rating: 3,
            feedback_text: 'The scheduling system could be more user-friendly. Sometimes it\'s hard to find available appointment slots.',
            would_recommend: true,
            follow_up_requested: false,
            anonymous: true,
            submitted_at: '2025-08-01T11:20:00Z',
            status: 'Under Review'
          }
        ];

        setFeedbackHistory(mockData);
        setError(null);
      } catch {
        setError('Failed to load feedback history');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeedbackHistory();
  }, []);

  const filteredFeedback = feedbackHistory.filter(feedback => {
    const matchesSearch = searchTerm === '' || 
      feedback.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.caregiver_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || feedback.feedback_type === filterType;
    const matchesRating = filterRating === 0 || feedback.rating === filterRating;

    return matchesSearch && matchesType && matchesRating;
  });

  const getStatusColor = (status: FeedbackHistoryEntry['status']) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Acknowledged': return 'bg-green-100 text-green-800';
      case 'Resolved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="healthcare-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-accent/20 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-accent/10 rounded-lg"></div>
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
          onClick={() => window.location.reload()}
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
          <MessageCircle className="h-5 w-5 mr-2 text-luxury" />
          Your Feedback History
        </h3>
        <button
          onClick={onNewFeedback}
          className="healthcare-button-primary text-sm"
        >
          Leave New Feedback
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-background p-4 rounded-lg space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-ui text-sm text-primary/70 mb-1">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
            >
              <option value="all">All Types</option>
              <option value="Caregiver Review">Caregiver Review</option>
              <option value="Service Review">Service Review</option>
              <option value="Platform Feedback">Platform Feedback</option>
              <option value="Complaint">Complaint</option>
              <option value="Suggestion">Suggestion</option>
            </select>
          </div>

          <div>
            <label className="block font-ui text-sm text-primary/70 mb-1">Filter by Rating</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length === 0 ? (
          <div className="healthcare-card p-8 text-center">
            <MessageCircle className="h-12 w-12 text-primary/30 mx-auto mb-4" />
            <h4 className="font-heading text-primary mb-2">No feedback found</h4>
            <p className="font-body text-primary/60 mb-4">
              {searchTerm || filterType !== 'all' || filterRating !== 0
                ? 'No feedback matches your search criteria.'
                : 'You haven\'t submitted any feedback yet.'
              }
            </p>
            {!searchTerm && filterType === 'all' && filterRating === 0 && (
              <button
                onClick={onNewFeedback}
                className="healthcare-button-primary"
              >
                Leave Your First Feedback
              </button>
            )}
          </div>
        ) : (
          filteredFeedback.map((feedback) => (
            <div key={feedback.id} className="healthcare-card p-6">
              {/* Feedback Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-luxury/20 p-2 rounded-lg mt-1">
                    {feedback.feedback_type === 'Caregiver Review' ? (
                      <User className="h-4 w-4 text-luxury" />
                    ) : (
                      <MessageCircle className="h-4 w-4 text-luxury" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-ui font-medium text-primary">
                        {feedback.feedback_type}
                      </span>
                      {feedback.caregiver_name && (
                        <>
                          <span className="text-primary/40">•</span>
                          <span className="font-body text-sm text-primary/70">
                            {feedback.caregiver_name}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-primary/50">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(feedback.submitted_at)}
                      </span>
                      {feedback.service_date && (
                        <span>Service: {formatDate(feedback.service_date)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(feedback.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                    <span className="ml-1 font-body text-sm text-primary/70">
                      {feedback.rating}/5
                    </span>
                  </div>

                  {/* Status */}
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>

              {/* Feedback Content */}
              <div className="mb-4">
                <p className="font-body text-primary leading-relaxed">
                  {feedback.feedback_text}
                </p>
                
                {feedback.areas_of_concern && feedback.areas_of_concern.length > 0 && (
                  <div className="mt-3 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span className="font-ui text-sm text-primary/70">Concerns:</span>
                    <div className="flex flex-wrap gap-1">
                      {feedback.areas_of_concern.map((concern, i) => (
                        <span
                          key={i}
                          className="inline-flex px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-ui"
                        >
                          {concern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Response */}
              {feedback.response && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="bg-green-100 p-1 rounded">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-ui font-medium text-green-800">Our Response</span>
                    {feedback.response_date && (
                      <span className="text-xs text-green-600">
                        {formatDate(feedback.response_date)}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-green-700 text-sm">
                    {feedback.response}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent/20">
                <div className="flex items-center space-x-4 text-xs text-primary/50">
                  {feedback.would_recommend && (
                    <span>✓ Would recommend</span>
                  )}
                  {feedback.follow_up_requested && (
                    <span>Follow-up requested</span>
                  )}
                  {feedback.anonymous && (
                    <span>Anonymous feedback</span>
                  )}
                </div>
                
                {feedback.status === 'Submitted' && (
                  <button className="text-primary/40 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredFeedback.length > 0 && (
        <div className="bg-gradient-to-r from-luxury/10 to-primary/10 rounded-lg p-4">
          <h4 className="font-ui font-medium text-primary mb-3">Feedback Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-primary">
                {filteredFeedback.length}
              </div>
              <div className="font-body text-xs text-primary/60">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-primary">
                {(filteredFeedback.reduce((sum, f) => sum + f.rating, 0) / filteredFeedback.length).toFixed(1)}
              </div>
              <div className="font-body text-xs text-primary/60">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-primary">
                {Math.round((filteredFeedback.filter(f => f.would_recommend).length / filteredFeedback.length) * 100)}%
              </div>
              <div className="font-body text-xs text-primary/60">Would Recommend</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-primary">
                {filteredFeedback.filter(f => f.status === 'Resolved').length}
              </div>
              <div className="font-body text-xs text-primary/60">Resolved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};