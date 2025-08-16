import React, { useState } from 'react';
import { Star, Send, AlertCircle, CheckCircle, MessageCircle } from 'lucide-react';
import { catalystClientFunctions, FeedbackSubmission } from '../../lib/catalyst-functions/client-functions';
import { zohoFeedback } from '../../lib/zoho-feedback';
import { useAuth } from '../../hooks/useAuth';

interface CaregiverOption {
  id: string;
  name: string;
  specialty: string;
}

interface FeedbackFormProps {
  onClose: () => void;
  caregivers?: CaregiverOption[];
  preselectedCaregiver?: string;
  preselectedServiceDate?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onClose,
  caregivers = [],
  preselectedCaregiver,
  preselectedServiceDate
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    feedbackType: 'Caregiver Review' as FeedbackSubmission['feedback_type'],
    rating: 0 as FeedbackSubmission['rating'],
    serviceDate: preselectedServiceDate || '',
    caregiverId: preselectedCaregiver || '',
    feedbackText: '',
    areasOfConcern: [] as string[],
    wouldRecommend: true,
    followUpRequested: false,
    anonymous: false
  });

  const feedbackTypes = [
    'Service Review',
    'Caregiver Review', 
    'Platform Feedback',
    'Complaint',
    'Suggestion'
  ] as const;

  const concernAreas = [
    'Communication',
    'Punctuality', 
    'Service Quality',
    'Professionalism',
    'Safety',
    'Cost'
  ] as const;

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating: rating as FeedbackSubmission['rating'] }));
  };

  const handleConcernToggle = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      areasOfConcern: prev.areasOfConcern.includes(concern)
        ? prev.areasOfConcern.filter(c => c !== concern)
        : [...prev.areasOfConcern, concern]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.feedbackText.trim()) {
      setError('Please provide feedback details');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const feedback: FeedbackSubmission = {
        client_id: user.id,
        feedback_type: formData.feedbackType,
        rating: formData.rating,
        service_date: formData.serviceDate || undefined,
        caregiver_id: formData.caregiverId || undefined,
        feedback_text: formData.feedbackText,
        areas_of_concern: formData.areasOfConcern.length > 0 ? formData.areasOfConcern as ('Communication' | 'Punctuality' | 'Service Quality' | 'Professionalism' | 'Safety' | 'Cost')[] : undefined,
        would_recommend: formData.wouldRecommend,
        follow_up_requested: formData.followUpRequested,
        anonymous: formData.anonymous
      };

      // Submit to both Catalyst functions and Zoho CRM
      const [catalystResult, zohoResult] = await Promise.all([
        catalystClientFunctions.submitFeedback(feedback),
        zohoFeedback.createFeedbackRecord(feedback)
      ]);
      
      if (catalystResult.success && zohoResult.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorMessage = !catalystResult.success 
          ? catalystResult.message 
          : zohoResult.message;
        setError(errorMessage || 'Failed to submit feedback');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-heading text-xl font-semibold text-primary mb-2">
            Feedback Submitted!
          </h3>
          <p className="font-body text-primary/70 mb-4">
            Thank you for your feedback. We appreciate your input to help us improve our services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-luxury/20 p-3 rounded-lg">
                <MessageCircle className="h-6 w-6 text-luxury" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  Share Your Feedback
                </h2>
                <p className="font-body text-primary/60 text-sm">
                  Help us improve our care services
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-primary/40 hover:text-primary transition-colors"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <span className="font-body text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block font-ui font-medium text-primary mb-2">
                Feedback Type
              </label>
              <select
                value={formData.feedbackType}
                onChange={(e) => setFormData(prev => ({
                  ...prev, 
                  feedbackType: e.target.value as FeedbackSubmission['feedback_type']
                }))}
                className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
              >
                {feedbackTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block font-ui font-medium text-primary mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingClick(rating)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= formData.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 font-body text-primary/60">
                  {formData.rating > 0 && (
                    <>
                      {formData.rating}/5 - {
                        formData.rating === 5 ? 'Excellent' :
                        formData.rating === 4 ? 'Good' :
                        formData.rating === 3 ? 'Average' :
                        formData.rating === 2 ? 'Poor' : 'Very Poor'
                      }
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Caregiver Selection */}
            {(formData.feedbackType === 'Caregiver Review' || formData.feedbackType === 'Service Review') && (
              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Caregiver
                </label>
                <select
                  value={formData.caregiverId}
                  onChange={(e) => setFormData(prev => ({ ...prev, caregiverId: e.target.value }))}
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                >
                  <option value="">Select a caregiver</option>
                  {caregivers.map(caregiver => (
                    <option key={caregiver.id} value={caregiver.id}>
                      {caregiver.name} - {caregiver.specialty}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Service Date */}
            {(formData.feedbackType === 'Caregiver Review' || formData.feedbackType === 'Service Review') && (
              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Service Date
                </label>
                <input
                  type="date"
                  value={formData.serviceDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                />
              </div>
            )}

            {/* Feedback Text */}
            <div>
              <label className="block font-ui font-medium text-primary mb-2">
                Detailed Feedback *
              </label>
              <textarea
                value={formData.feedbackText}
                onChange={(e) => setFormData(prev => ({ ...prev, feedbackText: e.target.value }))}
                placeholder="Please share your experience and any specific comments..."
                rows={4}
                className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body resize-none"
              />
            </div>

            {/* Areas of Concern */}
            {formData.rating < 4 && (
              <div>
                <label className="block font-ui font-medium text-primary mb-3">
                  Areas of Concern (optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {concernAreas.map(concern => (
                    <label key={concern} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.areasOfConcern.includes(concern)}
                        onChange={() => handleConcernToggle(concern)}
                        className="rounded border-accent/20 text-luxury focus:ring-luxury/50"
                      />
                      <span className="font-body text-sm text-primary">{concern}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Would Recommend */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wouldRecommend}
                  onChange={(e) => setFormData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                  className="rounded border-accent/20 text-luxury focus:ring-luxury/50"
                />
                <span className="font-body text-primary">
                  I would recommend this caregiver/service to others
                </span>
              </label>
            </div>

            {/* Follow-up and Anonymous Options */}
            <div className="space-y-3 pt-3 border-t border-accent/20">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.followUpRequested}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUpRequested: e.target.checked }))}
                  className="rounded border-accent/20 text-luxury focus:ring-luxury/50"
                />
                <span className="font-body text-primary/80">
                  Request follow-up from our team
                </span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
                  className="rounded border-accent/20 text-luxury focus:ring-luxury/50"
                />
                <span className="font-body text-primary/80">
                  Submit feedback anonymously
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-body text-primary/70 hover:text-primary transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || formData.rating === 0 || !formData.feedbackText.trim()}
                className="healthcare-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};