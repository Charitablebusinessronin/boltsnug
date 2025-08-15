import React, { useState, useEffect } from 'react';
import { GraduationCap, Play, CheckCircle, Clock, Star, Award, BookOpen, Users, Video, FileText, Download, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: 'Clinical Skills' | 'Safety & Compliance' | 'Professional Development' | 'Specialized Care' | 'Communication' | 'Technology';
  duration_minutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  format: 'Video' | 'Interactive' | 'Reading' | 'Quiz' | 'Webinar' | 'Hands-on';
  instructor: {
    name: string;
    credentials: string;
    profile_image?: string;
  };
  content: {
    lessons: number;
    videos: number;
    assessments: number;
    downloads: number;
  };
  enrollment_info: {
    enrolled: boolean;
    enrollment_date?: string;
    progress_percentage: number;
    completion_date?: string;
    certificate_earned?: boolean;
  };
  requirements: {
    prerequisites: string[];
    certifications_earned: string[];
    ceu_credits: number;
  };
  rating: {
    average: number;
    total_reviews: number;
  };
  availability: {
    start_date: string;
    end_date?: string;
    registration_deadline?: string;
  };
  cost: {
    price: number;
    currency: 'USD';
    payment_type: 'Free' | 'One-time' | 'Subscription' | 'Employer-funded';
  };
  featured: boolean;
  new_release: boolean;
  trending: boolean;
}

interface TrainingModulesProps {
  onEnrollModule?: (moduleId: string) => void;
}

export const TrainingModules: React.FC<TrainingModulesProps> = ({
  onEnrollModule
}) => {
  const { user } = useAuth();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [showModuleDetails, setShowModuleDetails] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'enrolled' | 'available' | 'completed'>('available');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrainingModules();
  }, []);

  const loadTrainingModules = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app, this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockModules: TrainingModule[] = [
        {
          id: 'module-1',
          title: 'Advanced Postpartum Care Techniques',
          description: 'Comprehensive training on advanced postpartum care methods, including recovery support, complication management, and family education.',
          category: 'Clinical Skills',
          duration_minutes: 180,
          difficulty: 'Advanced',
          format: 'Video',
          instructor: {
            name: 'Dr. Sarah Mitchell',
            credentials: 'MD, OB/GYN, Postpartum Care Specialist',
            profile_image: '/instructors/dr-sarah-mitchell.jpg'
          },
          content: {
            lessons: 8,
            videos: 12,
            assessments: 3,
            downloads: 5
          },
          enrollment_info: {
            enrolled: true,
            enrollment_date: '2025-08-01T09:00:00Z',
            progress_percentage: 65,
            completion_date: undefined,
            certificate_earned: false
          },
          requirements: {
            prerequisites: ['Basic Postpartum Care Certification', '1+ years experience'],
            certifications_earned: ['Advanced Postpartum Care Certificate'],
            ceu_credits: 6
          },
          rating: {
            average: 4.8,
            total_reviews: 234
          },
          availability: {
            start_date: '2025-07-01T00:00:00Z',
            end_date: '2025-12-31T23:59:59Z'
          },
          cost: {
            price: 0,
            currency: 'USD',
            payment_type: 'Employer-funded'
          },
          featured: true,
          new_release: false,
          trending: true
        },
        {
          id: 'module-2',
          title: 'HIPAA Compliance for Healthcare Workers',
          description: 'Essential training on HIPAA regulations, patient privacy, and healthcare data security requirements.',
          category: 'Safety & Compliance',
          duration_minutes: 90,
          difficulty: 'Beginner',
          format: 'Interactive',
          instructor: {
            name: 'Jennifer Coleman',
            credentials: 'JD, Healthcare Compliance Expert'
          },
          content: {
            lessons: 5,
            videos: 6,
            assessments: 2,
            downloads: 3
          },
          enrollment_info: {
            enrolled: true,
            enrollment_date: '2025-07-15T14:30:00Z',
            progress_percentage: 100,
            completion_date: '2025-07-22T16:45:00Z',
            certificate_earned: true
          },
          requirements: {
            prerequisites: [],
            certifications_earned: ['HIPAA Compliance Certificate'],
            ceu_credits: 3
          },
          rating: {
            average: 4.6,
            total_reviews: 1823
          },
          availability: {
            start_date: '2025-01-01T00:00:00Z',
            registration_deadline: '2025-12-15T23:59:59Z'
          },
          cost: {
            price: 0,
            currency: 'USD',
            payment_type: 'Free'
          },
          featured: false,
          new_release: false,
          trending: false
        },
        {
          id: 'module-3',
          title: 'Mental Health First Aid for Caregivers',
          description: 'Learn to recognize and respond to mental health crises, with special focus on postpartum depression and anxiety.',
          category: 'Specialized Care',
          duration_minutes: 240,
          difficulty: 'Intermediate',
          format: 'Webinar',
          instructor: {
            name: 'Dr. Michael Roberts',
            credentials: 'PhD, Licensed Clinical Psychologist'
          },
          content: {
            lessons: 6,
            videos: 8,
            assessments: 4,
            downloads: 7
          },
          enrollment_info: {
            enrolled: false,
            progress_percentage: 0,
            completion_date: undefined,
            certificate_earned: false
          },
          requirements: {
            prerequisites: ['Basic CPR Certification'],
            certifications_earned: ['Mental Health First Aid Certificate'],
            ceu_credits: 8
          },
          rating: {
            average: 4.9,
            total_reviews: 456
          },
          availability: {
            start_date: '2025-09-01T00:00:00Z',
            registration_deadline: '2025-08-25T23:59:59Z'
          },
          cost: {
            price: 149,
            currency: 'USD',
            payment_type: 'One-time'
          },
          featured: true,
          new_release: true,
          trending: false
        },
        {
          id: 'module-4',
          title: 'Lactation Support Fundamentals',
          description: 'Comprehensive guide to supporting breastfeeding mothers, including common challenges and solutions.',
          category: 'Clinical Skills',
          duration_minutes: 120,
          difficulty: 'Beginner',
          format: 'Video',
          instructor: {
            name: 'Maria Rodriguez',
            credentials: 'IBCLC, RN, Lactation Consultant'
          },
          content: {
            lessons: 7,
            videos: 10,
            assessments: 2,
            downloads: 4
          },
          enrollment_info: {
            enrolled: false,
            progress_percentage: 0,
            completion_date: undefined,
            certificate_earned: false
          },
          requirements: {
            prerequisites: [],
            certifications_earned: ['Lactation Support Certificate'],
            ceu_credits: 4
          },
          rating: {
            average: 4.7,
            total_reviews: 312
          },
          availability: {
            start_date: '2025-08-15T00:00:00Z'
          },
          cost: {
            price: 89,
            currency: 'USD',
            payment_type: 'One-time'
          },
          featured: false,
          new_release: false,
          trending: true
        },
        {
          id: 'module-5',
          title: 'Effective Communication with Families',
          description: 'Develop skills for compassionate communication with families during challenging times.',
          category: 'Communication',
          duration_minutes: 60,
          difficulty: 'Beginner',
          format: 'Interactive',
          instructor: {
            name: 'Lisa Thompson',
            credentials: 'MSW, Family Therapist'
          },
          content: {
            lessons: 4,
            videos: 5,
            assessments: 1,
            downloads: 2
          },
          enrollment_info: {
            enrolled: false,
            progress_percentage: 0,
            completion_date: undefined,
            certificate_earned: false
          },
          requirements: {
            prerequisites: [],
            certifications_earned: ['Communication Skills Certificate'],
            ceu_credits: 2
          },
          rating: {
            average: 4.5,
            total_reviews: 189
          },
          availability: {
            start_date: '2025-08-20T00:00:00Z'
          },
          cost: {
            price: 0,
            currency: 'USD',
            payment_type: 'Free'
          },
          featured: false,
          new_release: true,
          trending: false
        }
      ];

      setModules(mockModules);
      setError(null);
    } catch {
      setError('Failed to load training modules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollModule = async (moduleId: string) => {
    try {
      // Mock enrollment logic
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? {
              ...module,
              enrollment_info: {
                ...module.enrollment_info,
                enrolled: true,
                enrollment_date: new Date().toISOString(),
                progress_percentage: 0
              }
            }
          : module
      ));

      if (onEnrollModule) {
        onEnrollModule(moduleId);
      }

      alert('Successfully enrolled in module!');
    } catch {
      alert('Failed to enroll in module. Please try again.');
    }
  };

  const getFilteredModules = () => {
    let filtered = modules;

    // Filter by view mode
    if (viewMode === 'enrolled') {
      filtered = filtered.filter(m => m.enrollment_info.enrolled);
    } else if (viewMode === 'completed') {
      filtered = filtered.filter(m => m.enrollment_info.completion_date);
    } else if (viewMode === 'available') {
      filtered = filtered.filter(m => !m.enrollment_info.enrolled);
    }

    // Filter by category
    if (activeFilter !== 'all') {
      filtered = filtered.filter(m => m.category === activeFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getDifficultyColor = (difficulty: TrainingModule['difficulty']) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: TrainingModule['format']) => {
    switch (format) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Interactive': return <Users className="h-4 w-4" />;
      case 'Reading': return <BookOpen className="h-4 w-4" />;
      case 'Quiz': return <FileText className="h-4 w-4" />;
      case 'Webinar': return <Video className="h-4 w-4" />;
      case 'Hands-on': return <Users className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  const formatPrice = (price: number, paymentType: string) => {
    if (paymentType === 'Free' || price === 0) {
      return 'Free';
    }
    return `$${price}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const categories = [
    'Clinical Skills',
    'Safety & Compliance',
    'Professional Development',
    'Specialized Care',
    'Communication',
    'Technology'
  ];

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
          <GraduationCap className="h-5 w-5" />
          <span className="font-body">{error}</span>
        </div>
        <button
          onClick={loadTrainingModules}
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
          <GraduationCap className="h-5 w-5 mr-2 text-luxury" />
          Training & Education
        </h3>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-background p-1 rounded-lg">
        <div className="flex space-x-1">
          {[
            { id: 'available', label: 'Available Courses', count: modules.filter(m => !m.enrollment_info.enrolled).length },
            { id: 'enrolled', label: 'My Courses', count: modules.filter(m => m.enrollment_info.enrolled).length },
            { id: 'completed', label: 'Completed', count: modules.filter(m => m.enrollment_info.completion_date).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 flex-1 justify-center ${
                viewMode === tab.id
                  ? 'bg-luxury text-white shadow-md'
                  : 'text-primary/70 hover:text-primary hover:bg-accent/10'
              }`}
            >
              <span className="font-ui font-medium">{tab.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                viewMode === tab.id ? 'bg-white/20' : 'bg-accent/20'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-background p-4 rounded-lg space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              activeFilter === 'all' 
                ? 'bg-luxury text-white' 
                : 'bg-white border border-accent/20 text-primary hover:bg-accent/10'
            }`}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                activeFilter === category 
                  ? 'bg-luxury text-white' 
                  : 'bg-white border border-accent/20 text-primary hover:bg-accent/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Summary for Enrolled View */}
      {viewMode === 'enrolled' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background p-4 rounded-lg text-center">
            <div className="font-heading text-2xl font-bold text-primary">
              {modules.filter(m => m.enrollment_info.enrolled).length}
            </div>
            <div className="font-ui text-xs text-primary/60">Enrolled Courses</div>
          </div>
          <div className="bg-background p-4 rounded-lg text-center">
            <div className="font-heading text-2xl font-bold text-green-600">
              {modules.filter(m => m.enrollment_info.completion_date).length}
            </div>
            <div className="font-ui text-xs text-primary/60">Completed</div>
          </div>
          <div className="bg-background p-4 rounded-lg text-center">
            <div className="font-heading text-2xl font-bold text-luxury">
              {modules.filter(m => m.enrollment_info.certificate_earned).reduce((sum, m) => sum + m.requirements.ceu_credits, 0)}
            </div>
            <div className="font-ui text-xs text-primary/60">CEU Credits Earned</div>
          </div>
        </div>
      )}

      {/* Training Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getFilteredModules().map((module) => (
          <div key={module.id} className="healthcare-card p-6">
            {/* Module Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-heading text-lg font-semibold text-primary">
                    {module.title}
                  </h4>
                  {module.featured && (
                    <span className="inline-flex px-2 py-1 bg-luxury text-white rounded-full text-xs font-ui font-medium">
                      Featured
                    </span>
                  )}
                  {module.new_release && (
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-ui font-medium">
                      New
                    </span>
                  )}
                  {module.trending && (
                    <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-ui font-medium">
                      Trending
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-ui font-medium">
                    {getFormatIcon(module.format)}
                    <span className="ml-1">{module.format}</span>
                  </span>
                  <span className="font-body text-sm text-primary/60">
                    {formatDuration(module.duration_minutes)}
                  </span>
                </div>

                <p className="font-body text-primary/70 text-sm mb-3 line-clamp-2">
                  {module.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-luxury/20 rounded-full flex items-center justify-center">
                    {module.instructor.profile_image ? (
                      <img 
                        src={module.instructor.profile_image} 
                        alt={module.instructor.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <GraduationCap className="h-4 w-4 text-luxury" />
                    )}
                  </div>
                  <div>
                    <p className="font-ui text-sm font-medium text-primary">{module.instructor.name}</p>
                    <p className="font-body text-xs text-primary/60">{module.instructor.credentials}</p>
                  </div>
                </div>

                {/* Rating and Content Info */}
                <div className="flex items-center justify-between text-sm text-primary/60 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{module.rating.average}</span>
                    <span>({module.rating.total_reviews})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>{module.content.lessons} lessons</span>
                    <span>{module.requirements.ceu_credits} CEU</span>
                  </div>
                </div>
              </div>

              <div className="ml-4 text-right">
                <div className="font-heading text-lg font-bold text-primary mb-1">
                  {formatPrice(module.cost.price, module.cost.payment_type)}
                </div>
                {module.cost.payment_type !== 'Free' && (
                  <div className="font-body text-xs text-primary/60">{module.cost.payment_type}</div>
                )}
              </div>
            </div>

            {/* Progress Bar for Enrolled Modules */}
            {module.enrollment_info.enrolled && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-ui text-sm text-primary">Progress</span>
                  <span className="font-ui text-sm text-primary">{module.enrollment_info.progress_percentage}%</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-2">
                  <div 
                    className="bg-luxury h-2 rounded-full transition-all duration-300"
                    style={{ width: `${module.enrollment_info.progress_percentage}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedModule(module);
                  setShowModuleDetails(true);
                }}
                className="healthcare-button-secondary text-sm"
              >
                View Details
              </button>

              <div className="flex items-center space-x-2">
                {module.enrollment_info.enrolled ? (
                  module.enrollment_info.completion_date ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-ui text-sm">Completed</span>
                    </div>
                  ) : (
                    <button className="healthcare-button-primary text-sm flex items-center space-x-1">
                      <Play className="h-4 w-4" />
                      <span>Continue</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleEnrollModule(module.id)}
                    className="healthcare-button-primary text-sm"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getFilteredModules().length === 0 && (
        <div className="healthcare-card p-8 text-center">
          <GraduationCap className="h-12 w-12 text-primary/30 mx-auto mb-4" />
          <h4 className="font-heading text-primary mb-2">No courses found</h4>
          <p className="font-body text-primary/60">
            {searchTerm || activeFilter !== 'all'
              ? 'No courses match your search criteria.'
              : `No ${viewMode} courses available.`
            }
          </p>
        </div>
      )}

      {/* Module Details Modal */}
      {showModuleDetails && selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <div>
                <h2 className="font-heading text-xl font-semibold text-primary">
                  {selectedModule.title}
                </h2>
                <p className="font-body text-primary/70">
                  {selectedModule.category} • {formatDuration(selectedModule.duration_minutes)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModuleDetails(false);
                  setSelectedModule(null);
                }}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="space-y-6">
                {/* Course Overview */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Course Overview</h3>
                  <p className="font-body text-primary leading-relaxed">
                    {selectedModule.description}
                  </p>
                </div>

                {/* Instructor Information */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Instructor</h3>
                  <div className="flex items-center space-x-4 p-4 bg-background rounded-lg">
                    <div className="w-16 h-16 bg-luxury/20 rounded-full flex items-center justify-center">
                      {selectedModule.instructor.profile_image ? (
                        <img 
                          src={selectedModule.instructor.profile_image} 
                          alt={selectedModule.instructor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <GraduationCap className="h-8 w-8 text-luxury" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-ui font-semibold text-primary">{selectedModule.instructor.name}</h4>
                      <p className="font-body text-primary/70">{selectedModule.instructor.credentials}</p>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">What You'll Learn</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background p-4 rounded-lg text-center">
                      <BookOpen className="h-6 w-6 text-luxury mx-auto mb-2" />
                      <div className="font-heading text-lg font-bold text-primary">{selectedModule.content.lessons}</div>
                      <div className="font-ui text-xs text-primary/60">Lessons</div>
                    </div>
                    <div className="bg-background p-4 rounded-lg text-center">
                      <Video className="h-6 w-6 text-luxury mx-auto mb-2" />
                      <div className="font-heading text-lg font-bold text-primary">{selectedModule.content.videos}</div>
                      <div className="font-ui text-xs text-primary/60">Videos</div>
                    </div>
                    <div className="bg-background p-4 rounded-lg text-center">
                      <FileText className="h-6 w-6 text-luxury mx-auto mb-2" />
                      <div className="font-heading text-lg font-bold text-primary">{selectedModule.content.assessments}</div>
                      <div className="font-ui text-xs text-primary/60">Assessments</div>
                    </div>
                    <div className="bg-background p-4 rounded-lg text-center">
                      <Download className="h-6 w-6 text-luxury mx-auto mb-2" />
                      <div className="font-heading text-lg font-bold text-primary">{selectedModule.content.downloads}</div>
                      <div className="font-ui text-xs text-primary/60">Resources</div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-3">Requirements & Outcomes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-ui font-medium text-primary mb-2">Prerequisites:</h4>
                      {selectedModule.requirements.prerequisites.length > 0 ? (
                        <ul className="list-disc list-inside font-body text-primary/70 space-y-1">
                          {selectedModule.requirements.prerequisites.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-body text-primary/70">No prerequisites required</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-ui font-medium text-primary mb-2">You'll Earn:</h4>
                      <div className="space-y-2">
                        {selectedModule.requirements.certifications_earned.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-luxury" />
                            <span className="font-body text-primary/70">{cert}</span>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-luxury" />
                          <span className="font-body text-primary/70">{selectedModule.requirements.ceu_credits} CEU Credits</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enrollment Action */}
                <div className="flex items-center justify-between pt-6 border-t border-accent/20">
                  <div>
                    <div className="font-heading text-2xl font-bold text-primary">
                      {formatPrice(selectedModule.cost.price, selectedModule.cost.payment_type)}
                    </div>
                    {selectedModule.availability.registration_deadline && (
                      <p className="font-body text-sm text-orange-600">
                        Registration closes: {formatDate(selectedModule.availability.registration_deadline)}
                      </p>
                    )}
                  </div>
                  
                  {selectedModule.enrollment_info.enrolled ? (
                    selectedModule.enrollment_info.completion_date ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-ui">Course Completed</span>
                      </div>
                    ) : (
                      <button className="healthcare-button-primary flex items-center space-x-2">
                        <Play className="h-5 w-5" />
                        <span>Continue Learning</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => {
                        handleEnrollModule(selectedModule.id);
                        setShowModuleDetails(false);
                        setSelectedModule(null);
                      }}
                      className="healthcare-button-primary flex items-center space-x-2"
                    >
                      <GraduationCap className="h-5 w-5" />
                      <span>Enroll Now</span>
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