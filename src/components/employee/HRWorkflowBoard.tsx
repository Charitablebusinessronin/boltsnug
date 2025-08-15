import React, { useMemo, useState } from 'react';
import { Filter, Plus, Calendar, Users, Flag, CheckCircle2 } from 'lucide-react';

export type HrPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type HrStatus = 'Not Started' | 'In Progress' | 'Under Review' | 'Completed';
export type HrDept = 'HR' | 'IT' | 'Finance' | 'Operations' | 'Legal' | 'Management';
export type HrCategory = 'Employee Onboarding' | 'Performance Management' | 'Recruitment' | 'Training & Development' | 'Compliance' | 'Contractor Management' | 'Employee Relations';

interface HrTask {
  id: string;
  title: string;
  category: HrCategory;
  priority: HrPriority;
  status: HrStatus;
  department: HrDept;
  assignee: string;
  due_date?: string;
  progress: number; // 0-100
}

const statusColumns: HrStatus[] = ['Not Started', 'In Progress', 'Under Review', 'Completed'];

const priorityColor = (p: HrPriority) => {
  switch (p) {
    case 'Critical': return 'bg-red-100 text-red-700';
    case 'High': return 'bg-orange-100 text-orange-700';
    case 'Medium': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date';

export const HRWorkflowBoard: React.FC = () => {
  const [department, setDepartment] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [priority, setPriority] = useState<string>('');

  const tasks: HrTask[] = useMemo(() => ([
    { id: 't-1', title: 'Complete new-hire paperwork', category: 'Employee Onboarding', priority: 'High', status: 'In Progress', department: 'HR', assignee: 'You', due_date: '2025-08-20', progress: 60 },
    { id: 't-2', title: 'Provision laptop & accounts', category: 'Employee Onboarding', priority: 'Medium', status: 'Not Started', department: 'IT', assignee: 'IT Support', due_date: '2025-08-18', progress: 0 },
    { id: 't-3', title: 'Annual HIPAA policy attestation', category: 'Compliance', priority: 'Critical', status: 'Under Review', department: 'Legal', assignee: 'You', due_date: '2025-08-25', progress: 90 },
    { id: 't-4', title: 'Quarterly performance check-in', category: 'Performance Management', priority: 'Low', status: 'Completed', department: 'Management', assignee: 'Your Manager', due_date: '2025-08-01', progress: 100 },
    { id: 't-5', title: 'Enroll in Advanced Patient Communication training', category: 'Training & Development', priority: 'Medium', status: 'In Progress', department: 'HR', assignee: 'You', due_date: '2025-08-28', progress: 40 },
    { id: 't-6', title: 'Background check – contractor', category: 'Contractor Management', priority: 'High', status: 'Not Started', department: 'Operations', assignee: 'Ops Team', due_date: '2025-08-22', progress: 0 },
    { id: 't-7', title: 'Publish caregiver job listing', category: 'Recruitment', priority: 'Medium', status: 'Under Review', department: 'HR', assignee: 'Recruiter', due_date: '2025-08-19', progress: 80 },
    { id: 't-8', title: 'Mediation prep – schedule session', category: 'Employee Relations', priority: 'High', status: 'In Progress', department: 'HR', assignee: 'HR Partner', due_date: '2025-08-21', progress: 35 },
  ]), []);

  const filtered = tasks.filter(t =>
    (department === '' || t.department === department) &&
    (category === '' || t.category === category) &&
    (priority === '' || t.priority === priority)
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/40 font-body text-sm">
          <option value="">All Departments</option>
          {(['HR','IT','Finance','Operations','Legal','Management'] as HrDept[]).map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/40 font-body text-sm">
          <option value="">All Categories</option>
          {(['Employee Onboarding','Performance Management','Recruitment','Training & Development','Compliance','Contractor Management','Employee Relations'] as HrCategory[]).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/40 font-body text-sm">
          <option value="">All Priorities</option>
          {(['Low','Medium','High','Critical'] as HrPriority[]).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 justify-end">
          <button className="healthcare-button-secondary text-sm"><Filter className="h-4 w-4 mr-2" />Filters</button>
          <button className="healthcare-button-primary text-sm"><Plus className="h-4 w-4 mr-2" />New Task</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusColumns.map((col) => (
          <div key={col} className="bg-background rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-ui font-semibold text-primary text-sm">{col}</h4>
              <span className="text-xs bg-accent/20 text-primary px-2 py-1 rounded-full font-ui">{filtered.filter(t => t.status === col).length}</span>
            </div>
            <div className="space-y-3">
              {filtered.filter(t => t.status === col).map(task => (
                <div key={task.id} className="p-3 rounded-lg border border-accent/20 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <p className="font-ui font-medium text-primary text-sm">{task.title}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-ui ${priorityColor(task.priority)}`}>
                          <Flag className="h-3 w-3 mr-1" />{task.priority}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-ui bg-luxury/10 text-luxury">
                          {task.category}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-ui bg-accent/20 text-primary">
                          <Users className="h-3 w-3 mr-1" />{task.assignee}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center text-xs text-primary/60"><Calendar className="h-3 w-3 mr-1" /> {formatDate(task.due_date)}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-ui text-xs text-primary/60">Progress</span>
                      <span className="font-ui text-xs text-primary/70">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-accent/20 rounded-full h-2">
                      <div className={`h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' : 'bg-luxury'}`} style={{ width: `${task.progress}%` }}></div>
                    </div>
                  </div>
                  {task.status === 'Completed' && (
                    <div className="mt-2 text-green-600 text-xs inline-flex items-center"><CheckCircle2 className="h-4 w-4 mr-1" /> Completed</div>
                  )}
                </div>
              ))}
              {filtered.filter(t => t.status === col).length === 0 && (
                <div className="p-3 rounded-lg bg-white border border-dashed border-accent/30 text-center text-xs text-primary/50">No tasks</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
