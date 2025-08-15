import React from 'react';
import { Users, BarChart3, Settings, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Admin Control Center</h2>
            <p className="font-body text-white/90">Manage operations, users, and system performance</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Settings className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Total Users</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">2,847</p>
              <p className="font-ui text-green-600 text-xs mt-1">+12% this month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Active Sessions</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">1,284</p>
              <p className="font-ui text-blue-600 text-xs mt-1">Real-time</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">Revenue</p>
              <p className="font-heading text-2xl font-bold text-primary mt-1">$48.2K</p>
              <p className="font-ui text-green-600 text-xs mt-1">+8.5% vs last month</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-ui text-primary/60 text-sm">System Health</p>
              <p className="font-heading text-2xl font-bold text-green-600 mt-1">99.8%</p>
              <p className="font-ui text-green-600 text-xs mt-1">All systems operational</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* System Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-luxury" />
            System Alerts
          </h3>
          <div className="space-y-3">
            {[
              { type: 'Warning', message: 'High CPU usage on Server 2', time: '5 min ago', severity: 'medium' },
              { type: 'Info', message: 'Database backup completed successfully', time: '1 hour ago', severity: 'low' },
              { type: 'Critical', message: 'Failed login attempts from suspicious IP', time: '2 hours ago', severity: 'high' }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                <div className={`p-1 rounded-full ${
                  alert.severity === 'high' ? 'bg-red-100' : 
                  alert.severity === 'medium' ? 'bg-orange-100' : 'bg-blue-100'
                }`}>
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.severity === 'high' ? 'text-red-600' : 
                    alert.severity === 'medium' ? 'text-orange-600' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-ui font-medium text-primary">{alert.message}</p>
                  <p className="font-ui text-sm text-primary/60 flex items-center">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mr-2 ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' : 
                      alert.severity === 'medium' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.type}
                    </span>
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
          <h3 className="font-heading text-lg font-semibold text-primary mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-luxury" />
            Recent User Activity
          </h3>
          <div className="space-y-3">
            {[
              { user: 'Sarah Martinez', action: 'Completed client assessment', role: 'Contractor', time: '10 min ago' },
              { user: 'John Davis', action: 'Updated profile information', role: 'Employee', time: '25 min ago' },
              { user: 'Margaret Thompson', action: 'Submitted service request', role: 'Client', time: '45 min ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-luxury to-luxury-light flex items-center justify-center">
                  <span className="font-ui font-semibold text-primary text-sm">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-ui font-medium text-primary">{activity.user}</p>
                  <p className="font-ui text-sm text-primary/60">{activity.action}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-ui font-medium bg-accent/20 text-primary">
                    {activity.role}
                  </span>
                  <p className="font-ui text-xs text-primary/50 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
        <h3 className="font-heading text-lg font-semibold text-primary mb-6 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-luxury" />
          Platform Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="bg-blue-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="font-heading font-semibold text-primary mb-2">User Growth</h4>
            <p className="font-ui text-2xl font-bold text-blue-600 mb-1">+24%</p>
            <p className="font-ui text-sm text-primary/60">New registrations</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="bg-green-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h4 className="font-heading font-semibold text-primary mb-2">Engagement</h4>
            <p className="font-ui text-2xl font-bold text-green-600 mb-1">89%</p>
            <p className="font-ui text-sm text-primary/60">Active daily users</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <div className="bg-yellow-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="font-heading font-semibold text-primary mb-2">Satisfaction</h4>
            <p className="font-ui text-2xl font-bold text-yellow-600 mb-1">4.8/5</p>
            <p className="font-ui text-sm text-primary/60">Average rating</p>
          </div>
        </div>
      </div>

      {/* Quick Management Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-accent/20">
        <h3 className="font-heading text-lg font-semibold text-primary mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Manage Users', icon: Users, color: 'bg-blue-100 text-blue-600' },
            { name: 'View Analytics', icon: BarChart3, color: 'bg-green-100 text-green-600' },
            { name: 'System Settings', icon: Settings, color: 'bg-purple-100 text-purple-600' },
            { name: 'Generate Reports', icon: Clock, color: 'bg-orange-100 text-orange-600' }
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