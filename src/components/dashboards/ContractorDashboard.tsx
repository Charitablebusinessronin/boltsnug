import React, { useState } from 'react';
import { Briefcase, Calendar, MapPin, DollarSign, Clock, Star, TrendingUp, FileText, GraduationCap, MessageSquare, Award } from 'lucide-react';
import { JobBoard } from '../contractor/JobBoard';
import { ApplicationsTracking } from '../contractor/ApplicationsTracking';
import { DocumentsManagement } from '../contractor/DocumentsManagement';
import { TrainingModules } from '../contractor/TrainingModules';
import { MessagesSystem } from '../contractor/MessagesSystem';

export const ContractorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'documents' | 'training' | 'messages'>('jobs');
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Healthcare Provider Portal</h2>
            <p className="font-body text-white/90">Deliver compassionate care and grow your healthcare career</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Available Jobs</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">7</p>
              <p className="font-ui text-green-600 text-xs mt-1">+2 new today</p>
            </div>
            <div className="bg-luxury/20 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-luxury" />
            </div>
          </div>
        </div>

        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">This Week</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">32hrs</p>
              <p className="font-ui text-blue-600 text-xs mt-1">8 shifts scheduled</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Monthly Earnings</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">$2,840</p>
              <p className="font-ui text-green-600 text-xs mt-1">+12% vs last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="healthcare-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Client Rating</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">4.8/5</p>
              <p className="font-ui text-green-600 text-xs mt-1">18 reviews</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>

      {/* Workbench Tabs */}
      <div className="healthcare-card p-2">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTab('jobs')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'jobs' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>
            <span className="inline-flex items-center"><Briefcase className="h-4 w-4 mr-2" /> Job Board</span>
          </button>
          <button onClick={() => setActiveTab('applications')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'applications' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>
            <span className="inline-flex items-center"><Award className="h-4 w-4 mr-2" /> Applications</span>
          </button>
          <button onClick={() => setActiveTab('documents')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'documents' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>
            <span className="inline-flex items-center"><FileText className="h-4 w-4 mr-2" /> Documents</span>
          </button>
          <button onClick={() => setActiveTab('training')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'training' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>
            <span className="inline-flex items-center"><GraduationCap className="h-4 w-4 mr-2" /> Training</span>
          </button>
          <button onClick={() => setActiveTab('messages')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'messages' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>
            <span className="inline-flex items-center"><MessageSquare className="h-4 w-4 mr-2" /> Messages</span>
          </button>
        </div>
      </div>

      {/* Active Module */}
      <div>
        {activeTab === 'jobs' && <JobBoard />}
        {activeTab === 'applications' && <ApplicationsTracking />}
        {activeTab === 'documents' && <DocumentsManagement />}
        {activeTab === 'training' && <TrainingModules />}
        {activeTab === 'messages' && <MessagesSystem />}
      </div>

      {/* Performance Overview */}
      

      <div className="healthcare-card p-6">
        <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-luxury" />
          Healthcare Performance Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Care Hours Completed', value: '287', change: '+12%', period: 'vs last month' },
            { label: 'Client Satisfaction', value: '4.9/5', change: '+0.2', period: 'this month' },
            { label: 'Certification Status', value: '100%', change: 'Current', period: 'all docs valid' },
            { label: 'Positive Reviews', value: '24', change: '+6', period: 'this month' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="healthcare-heading text-2xl font-bold">{stat.value}</p>
              <p className="healthcare-text-secondary text-sm">{stat.label}</p>
              <p className="healthcare-text-secondary text-xs mt-1 text-green-600">
                {stat.change} {stat.period}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="healthcare-card p-6">
        <h3 className="healthcare-heading text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Find Jobs', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
            { name: 'Submit Care Notes', icon: FileText, color: 'bg-green-100 text-green-600' },
            { name: 'Client Messages', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
            { name: 'Update Certifications', icon: Award, color: 'bg-yellow-100 text-yellow-600' }
          ].map((action, index) => (
            <button key={index} className="p-4 rounded-lg border border-accent/20 hover:shadow-md transition-all duration-200 text-center group">
              <div className={`${action.color} p-3 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="h-6 w-6" />
              </div>
              <p className="healthcare-ui-text font-medium text-sm">{action.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};