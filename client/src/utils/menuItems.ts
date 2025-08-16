import {
  LayoutDashboard,
  Users,
  Calendar,
  Phone,
  Clock,
  MessageSquare,
  FileText,
  Heart,
  User,
  Briefcase,
  ClipboardList,
  BookOpen,
  Mail,
  Settings,
  BarChart3,
  Cog,
  FileImage,
  Headphones,
  ShieldCheck,
  UserPlus,
  TrendingUp,
  Award
} from 'lucide-react';

export interface MenuItem {
  name: string;
  icon: any;
  badge?: string;
}

export interface MenuGroup {
  title?: string;
  items: MenuItem[];
}

export const getMenuItems = (role: string): MenuGroup[] => {
  switch (role) {
    case 'client':
      return [
        {
          items: [
            { name: 'Dashboard', icon: LayoutDashboard },
          ]
        },
        {
          title: 'Services',
          items: [
            { name: 'Service Requests', icon: ClipboardList, badge: '3' },
            { name: 'Video Calls', icon: Phone },
            { name: 'Hours Tracking', icon: Clock },
            { name: 'Feedback', icon: MessageSquare },
          ]
        },
        {
          title: 'Management',
          items: [
            { name: 'Contracts', icon: FileText },
            { name: 'Care Matching', icon: Heart },
            { name: 'Profile', icon: User },
          ]
        }
      ];

    case 'contractor':
      return [
        {
          items: [
            { name: 'Dashboard', icon: LayoutDashboard },
          ]
        },
        {
          title: 'Work',
          items: [
            { name: 'Job Board', icon: Briefcase, badge: '7' },
            { name: 'Shift Notes', icon: ClipboardList },
            { name: 'Applications', icon: FileText },
          ]
        },
        {
          title: 'Communication',
          items: [
            { name: 'Messages', icon: Mail, badge: '2' },
            { name: 'Training', icon: BookOpen },
          ]
        },
        {
          title: 'Account',
          items: [
            { name: 'Documents', icon: FileImage },
            { name: 'Profile', icon: User },
          ]
        }
      ];

    case 'admin':
      return [
        {
          items: [
            { name: 'Dashboard', icon: LayoutDashboard },
          ]
        },
        {
          title: 'Management',
          items: [
            { name: 'Users', icon: Users },
            { name: 'Analytics', icon: BarChart3 },
            { name: 'Automation', icon: Cog },
          ]
        },
        {
          title: 'Processing',
          items: [
            { name: 'OCR Processing', icon: FileImage },
            { name: 'Transcription', icon: Headphones },
            { name: 'Compliance', icon: ShieldCheck },
          ]
        }
      ];

    case 'employee':
      return [
        {
          items: [
            { name: 'Dashboard', icon: LayoutDashboard },
          ]
        },
        {
          title: 'Work',
          items: [
            { name: 'Staff Schedule', icon: Calendar },
            { name: 'Internal Comms', icon: Mail, badge: '5' },
            { name: 'Training Resources', icon: BookOpen },
          ]
        },
        {
          title: 'HR',
          items: [
            { name: 'HR Tools', icon: Settings },
            { name: 'Performance', icon: TrendingUp },
            { name: 'Benefits', icon: Award },
          ]
        }
      ];

    default:
      return [
        {
          items: [
            { name: 'Dashboard', icon: LayoutDashboard },
          ]
        }
      ];
  }
};