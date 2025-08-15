import React, { useState } from 'react';
import { Heart, ChevronRight, ChevronDown } from 'lucide-react';
import { User } from '../types/auth';
import { getMenuItems } from '../utils/menuItems';

interface SidebarProps {
  user: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['main']);
  
  const menuItems = getMenuItems(user.role);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-accent/20 shadow-lg z-50">
      {/* Logo */}
      <div className="p-6 border-b border-accent/20">
        <div className="flex items-center space-x-3">
          <div className="bg-luxury p-2 rounded-lg">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-primary text-lg">SNUGS & KISSES</h2>
            <p className="font-ui text-primary/60 text-xs">Care Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        {menuItems.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            {group.title && (
              <button
                onClick={() => toggleGroup(group.title)}
                className="flex items-center justify-between w-full text-left font-ui font-semibold text-primary/70 text-sm uppercase tracking-wider mb-3 hover:text-primary transition-colors"
              >
                {group.title}
                {expandedGroups.includes(group.title) ? 
                  <ChevronDown className="h-4 w-4" /> : 
                  <ChevronRight className="h-4 w-4" />
                }
              </button>
            )}
            
            {(!group.title || expandedGroups.includes(group.title)) && (
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => setActiveItem(item.name)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg font-ui text-sm transition-all duration-200 ${
                      activeItem === item.name
                        ? 'bg-luxury text-primary font-semibold shadow-sm'
                        : 'text-primary/70 hover:text-primary hover:bg-accent/10'
                    }`}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-luxury text-primary text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-accent/20">
        <div className="bg-gradient-to-r from-accent/10 to-luxury/10 p-3 rounded-lg">
          <p className="font-ui text-xs text-primary/70 text-center">
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  );
};