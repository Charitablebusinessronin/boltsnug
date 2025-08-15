import React, { useState, useEffect } from 'react';
import { Users, Star, MapPin, Clock, DollarSign, Heart, CheckCircle, Search, Calendar, MessageCircle, AlertCircle } from 'lucide-react';
import { catalystClientFunctions, CaregiverMatchingRequest } from '../../lib/catalyst-functions/client-functions';
import { useAuth } from '../../hooks/useAuth';

interface CaregiverMatch {
  caregiver_id: string;
  name: string;
  profile_image?: string;
  match_score: number;
  specialties: string[];
  experience_years: number;
  certifications: string[];
  availability: string[];
  hourly_rate: number;
  distance_miles: number;
  rating: number;
  total_reviews: number;
  key_qualifications: string[];
  bio: string;
  languages: string[];
  preferred_age_groups: string[];
  background_verified: boolean;
  insurance_accepted: boolean;
}

interface CareMatchingProps {
  onRequestMatch?: () => void;
}

export const CareMatching: React.FC<CareMatchingProps> = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<CaregiverMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMatchingForm, setShowMatchingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    maxRate: 60,
    maxDistance: 25,
    minRating: 0,
    availability: ''
  });
  const [error, setError] = useState<string | null>(null);

  const [matchingCriteria, setMatchingCriteria] = useState<Partial<CaregiverMatchingRequest>>({
    care_needs: {
      primary_need: 'Postpartum Care',
      specific_services: [],
      experience_level_required: 'Experienced',
      certifications_required: []
    },
    schedule_preferences: {
      days_of_week: [],
      time_ranges: [],
      flexibility: 'Somewhat Flexible'
    },
    location_info: {
      address: '',
      max_travel_distance: 15,
      transportation_provided: false
    },
    personal_preferences: {
      gender_preference: 'No Preference',
      language_requirements: []
    },
    budget_constraints: {
      hourly_rate_max: 50,
      insurance_coverage: false
    }
  });

  useEffect(() => {
    // Load existing matches if any
    loadExistingMatches();
  }, []);

  const loadExistingMatches = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app, this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMatches: CaregiverMatch[] = [
        {
          caregiver_id: 'caregiver-1',
          name: 'Sarah Martinez',
          profile_image: '/profiles/sarah-martinez.jpg',
          match_score: 95,
          specialties: ['Postpartum Care', 'Breastfeeding Support', 'Newborn Care'],
          experience_years: 8,
          certifications: ['Certified Lactation Consultant', 'CPR Certified', 'Postpartum Doula'],
          availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
          hourly_rate: 35,
          distance_miles: 3.2,
          rating: 4.9,
          total_reviews: 127,
          key_qualifications: ['8+ years experience', 'Specialized in postpartum depression support', 'Bilingual (English/Spanish)'],
          bio: 'Dedicated postpartum specialist with extensive experience supporting new mothers through their recovery journey. I focus on personalized care that addresses both physical and emotional needs.',
          languages: ['English', 'Spanish'],
          preferred_age_groups: ['Newborn', 'Infant'],
          background_verified: true,
          insurance_accepted: true
        },
        {
          caregiver_id: 'caregiver-2',
          name: 'Emily Johnson',
          profile_image: '/profiles/emily-johnson.jpg',
          match_score: 88,
          specialties: ['Companion Care', 'Light Housekeeping', 'Meal Preparation'],
          experience_years: 5,
          certifications: ['CNA', 'First Aid Certified'],
          availability: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
          hourly_rate: 28,
          distance_miles: 7.8,
          rating: 4.7,
          total_reviews: 89,
          key_qualifications: ['CNA certified', 'Excellent with meal preparation', 'Flexible scheduling'],
          bio: 'Compassionate caregiver who believes in providing holistic support to new mothers. I specialize in creating a nurturing environment for recovery.',
          languages: ['English'],
          preferred_age_groups: ['Newborn', 'Infant', 'Toddler'],
          background_verified: true,
          insurance_accepted: false
        },
        {
          caregiver_id: 'caregiver-3',
          name: 'Dr. Maria Rodriguez',
          profile_image: '/profiles/maria-rodriguez.jpg',
          match_score: 92,
          specialties: ['Mental Health Support', 'Postpartum Depression', 'Counseling'],
          experience_years: 12,
          certifications: ['Licensed Clinical Social Worker', 'Perinatal Mental Health Specialist'],
          availability: ['Monday', 'Wednesday', 'Thursday'],
          hourly_rate: 65,
          distance_miles: 12.4,
          rating: 5.0,
          total_reviews: 156,
          key_qualifications: ['LCSW licensed', 'Specializes in postpartum mental health', '12+ years experience'],
          bio: 'Licensed clinical social worker specializing in perinatal mental health. I provide evidence-based therapy for postpartum anxiety and depression.',
          languages: ['English', 'Spanish', 'Portuguese'],
          preferred_age_groups: ['Adult'],
          background_verified: true,
          insurance_accepted: true
        },
        {
          caregiver_id: 'caregiver-4',
          name: 'Jennifer Kim',
          profile_image: '/profiles/jennifer-kim.jpg',
          match_score: 85,
          specialties: ['Lactation Support', 'Breastfeeding Education', 'Pump Training'],
          experience_years: 6,
          certifications: ['IBCLC', 'Registered Nurse'],
          availability: ['Tuesday', 'Wednesday', 'Thursday', 'Sunday'],
          hourly_rate: 45,
          distance_miles: 5.1,
          rating: 4.8,
          total_reviews: 203,
          key_qualifications: ['IBCLC certified', 'RN background', 'Pump fitting specialist'],
          bio: 'Board-certified lactation consultant and registered nurse. I help mothers establish successful breastfeeding relationships with personalized support.',
          languages: ['English', 'Korean'],
          preferred_age_groups: ['Newborn', 'Infant'],
          background_verified: true,
          insurance_accepted: true
        }
      ];

      setMatches(mockMatches);
      setError(null);
    } catch {
      setError('Failed to load caregiver matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindMatches = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const matchingRequest: CaregiverMatchingRequest = {
        client_id: user.id,
        ...matchingCriteria
      } as CaregiverMatchingRequest;

      const result = await catalystClientFunctions.findCaregiverMatches(matchingRequest);

      if (result.success) {
        // Convert API matches to display format
        const apiMatches: CaregiverMatch[] = result.matches.map(match => ({
          caregiver_id: match.caregiver_id,
          name: `Caregiver ${match.caregiver_id}`, // Would come from API
          match_score: Math.round(match.match_score * 100),
          specialties: match.key_qualifications,
          experience_years: 5, // Would come from API
          certifications: match.key_qualifications,
          availability: match.availability,
          hourly_rate: match.estimated_cost,
          distance_miles: match.distance_miles,
          rating: 4.5, // Would come from API
          total_reviews: 50, // Would come from API
          key_qualifications: match.key_qualifications,
          bio: 'Professional caregiver ready to provide excellent care.',
          languages: ['English'],
          preferred_age_groups: ['Newborn', 'Infant'],
          background_verified: true,
          insurance_accepted: true
        }));

        setMatches(apiMatches);
        setShowMatchingForm(false);
      } else {
        setError(result.message || 'Failed to find matches');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find matches');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCaregiver = async (caregiverId: string) => {
    try {
      const result = await catalystClientFunctions.selectCaregiver(
        user?.id || '',
        caregiverId,
        'matching-request-id' // This would be the actual matching request ID
      );

      if (result.success) {
        // Handle successful selection
        alert(`Caregiver selected successfully! Assignment ID: ${result.assignment_id}`);
      } else {
        setError('Failed to select caregiver');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to select caregiver');
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = searchTerm === '' || 
      match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = filters.specialty === '' || 
      match.specialties.some(s => s.toLowerCase().includes(filters.specialty.toLowerCase()));
    
    const matchesRate = match.hourly_rate <= filters.maxRate;
    const matchesDistance = match.distance_miles <= filters.maxDistance;
    const matchesRating = match.rating >= filters.minRating;
    const matchesAvailability = filters.availability === '' || 
      match.availability.includes(filters.availability);

    return matchesSearch && matchesSpecialty && matchesRate && matchesDistance && matchesRating && matchesAvailability;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="healthcare-heading text-lg font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2 text-luxury" />
          Caregiver Matching
        </h3>
        <button
          onClick={() => setShowMatchingForm(true)}
          className="healthcare-button-primary text-sm"
        >
          Find New Matches
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-background p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
            <input
              type="text"
              placeholder="Search caregivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
            />
          </div>

          {/* Specialty Filter */}
          <select
            value={filters.specialty}
            onChange={(e) => setFilters(prev => ({ ...prev, specialty: e.target.value }))}
            className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm"
          >
            <option value="">All Specialties</option>
            <option value="Postpartum Care">Postpartum Care</option>
            <option value="Lactation Support">Lactation Support</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Companion Care">Companion Care</option>
          </select>

          {/* Rate Filter */}
          <div className="flex items-center space-x-2">
            <span className="font-ui text-sm text-primary/70 whitespace-nowrap">Max Rate:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={filters.maxRate}
              onChange={(e) => setFilters(prev => ({ ...prev, maxRate: Number(e.target.value) }))}
              className="flex-1"
            />
            <span className="font-ui text-sm text-primary font-medium w-16">
              ${filters.maxRate}/hr
            </span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="healthcare-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-luxury border-t-transparent mx-auto mb-4"></div>
          <p className="font-body text-primary/60">Finding the best matches for you...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="font-body text-red-700">{error}</span>
        </div>
      )}

      {/* Matches Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.length === 0 ? (
            <div className="col-span-full healthcare-card p-8 text-center">
              <Users className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <h4 className="font-heading text-primary mb-2">No matches found</h4>
              <p className="font-body text-primary/60 mb-4">
                {matches.length === 0 
                  ? 'Click "Find New Matches" to discover caregivers in your area.'
                  : 'Try adjusting your search criteria to see more results.'
                }
              </p>
              <button
                onClick={() => setShowMatchingForm(true)}
                className="healthcare-button-primary"
              >
                Find Caregivers
              </button>
            </div>
          ) : (
            filteredMatches.map((match) => (
              <div key={match.caregiver_id} className="healthcare-card p-6">
                {/* Caregiver Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-luxury/20 rounded-full flex items-center justify-center">
                      {match.profile_image ? (
                        <img 
                          src={match.profile_image} 
                          alt={match.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <Heart className="h-8 w-8 text-luxury" />
                      )}
                    </div>
                    {match.background_verified && (
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading text-lg font-semibold text-primary">
                        {match.name}
                      </h4>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-ui font-medium ${getMatchScoreColor(match.match_score)}`}>
                        {match.match_score}% Match
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(Math.floor(match.rating))].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        ))}
                        <span className="font-body text-sm text-primary/70">
                          {match.rating} ({match.total_reviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-primary/60">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {match.distance_miles} miles away
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {match.experience_years} years exp.
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatCurrency(match.hourly_rate)}/hr
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="font-body text-primary/80 text-sm mb-4 line-clamp-2">
                  {match.bio}
                </p>

                {/* Specialties */}
                <div className="mb-4">
                  <h5 className="font-ui font-medium text-primary mb-2 text-sm">Specialties:</h5>
                  <div className="flex flex-wrap gap-2">
                    {match.specialties.slice(0, 3).map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex px-2 py-1 bg-luxury/10 text-luxury rounded-full text-xs font-ui"
                      >
                        {specialty}
                      </span>
                    ))}
                    {match.specialties.length > 3 && (
                      <span className="inline-flex px-2 py-1 bg-accent/10 text-primary/60 rounded-full text-xs font-ui">
                        +{match.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Key Qualifications */}
                <div className="mb-4">
                  <h5 className="font-ui font-medium text-primary mb-2 text-sm">Key Qualifications:</h5>
                  <ul className="list-disc list-inside font-body text-sm text-primary/70 space-y-1">
                    {match.key_qualifications.slice(0, 2).map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <h5 className="font-ui font-medium text-primary mb-2 text-sm">Available Days:</h5>
                  <div className="flex flex-wrap gap-1">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <span
                        key={day}
                        className={`inline-flex px-2 py-1 rounded text-xs font-ui ${
                          match.availability.includes(day)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages & Insurance */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-ui text-xs text-primary/60">Languages:</span>
                    <p className="font-body text-sm text-primary">
                      {match.languages.join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="font-ui text-xs text-primary/60">Insurance:</span>
                    <p className="font-body text-sm text-primary">
                      {match.insurance_accepted ? 'Accepted' : 'Not Accepted'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-accent/20">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-primary/70 hover:text-primary transition-colors text-sm">
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                    <button className="flex items-center space-x-1 text-primary/70 hover:text-primary transition-colors text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>Schedule</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleSelectCaregiver(match.caregiver_id)}
                    className="healthcare-button-primary text-sm"
                  >
                    Select Caregiver
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Matching Form Modal */}
      {showMatchingForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <h2 className="font-heading text-xl font-semibold text-primary">
                Find Your Perfect Caregiver
              </h2>
              <button
                onClick={() => setShowMatchingForm(false)}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="space-y-6">
                {/* Care Needs */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Care Needs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-ui font-medium text-primary mb-2">Primary Need</label>
                      <select
                        value={matchingCriteria.care_needs?.primary_need}
                        onChange={(e) => setMatchingCriteria(prev => ({
                          ...prev,
                          care_needs: {
                            ...prev.care_needs!,
                            primary_need: e.target.value as 'Postpartum Care' | 'Lactation Support' | 'Mental Health' | 'Childcare'
                          }
                        }))}
                        className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                      >
                        <option value="Postpartum Care">Postpartum Care</option>
                        <option value="Lactation Support">Lactation Support</option>
                        <option value="Mental Health">Mental Health</option>
                        <option value="Childcare">Childcare</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block font-ui font-medium text-primary mb-2">Experience Level</label>
                      <select
                        value={matchingCriteria.care_needs?.experience_level_required}
                        onChange={(e) => setMatchingCriteria(prev => ({
                          ...prev,
                          care_needs: {
                            ...prev.care_needs!,
                            experience_level_required: e.target.value as 'Entry Level' | 'Experienced' | 'Expert' | 'Certified Specialist'
                          }
                        }))}
                        className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                      >
                        <option value="Entry Level">Entry Level</option>
                        <option value="Experienced">Experienced</option>
                        <option value="Expert">Expert</option>
                        <option value="Certified Specialist">Certified Specialist</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Budget</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-ui font-medium text-primary mb-2">
                        Maximum Hourly Rate: ${matchingCriteria.budget_constraints?.hourly_rate_max || 50}
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={matchingCriteria.budget_constraints?.hourly_rate_max || 50}
                        onChange={(e) => setMatchingCriteria(prev => ({
                          ...prev,
                          budget_constraints: {
                            ...prev.budget_constraints!,
                            hourly_rate_max: Number(e.target.value)
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="insurance"
                        checked={matchingCriteria.budget_constraints?.insurance_coverage || false}
                        onChange={(e) => setMatchingCriteria(prev => ({
                          ...prev,
                          budget_constraints: {
                            ...prev.budget_constraints!,
                            insurance_coverage: e.target.checked
                          }
                        }))}
                        className="rounded border-accent/20 text-luxury focus:ring-luxury/50"
                      />
                      <label htmlFor="insurance" className="font-ui text-primary">
                        Insurance coverage available
                      </label>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Location Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-ui font-medium text-primary mb-2">Your Address</label>
                      <input
                        type="text"
                        value={matchingCriteria.location_info?.address || ''}
                        onChange={(e) => setMatchingCriteria(prev => ({
                          ...prev,
                          location_info: {
                            ...prev.location_info!,
                            address: e.target.value
                          }
                        }))}
                        placeholder="Enter your address for distance calculations"
                        className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                      />
                    </div>
                    
                    <div>
                      <label className="block font-ui font-medium text-primary mb-2">
                        Maximum Distance: {matchingCriteria.location_info?.max_travel_distance || 15} miles
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={matchingCriteria.location_info?.max_travel_distance || 15}
                        onChange={(e) => setMatchingCriteria(prev => ({
                          ...prev,
                          location_info: {
                            ...prev.location_info!,
                            max_travel_distance: Number(e.target.value)
                          }
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-accent/20">
                <button
                  onClick={() => setShowMatchingForm(false)}
                  className="px-4 py-2 font-body text-primary/70 hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFindMatches}
                  disabled={isLoading}
                  className="healthcare-button-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span>Find Matches</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};