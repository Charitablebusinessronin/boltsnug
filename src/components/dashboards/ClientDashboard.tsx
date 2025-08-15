import React from 'react';
import { Heart, Clock, Calendar, Phone, Star, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
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
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
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

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
        <h3 className="font-heading text-lg font-semibold text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Request Service', icon: Heart, color: 'bg-red-100 text-red-600' },
            { name: 'Schedule Call', icon: Phone, color: 'bg-green-100 text-green-600' },
            { name: 'View Hours', icon: Clock, color: 'bg-blue-100 text-blue-600' },
            { name: 'Leave Feedback', icon: Star, color: 'bg-yellow-100 text-yellow-600' }
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