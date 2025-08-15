import React from 'react';
import { Calendar, Users, BookOpen, TrendingUp, Bell, Clock, Award, MessageSquare } from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Employee Hub</h2>
            <p className="font-body text-white/90">Your workspace for collaboration and growth</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">This Week</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">38hrs</p>
              <p className="font-ui text-green-600 text-xs mt-1">2 hrs overtime</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Messages</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">5</p>
              <p className="font-ui text-orange-600 text-xs mt-1">2 urgent</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Training Progress</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">78%</p>
              <p className="font-ui text-blue-600 text-xs mt-1">3 modules remaining</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Performance</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">4.6/5</p>
              <p className="font-ui text-green-600 text-xs mt-1">Above average</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Schedule & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-luxury" />
            Today's Schedule
          </h3>
          <div className="space-y-3">
            {[
              { time: '9:00 AM', event: 'Team Meeting', location: 'Conference Room A', type: 'Meeting' },
              { time: '11:00 AM', event: 'Client Care Review', location: 'Office 203', type: 'Review' },
              { time: '2:00 PM', event: 'Training Session', location: 'Virtual', type: 'Training' },
              { time: '4:00 PM', event: 'Department Sync', location: 'Zoom', type: 'Meeting' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                <div className="bg-luxury text-primary p-2 rounded-lg text-xs font-ui font-semibold min-w-[70px] text-center">
                  {item.time}
                </div>
                <div className="flex-1">
                  <p className="font-ui font-medium text-primary">{item.event}</p>
                  <p className="font-ui text-sm text-primary/60">{item.location}</p>
                </div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${
                  item.type === 'Meeting' ? 'bg-blue-100 text-blue-800' :
                  item.type === 'Training' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Company Announcements */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-luxury" />
            Company Announcements
          </h3>
          <div className="space-y-3">
            {[
              { title: 'New Training Module Available', content: 'Advanced Patient Communication course is now live', time: '2 hours ago', priority: 'high' },
              { title: 'Holiday Schedule Update', content: 'Updated holiday coverage schedule for December', time: '1 day ago', priority: 'medium' },
              { title: 'Employee Recognition Program', content: 'Nominate colleagues for outstanding service', time: '2 days ago', priority: 'low' }
            ].map((announcement, index) => (
              <div key={index} className="p-3 bg-background rounded-lg border-l-4 border-luxury">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-ui font-medium text-primary">{announcement.title}</p>
                    <p className="font-ui text-sm text-primary/60 mt-1">{announcement.content}</p>
                  </div>
                  <div className="ml-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${
                      announcement.priority === 'high' ? 'bg-red-100 text-red-800' :
                      announcement.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {announcement.priority}
                    </span>
                  </div>
                </div>
                <p className="font-ui text-xs text-primary/50 mt-2">{announcement.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Overview & Training Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-luxury" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            {[
              { metric: 'Quality Score', value: '4.6/5.0', progress: 92, trend: '+0.2' },
              { metric: 'Punctuality', value: '98%', progress: 98, trend: '+1%' },
              { metric: 'Client Satisfaction', value: '4.8/5.0', progress: 96, trend: '+0.1' },
              { metric: 'Team Collaboration', value: '4.4/5.0', progress: 88, trend: '+0.3' }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-ui text-sm font-medium text-primary">{item.metric}</span>
                  <span className="font-ui text-sm text-primary/70">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-luxury to-luxury-light h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
                <div className="text-right mt-1">
                  <span className="font-ui text-xs text-green-600">{item.trend} this month</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-luxury" />
            Training Progress
          </h3>
          <div className="space-y-3">
            {[
              { course: 'Advanced Patient Care', progress: 85, status: 'In Progress', due: 'Next week' },
              { course: 'Emergency Response', progress: 100, status: 'Completed', due: 'Completed' },
              { course: 'Communication Skills', progress: 60, status: 'In Progress', due: '2 weeks' },
              { course: 'HIPAA Compliance', progress: 100, status: 'Completed', due: 'Completed' }
            ].map((course, index) => (
              <div key={index} className="p-3 bg-background rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-ui font-medium text-primary">{course.course}</p>
                    <p className="font-ui text-xs text-primary/60">Due: {course.due}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium ${
                    course.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="font-ui text-xs text-primary/70 mt-1">{course.progress}% complete</p>
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
            { name: 'View Schedule', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
            { name: 'Check Messages', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
            { name: 'Training Center', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
            { name: 'Performance', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' }
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