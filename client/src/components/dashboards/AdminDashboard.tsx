import React, { useState } from 'react';
import { Users, BarChart3, Settings, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Shield, FileSearch, UserCheck, Database, Workflow } from 'lucide-react';
import { UserManagement } from '../admin/UserManagement';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'analytics' | 'compliance' | 'ocr' | 'automation'>('overview');
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold mb-2">Healthcare Admin Center</h2>
            <p className="font-body text-white/90">Manage care operations, compliance, and platform performance</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Settings className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="healthcare-card p-6">
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

        <div className="healthcare-card p-6">
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

        <div className="healthcare-card p-6">
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

        <div className="healthcare-card p-6">
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

      {/* Admin Workbench Tabs */}
      <div className="healthcare-card p-2">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTab('overview')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'overview' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>Overview</button>
          <button onClick={() => setActiveTab('users')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'users' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>Users</button>
          <button onClick={() => setActiveTab('analytics')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'analytics' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>Analytics</button>
          <button onClick={() => setActiveTab('compliance')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'compliance' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>Compliance</button>
          <button onClick={() => setActiveTab('ocr')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'ocr' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>OCR</button>
          <button onClick={() => setActiveTab('automation')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'automation' ? 'bg-luxury text-white' : 'bg-background hover:bg-accent/10'}`}>Automation</button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* System Overview & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Alerts */}
            <div className="healthcare-card p-6">
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
            <div className="healthcare-card p-6">
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
          <div className="healthcare-card p-6">
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
          <div className="healthcare-card p-6">
            <h3 className="healthcare-heading text-lg font-semibold mb-4">Healthcare Admin Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'User Management', icon: Users, color: 'bg-blue-100 text-blue-600', tab: 'users' },
                { name: 'Compliance Audit', icon: Shield, color: 'bg-green-100 text-green-600', tab: 'compliance' },
                { name: 'OCR Processing', icon: FileSearch, color: 'bg-purple-100 text-purple-600', tab: 'ocr' },
                { name: 'Analytics Reports', icon: BarChart3, color: 'bg-orange-100 text-orange-600', tab: 'analytics' }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(action.tab as any)}
                  className="p-4 rounded-lg border border-accent/20 hover:shadow-md transition-all duration-200 text-center group"
                >
                  <div className={`${action.color} p-3 rounded-lg mx-auto w-fit mb-2 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <p className="healthcare-ui-text font-medium text-sm">{action.name}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-luxury" />
            Healthcare User Management
          </h3>
          <UserManagement />
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-luxury" />
            HIPAA Compliance Monitor
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="healthcare-ui-text font-medium text-green-800">Overall Compliance</p>
                <span className="healthcare-status-success">98.5%</span>
              </div>
              <p className="healthcare-text-secondary text-sm">All critical requirements met</p>
            </div>
            <div className="space-y-2">
              {[
                { check: 'Data Encryption', status: 'Compliant', lastCheck: '2 hours ago', level: 'success' },
                { check: 'Access Logging', status: 'Compliant', lastCheck: '15 min ago', level: 'success' },
                { check: 'Backup Security', status: 'Warning', lastCheck: '1 day ago', level: 'warning' },
                { check: 'Audit Trail', status: 'Compliant', lastCheck: '30 min ago', level: 'success' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                  <div>
                    <p className="healthcare-ui-text text-sm font-medium">{item.check}</p>
                    <p className="healthcare-text-secondary text-xs">Last check: {item.lastCheck}</p>
                  </div>
                  <span className={`healthcare-status-${item.level}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="healthcare-button-secondary w-full text-sm">
              Run Full Compliance Audit
            </button>
          </div>
        </div>
      )}

      {activeTab === 'ocr' && (
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <FileSearch className="h-5 w-5 mr-2 text-luxury" />
            OCR Document Processing
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="healthcare-text-primary">Documents Processed Today</span>
              <span className="healthcare-heading text-2xl font-bold">127</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="healthcare-text-secondary">Processing Queue</span>
                <span className="healthcare-ui-text font-medium">23 pending</span>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div className="bg-luxury h-2 rounded-full" style={{width: '76%'}}></div>
              </div>
            </div>
            {[
              { type: 'Medical Records', processed: 45, pending: 8, accuracy: '99.2%' },
              { type: 'Insurance Forms', processed: 32, pending: 12, accuracy: '97.8%' },
              { type: 'Provider Licenses', processed: 28, pending: 3, accuracy: '99.7%' },
              { type: 'Care Plans', processed: 22, pending: 0, accuracy: '98.9%' }
            ].map((doc, index) => (
              <div key={index} className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="healthcare-ui-text font-medium text-sm">{doc.type}</p>
                  <span className="healthcare-text-secondary text-xs">Accuracy: {doc.accuracy}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="healthcare-text-secondary">Processed: {doc.processed}</span>
                  <span className="healthcare-text-secondary">Pending: {doc.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Workflow className="h-5 w-5 mr-2 text-luxury" />
            Healthcare Automation
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="healthcare-ui-text font-medium text-purple-800">Active Workflows</p>
                <span className="healthcare-status-info">12 Running</span>
              </div>
              <p className="healthcare-text-secondary text-sm">All automation systems operational</p>
            </div>
            {[
              { workflow: 'Client Onboarding', status: 'Active', processed: '24 today', efficiency: '94%' },
              { workflow: 'Provider Matching', status: 'Active', processed: '18 today', efficiency: '87%' },
              { workflow: 'Appointment Reminders', status: 'Active', processed: '156 today', efficiency: '99%' },
              { workflow: 'Billing Automation', status: 'Active', processed: '67 today', efficiency: '96%' }
            ].map((auto, index) => (
              <div key={index} className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="healthcare-ui-text font-medium text-sm">{auto.workflow}</p>
                  <span className="healthcare-status-success text-xs">{auto.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="healthcare-text-secondary">{auto.processed}</span>
                  <span className="healthcare-text-secondary">Efficiency: {auto.efficiency}</span>
                </div>
              </div>
            ))}
            <button className="healthcare-button-secondary w-full text-sm">
              Configure Workflows
            </button>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2 text-luxury" />
            Healthcare Analytics Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="bg-blue-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="healthcare-heading font-semibold mb-2">Care Utilization</h4>
              <p className="healthcare-ui-text text-2xl font-bold text-blue-600 mb-1">2,847 hrs</p>
              <p className="healthcare-text-secondary text-sm">This month</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="bg-green-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="healthcare-heading font-semibold mb-2">Client Outcomes</h4>
              <p className="healthcare-ui-text text-2xl font-bold text-green-600 mb-1">96%</p>
              <p className="healthcare-text-secondary text-sm">Positive outcomes</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
              <div className="bg-yellow-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h4 className="healthcare-heading font-semibold mb-2">Quality Score</h4>
              <p className="healthcare-ui-text text-2xl font-bold text-yellow-600 mb-1">4.9/5</p>
              <p className="healthcare-text-secondary text-sm">Average care rating</p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Overview */}
      <div className="healthcare-card p-6">
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

      {/* Healthcare User Management & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-luxury" />
            Healthcare User Management
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="healthcare-ui-text text-sm text-blue-800">Active Clients</p>
                <p className="healthcare-heading text-xl font-bold text-blue-600">1,247</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="healthcare-ui-text text-sm text-green-800">Healthcare Providers</p>
                <p className="healthcare-heading text-xl font-bold text-green-600">89</p>
              </div>
            </div>
            
            {[
              { type: 'Client Registration', count: 12, status: 'Pending Review', priority: 'medium' },
              { type: 'Provider Applications', count: 3, status: 'Background Check', priority: 'high' },
              { type: 'License Renewals', count: 7, status: 'Due This Month', priority: 'high' },
              { type: 'Account Suspensions', count: 2, status: 'Under Investigation', priority: 'medium' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div>
                  <p className="healthcare-ui-text font-medium text-sm">{item.type}</p>
                  <p className="healthcare-text-secondary text-xs">{item.status}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="healthcare-ui-text font-bold text-primary">{item.count}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.priority === 'high' ? 'healthcare-status-error' : 'healthcare-status-warning'
                  }`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
            <button className="healthcare-button-primary w-full text-sm">
              Manage All Users
            </button>
          </div>
        </div>

        {/* HIPAA Compliance Monitoring */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-luxury" />
            HIPAA Compliance Monitor
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="healthcare-ui-text font-medium text-green-800">Overall Compliance</p>
                <span className="healthcare-status-success">98.5%</span>
              </div>
              <p className="healthcare-text-secondary text-sm">All critical requirements met</p>
            </div>
            
            <div className="space-y-2">
              {[
                { check: 'Data Encryption', status: 'Compliant', lastCheck: '2 hours ago', level: 'success' },
                { check: 'Access Logging', status: 'Compliant', lastCheck: '15 min ago', level: 'success' },
                { check: 'Backup Security', status: 'Warning', lastCheck: '1 day ago', level: 'warning' },
                { check: 'Audit Trail', status: 'Compliant', lastCheck: '30 min ago', level: 'success' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                  <div>
                    <p className="healthcare-ui-text text-sm font-medium">{item.check}</p>
                    <p className="healthcare-text-secondary text-xs">Last check: {item.lastCheck}</p>
                  </div>
                  <span className={`healthcare-status-${item.level}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="healthcare-button-secondary w-full text-sm">
              Run Full Compliance Audit
            </button>
          </div>
        </div>
      </div>

      {/* OCR Processing & Automation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OCR Document Processing */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <FileSearch className="h-5 w-5 mr-2 text-luxury" />
            OCR Document Processing
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="healthcare-text-primary">Documents Processed Today</span>
              <span className="healthcare-heading text-2xl font-bold">127</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="healthcare-text-secondary">Processing Queue</span>
                <span className="healthcare-ui-text font-medium">23 pending</span>
              </div>
              <div className="w-full bg-accent/20 rounded-full h-2">
                <div className="bg-luxury h-2 rounded-full" style={{width: '76%'}}></div>
              </div>
            </div>
            
            {[
              { type: 'Medical Records', processed: 45, pending: 8, accuracy: '99.2%' },
              { type: 'Insurance Forms', processed: 32, pending: 12, accuracy: '97.8%' },
              { type: 'Provider Licenses', processed: 28, pending: 3, accuracy: '99.7%' },
              { type: 'Care Plans', processed: 22, pending: 0, accuracy: '98.9%' }
            ].map((doc, index) => (
              <div key={index} className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="healthcare-ui-text font-medium text-sm">{doc.type}</p>
                  <span className="healthcare-text-secondary text-xs">Accuracy: {doc.accuracy}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="healthcare-text-secondary">Processed: {doc.processed}</span>
                  <span className="healthcare-text-secondary">Pending: {doc.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Automation */}
        <div className="healthcare-card p-6">
          <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
            <Workflow className="h-5 w-5 mr-2 text-luxury" />
            Healthcare Automation
          </h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="healthcare-ui-text font-medium text-purple-800">Active Workflows</p>
                <span className="healthcare-status-info">12 Running</span>
              </div>
              <p className="healthcare-text-secondary text-sm">All automation systems operational</p>
            </div>
            
            {[
              { workflow: 'Client Onboarding', status: 'Active', processed: '24 today', efficiency: '94%' },
              { workflow: 'Provider Matching', status: 'Active', processed: '18 today', efficiency: '87%' },
              { workflow: 'Appointment Reminders', status: 'Active', processed: '156 today', efficiency: '99%' },
              { workflow: 'Billing Automation', status: 'Active', processed: '67 today', efficiency: '96%' }
            ].map((auto, index) => (
              <div key={index} className="p-3 bg-background rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="healthcare-ui-text font-medium text-sm">{auto.workflow}</p>
                  <span className="healthcare-status-success text-xs">{auto.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="healthcare-text-secondary">{auto.processed}</span>
                  <span className="healthcare-text-secondary">Efficiency: {auto.efficiency}</span>
                </div>
              </div>
            ))}
            <button className="healthcare-button-secondary w-full text-sm">
              Configure Workflows
            </button>
          </div>
        </div>
      </div>

      {/* Healthcare Analytics Dashboard */}
      <div className="healthcare-card p-6">
        <h3 className="healthcare-heading text-lg font-semibold mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-luxury" />
          Healthcare Analytics Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="bg-blue-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="healthcare-heading font-semibold mb-2">Care Utilization</h4>
            <p className="healthcare-ui-text text-2xl font-bold text-blue-600 mb-1">2,847 hrs</p>
            <p className="healthcare-text-secondary text-sm">This month</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="bg-green-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h4 className="healthcare-heading font-semibold mb-2">Client Outcomes</h4>
            <p className="healthcare-ui-text text-2xl font-bold text-green-600 mb-1">96%</p>
            <p className="healthcare-text-secondary text-sm">Positive outcomes</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
            <div className="bg-yellow-600 text-white p-3 rounded-full mx-auto w-fit mb-3">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h4 className="healthcare-heading font-semibold mb-2">Quality Score</h4>
            <p className="healthcare-ui-text text-2xl font-bold text-yellow-600 mb-1">4.9/5</p>
            <p className="healthcare-text-secondary text-sm">Average care rating</p>
          </div>
        </div>
      </div>

      {/* Quick Management Actions */}
      <div className="healthcare-card p-6">
        <h3 className="healthcare-heading text-lg font-semibold mb-4">Healthcare Admin Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'User Management', icon: Users, color: 'bg-blue-100 text-blue-600' },
            { name: 'Compliance Audit', icon: Shield, color: 'bg-green-100 text-green-600' },
            { name: 'OCR Processing', icon: FileSearch, color: 'bg-purple-100 text-purple-600' },
            { name: 'Analytics Reports', icon: BarChart3, color: 'bg-orange-100 text-orange-600' }
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