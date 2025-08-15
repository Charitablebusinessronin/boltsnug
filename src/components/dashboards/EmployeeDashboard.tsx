import React from 'react';
import { Calendar, Users, BookOpen, TrendingUp, Bell, Clock, Award, MessageSquare, ClipboardList, UserPlus, Heart } from 'lucide-react';
import { HRWorkflowBoard } from '../employee/HRWorkflowBoard';

export const EmployeeDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Healthcare Staff Hub</h2>
            <p className="font-body text-white/90">Supporting our healthcare mission with excellence</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="healthcare-card p-6">
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

        <div className="healthcare-card p-6">
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

        <div className="healthcare-card p-6">
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

        <div className="healthcare-card p-6">
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
        <div className="healthcare-card p-6">
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
        <div className="healthcare-card p-6">
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
        <div className="healthcare-card p-6">
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
        <div className="healthcare-card p-6">
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

      {/* Healthcare HR Tools & Staff Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Scheduling */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <ClipboardList className="h-5 w-5 mr-2 text-luxury" />
            Staff Scheduling & Coverage
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="healthcare-ui-text font-medium text-blue-800">This Week's Schedule</p>
                <span className="healthcare-status-success">Confirmed</span>
              </div>
              <p className="healthcare-text-secondary text-sm">40 hours scheduled • 2 flexible shifts available</p>
            </div>
            
            {[
              { shift: 'Monday 9AM-5PM', coverage: 'Admin Support', status: 'Confirmed', type: 'primary' },
              { shift: 'Wednesday 1PM-9PM', coverage: 'Client Care Coordination', status: 'Requested', type: 'warning' },
              { shift: 'Friday 8AM-4PM', coverage: 'Training & Development', status: 'Confirmed', type: 'primary' },
              { shift: 'Saturday 10AM-2PM', coverage: 'Weekend Support (Optional)', status: 'Available', type: 'info' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="healthcare-ui-text font-medium text-sm">{item.shift}</p>
                  <p className="healthcare-text-secondary text-xs">{item.coverage}</p>
                </div>
                <span className={`healthcare-status-${item.type === 'primary' ? 'success' : item.type === 'warning' ? 'warning' : 'info'}`}>
                  {item.status}
                </span>
              </div>
            ))}
            <button className="healthcare-button-secondary w-full text-sm">
              Request Schedule Changes
            </button>
          </div>
        </div>

        {/* Internal Communications */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-luxury" />
            Internal Communications
          </h3>
          <div className="space-y-3">
            {[
              { 
                title: 'New Healthcare Guidelines', 
                from: 'Admin Team', 
                time: '2 hours ago', 
                priority: 'high',
                preview: 'Updated patient care protocols effective immediately...'
              },
              { 
                title: 'Staff Appreciation Event', 
                from: 'HR Department', 
                time: '1 day ago', 
                priority: 'medium',
                preview: 'Join us for a celebration of our healthcare heroes...'
              },
              { 
                title: 'Training Schedule Update', 
                from: 'Training Coordinator', 
                time: '2 days ago', 
                priority: 'medium',
                preview: 'HIPAA compliance training has been rescheduled...'
              },
              { 
                title: 'System Maintenance Notice', 
                from: 'IT Department', 
                time: '3 days ago', 
                priority: 'low',
                preview: 'Scheduled maintenance window this weekend...'
              }
            ].map((comm, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                comm.priority === 'high' ? 'bg-red-50 border-red-400' :
                comm.priority === 'medium' ? 'bg-orange-50 border-orange-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start justify-between mb-1">
                  <p className="healthcare-ui-text font-medium text-sm">{comm.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    comm.priority === 'high' ? 'healthcare-status-error' :
                    comm.priority === 'medium' ? 'healthcare-status-warning' :
                    'healthcare-status-info'
                  }`}>
                    {comm.priority}
                  </span>
                </div>
                <p className="healthcare-text-secondary text-xs mb-1">{comm.preview}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="healthcare-text-secondary">{comm.from}</span>
                  <span className="healthcare-text-secondary">{comm.time}</span>
                </div>
              </div>
            ))}
            <button className="healthcare-button-secondary w-full text-sm">
              View All Communications
            </button>
          </div>
        </div>
      </div>

      {/* HR Tools & Employee Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HR Self-Service */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-luxury" />
            HR Self-Service Tools
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="healthcare-ui-text text-sm text-green-800">PTO Balance</p>
                <p className="healthcare-heading text-lg font-bold text-green-600">12.5 days</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="healthcare-ui-text text-sm text-blue-800">Sick Leave</p>
                <p className="healthcare-heading text-lg font-bold text-blue-600">8 days</p>
              </div>
            </div>
            
            {[
              { tool: 'Request Time Off', icon: Calendar, description: 'Submit PTO or sick leave requests' },
              { tool: 'Update Emergency Contacts', icon: Users, description: 'Manage your emergency contact information' },
              { tool: 'Benefits Enrollment', icon: Heart, description: 'View and manage your healthcare benefits' },
              { tool: 'Performance Reviews', icon: Award, description: 'Access your performance evaluations' }
            ].map((tool, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg hover:bg-accent/10 transition-colors cursor-pointer">
                <div className="bg-luxury/20 p-2 rounded-lg">
                  <tool.icon className="h-4 w-4 text-luxury" />
                </div>
                <div className="flex-1">
                  <p className="healthcare-ui-text font-medium text-sm">{tool.tool}</p>
                  <p className="healthcare-text-secondary text-xs">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Healthcare Employee Wellness */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-luxury" />
            Employee Wellness Program
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="healthcare-ui-text font-medium text-green-800">Wellness Score</p>
                <span className="healthcare-status-success">Excellent</span>
              </div>
              <p className="healthcare-text-secondary text-sm">You're doing great! Keep up the healthy habits.</p>
            </div>
            
            {[
              { activity: 'Mental Health Check-in', status: 'Due This Week', completion: 'pending', priority: 'medium' },
              { activity: 'Annual Health Screening', status: 'Completed', completion: 'done', priority: 'low' },
              { activity: 'Stress Management Workshop', status: 'Available', completion: 'available', priority: 'medium' },
              { activity: 'Healthcare Worker Support Group', status: 'Next Session: Friday', completion: 'scheduled', priority: 'low' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="healthcare-ui-text font-medium text-sm">{item.activity}</p>
                  <p className="healthcare-text-secondary text-xs">{item.status}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.completion === 'done' ? 'healthcare-status-success' :
                  item.completion === 'pending' ? 'healthcare-status-warning' :
                  item.completion === 'scheduled' ? 'healthcare-status-info' :
                  'healthcare-status-info'
                }`}>
                  {item.completion === 'done' ? 'Complete' :
                   item.completion === 'pending' ? 'Action Needed' :
                   item.completion === 'scheduled' ? 'Scheduled' : 'Available'}
                </span>
              </div>
            ))}
            <button className="healthcare-button-secondary w-full text-sm">
              Access Wellness Resources
            </button>
          </div>
        </div>
      </div>

      {/* HR Workflow Board */}
      <div className="healthcare-card p-6">
        <h3 className="healthcare-heading text-lg font-semibold mb-4">HR Workflow Board</h3>
        <HRWorkflowBoard />
      </div>

      {/* Quick Actions */}
      <div className="healthcare-card p-6">
        <h3 className="healthcare-heading text-lg font-semibold mb-4">Healthcare Staff Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Staff Schedule', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
            { name: 'HR Self-Service', icon: UserPlus, color: 'bg-green-100 text-green-600' },
            { name: 'Training Portal', icon: BookOpen, color: 'bg-purple-100 text-purple-600' },
            { name: 'Wellness Center', icon: Heart, color: 'bg-red-100 text-red-600' }
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