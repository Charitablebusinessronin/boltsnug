import React from 'react';
import { Briefcase, Calendar, MapPin, DollarSign, Clock, Star, TrendingUp, Users } from 'lucide-react';

export const ContractorDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Your Contractor Dashboard</h2>
            <p className="font-body text-white/90">Manage your assignments and grow your career</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Briefcase className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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

      {/* Today's Schedule & Available Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-luxury" />
            Today's Schedule
          </h3>
          <div className="space-y-3">
            {[
              { time: '9:00 AM - 1:00 PM', client: 'Margaret Thompson', service: 'Personal Care', location: '1.2 miles away' },
              { time: '2:00 PM - 6:00 PM', client: 'Robert Johnson', service: 'Companion Care', location: '2.8 miles away' },
              { time: '7:00 PM - 10:00 PM', client: 'Helen Rodriguez', service: 'Evening Care', location: '0.5 miles away' }
            ].map((shift, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                <div className="bg-luxury text-primary p-2 rounded-lg text-xs font-ui font-semibold min-w-[80px] text-center">
                  {shift.time.split(' - ')[0]}
                </div>
                <div className="flex-1">
                  <p className="font-ui font-medium text-primary">{shift.client}</p>
                  <p className="font-ui text-sm text-primary/60">{shift.service}</p>
                  <p className="font-ui text-sm text-primary/50 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {shift.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-ui text-sm text-primary/70">{shift.time.split(' - ')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Jobs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-luxury" />
            Available Jobs
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Overnight Care Assistant', pay: '$18/hr', duration: '8 hours', location: 'Downtown', urgency: 'High' },
              { title: 'Weekend Companion', pay: '$16/hr', duration: '6 hours', location: 'Suburbs', urgency: 'Medium' },
              { title: 'Medical Assistant', pay: '$22/hr', duration: '4 hours', location: 'Midtown', urgency: 'High' }
            ].map((job, index) => (
              <div key={index} className="p-3 bg-background rounded-lg border-l-4 border-luxury">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-ui font-medium text-primary">{job.title}</p>
                    <p className="font-ui text-sm text-primary/60 flex items-center space-x-3">
                      <span className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {job.pay}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {job.duration}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${
                      job.urgency === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {job.urgency}
                    </span>
                  </div>
                </div>
                <button className="mt-2 bg-primary text-white px-4 py-1 rounded font-ui text-sm hover:bg-primary-dark transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
        <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-luxury" />
          Performance Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Completed Shifts', value: '127', change: '+8%', period: 'vs last month' },
            { label: 'On-Time Rate', value: '98%', change: '+2%', period: 'this month' },
            { label: 'Client Retention', value: '94%', change: '+5%', period: 'this quarter' },
            { label: 'Referrals Made', value: '12', change: '+4', period: 'this month' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-heading text-2xl font-bold text-primary">{stat.value}</p>
              <p className="font-ui text-sm text-primary/60">{stat.label}</p>
              <p className="font-ui text-xs text-green-600 mt-1">
                {stat.change} {stat.period}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
        <h3 className="font-heading text-lg font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Browse Jobs', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
            { name: 'Submit Notes', icon: Calendar, color: 'bg-green-100 text-green-600' },
            { name: 'View Messages', icon: Users, color: 'bg-purple-100 text-purple-600' },
            { name: 'Update Profile', icon: Star, color: 'bg-yellow-100 text-yellow-600' }
          ].map((action, index) => (
            <button key={index} className="p-4 rounded-lg border border-accent/20 hover:shadow-md transition-all duration-200 text-center group">
              <div className={`${action.color} p-3 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="h-6 w-6" />
              </div>
              <p className="font-ui font-medium text-primary text-sm">{action.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};