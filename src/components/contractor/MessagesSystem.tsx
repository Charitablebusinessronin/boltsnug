import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, Filter, Paperclip, MoreHorizontal, Archive, Star, Clock, Eye, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface Message {
  id: string;
  conversation_id: string;
  from: {
    id: string;
    name: string;
    role: 'Client' | 'Admin' | 'Care Coordinator' | 'HR' | 'System';
    avatar?: string;
  };
  to: {
    id: string;
    name: string;
    role: string;
  };
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  message_type: 'Direct Message' | 'Group Message' | 'System Notification' | 'Job Alert' | 'Training Update' | 'Care Assignment';
  attachments?: {
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  tags?: string[];
  starred: boolean;
  archived: boolean;
  reply_to?: string;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    online?: boolean;
  }[];
  subject: string;
  last_message: {
    content: string;
    timestamp: string;
    from_name: string;
  };
  unread_count: number;
  messages: Message[];
  tags?: string[];
}

interface MessagesSystemProps {
  onSendMessage?: (message: Partial<Message>) => void;
}

export const MessagesSystem: React.FC<MessagesSystemProps> = ({
  onSendMessage
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [composing, setComposing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
    priority: 'Medium' as Message['priority']
  });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      // Mock data - in real app, this would come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          conversation_id: 'conv-1',
          from: {
            id: 'client-1',
            name: 'Sarah Johnson',
            role: 'Client',
            avatar: '/avatars/sarah-johnson.jpg'
          },
          to: {
            id: user?.id || 'contractor-1',
            name: user?.name || 'John Contractor',
            role: 'Contractor'
          },
          subject: 'Thank you for yesterday\'s care',
          content: 'Hi John, I wanted to thank you for the excellent care you provided yesterday. Your professionalism and compassion really made a difference during my recovery. Looking forward to our next session!',
          timestamp: '2025-08-15T14:30:00Z',
          read: false,
          priority: 'Low',
          message_type: 'Direct Message',
          starred: false,
          archived: false
        },
        {
          id: 'msg-2',
          conversation_id: 'conv-2',
          from: {
            id: 'admin-1',
            name: 'Care Coordination Team',
            role: 'Admin',
          },
          to: {
            id: user?.id || 'contractor-1',
            name: user?.name || 'John Contractor',
            role: 'Contractor'
          },
          subject: 'New Care Assignment Available',
          content: 'A new care assignment matching your qualifications has become available. The client is located 3.2 miles from your area and requires postpartum care support. Please review the details and confirm your availability by end of day.',
          timestamp: '2025-08-15T10:15:00Z',
          read: false,
          priority: 'High',
          message_type: 'Care Assignment',
          tags: ['Assignment', 'Urgent'],
          starred: true,
          archived: false
        },
        {
          id: 'msg-3',
          conversation_id: 'conv-3',
          from: {
            id: 'hr-1',
            name: 'HR Department',
            role: 'HR'
          },
          to: {
            id: user?.id || 'contractor-1',
            name: user?.name || 'John Contractor',
            role: 'Contractor'
          },
          subject: 'Monthly Performance Review Scheduled',
          content: 'Your monthly performance review has been scheduled for August 20th at 2:00 PM. Please prepare your client feedback summaries and completed hours documentation. The meeting will be conducted via video call.',
          timestamp: '2025-08-14T16:45:00Z',
          read: true,
          priority: 'Medium',
          message_type: 'System Notification',
          attachments: [{
            name: 'performance-review-template.pdf',
            size: 256000,
            type: 'application/pdf',
            url: '/documents/performance-review-template.pdf'
          }],
          starred: false,
          archived: false
        },
        {
          id: 'msg-4',
          conversation_id: 'conv-4',
          from: {
            id: 'system',
            name: 'Training Portal',
            role: 'System'
          },
          to: {
            id: user?.id || 'contractor-1',
            name: user?.name || 'John Contractor',
            role: 'Contractor'
          },
          subject: 'Training Module Completion Reminder',
          content: 'Reminder: Your "Advanced Postpartum Care Techniques" course is 65% complete. Please finish the remaining modules by August 25th to earn your 6 CEU credits.',
          timestamp: '2025-08-14T09:30:00Z',
          read: true,
          priority: 'Low',
          message_type: 'Training Update',
          starred: false,
          archived: false
        }
      ];

      // Group messages into conversations
      const conversationMap = new Map<string, Conversation>();
      
      mockMessages.forEach(message => {
        if (!conversationMap.has(message.conversation_id)) {
          const otherParticipant = message.from.id === user?.id ? message.to : message.from;
          conversationMap.set(message.conversation_id, {
            id: message.conversation_id,
            participants: [
              {
                id: user?.id || 'contractor-1',
                name: user?.name || 'John Contractor',
                role: 'Contractor'
              },
              {
                id: otherParticipant.id,
                name: otherParticipant.name,
                role: otherParticipant.role,
                avatar: otherParticipant.avatar,
                online: Math.random() > 0.5 // Mock online status
              }
            ],
            subject: message.subject,
            last_message: {
              content: message.content,
              timestamp: message.timestamp,
              from_name: message.from.name
            },
            unread_count: message.read ? 0 : 1,
            messages: [message]
          });
        } else {
          const conversation = conversationMap.get(message.conversation_id)!;
          conversation.messages.push(message);
          if (!message.read) {
            conversation.unread_count++;
          }
          // Update last message if this message is newer
          if (new Date(message.timestamp) > new Date(conversation.last_message.timestamp)) {
            conversation.last_message = {
              content: message.content,
              timestamp: message.timestamp,
              from_name: message.from.name
            };
          }
        }
      });

      const mockConversations = Array.from(conversationMap.values()).sort(
        (a, b) => new Date(b.last_message.timestamp).getTime() - new Date(a.last_message.timestamp).getTime()
      );

      setConversations(mockConversations);
      setError(null);
    } catch {
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.content.trim() || !newMessage.to) {
      return;
    }

    try {
      const message: Partial<Message> = {
        from: {
          id: user?.id || 'contractor-1',
          name: user?.name || 'John Contractor',
          role: 'Contractor'
        },
        subject: newMessage.subject || 'New Message',
        content: newMessage.content,
        priority: newMessage.priority,
        timestamp: new Date().toISOString(),
        read: false,
        message_type: 'Direct Message'
      };

      if (onSendMessage) {
        onSendMessage(message);
      }

      // Reset form
      setNewMessage({
        to: '',
        subject: '',
        content: '',
        priority: 'Medium'
      });
      setComposing(false);

      alert('Message sent successfully!');
    } catch {
      alert('Failed to send message. Please try again.');
    }
  };

  const toggleStarred = (messageId: string) => {
    setConversations(prev =>
      prev.map(conv => ({
        ...conv,
        messages: conv.messages.map(msg =>
          msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
        )
      }))
    );
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              unread_count: 0,
              messages: conv.messages.map(msg => ({ ...msg, read: true }))
            }
          : conv
      )
    );
  };

  const getPriorityColor = (priority: Message['priority']) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-blue-600';
      case 'Low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getMessageTypeIcon = (type: Message['message_type']) => {
    switch (type) {
      case 'Care Assignment': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'Training Update': return <Eye className="h-4 w-4 text-blue-600" />;
      case 'System Notification': return <Clock className="h-4 w-4 text-purple-600" />;
      default: return <MessageCircle className="h-4 w-4 text-primary" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFilteredConversations = () => {
    let filtered = conversations;

    if (messageFilter === 'unread') {
      filtered = filtered.filter(conv => conv.unread_count > 0);
    } else if (messageFilter === 'starred') {
      filtered = filtered.filter(conv => conv.messages.some(msg => msg.starred));
    } else if (messageFilter === 'archived') {
      filtered = filtered.filter(conv => conv.messages.some(msg => msg.archived));
    }

    if (searchTerm) {
      filtered = filtered.filter(conv =>
        conv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        conv.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  if (isLoading) {
    return (
      <div className="healthcare-card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-accent/20 rounded mb-4 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-accent/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="healthcare-card p-6">
        <div className="flex items-center space-x-3 text-red-600 mb-4">
          <MessageCircle className="h-5 w-5" />
          <span className="font-body">{error}</span>
        </div>
        <button
          onClick={loadMessages}
          className="healthcare-button-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="healthcare-heading text-lg font-semibold flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-luxury" />
          Messages ({conversations.reduce((sum, conv) => sum + conv.unread_count, 0)})
        </h3>
        <button
          onClick={() => setComposing(true)}
          className="healthcare-button-primary flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Compose</span>
        </button>
      </div>

      {/* Message Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages', value: conversations.reduce((sum, conv) => sum + conv.messages.length, 0), color: 'text-primary' },
          { label: 'Unread', value: conversations.reduce((sum, conv) => sum + conv.unread_count, 0), color: 'text-orange-600' },
          { label: 'Starred', value: conversations.reduce((sum, conv) => sum + conv.messages.filter(m => m.starred).length, 0), color: 'text-yellow-600' },
          { label: 'Conversations', value: conversations.length, color: 'text-blue-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-background p-4 rounded-lg text-center">
            <div className={`font-heading text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="font-ui text-xs text-primary/60">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-background p-4 rounded-lg space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/40" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
          />
        </div>

        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All', count: conversations.length },
            { id: 'unread', label: 'Unread', count: conversations.filter(c => c.unread_count > 0).length },
            { id: 'starred', label: 'Starred', count: conversations.reduce((sum, conv) => sum + conv.messages.filter(m => m.starred).length, 0) },
            { id: 'archived', label: 'Archived', count: conversations.reduce((sum, conv) => sum + conv.messages.filter(m => m.archived).length, 0) }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setMessageFilter(filter.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                messageFilter === filter.id
                  ? 'bg-luxury text-white'
                  : 'bg-white border border-accent/20 text-primary hover:bg-accent/10'
              }`}
            >
              <span>{filter.label}</span>
              {filter.count > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  messageFilter === filter.id ? 'bg-white/20' : 'bg-accent/20'
                }`}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 space-y-3">
          {getFilteredConversations().length === 0 ? (
            <div className="healthcare-card p-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary/30 mx-auto mb-4" />
              <h4 className="font-heading text-primary mb-2">No messages found</h4>
              <p className="font-body text-primary/60 text-sm">
                {searchTerm || messageFilter !== 'all'
                  ? 'No messages match your search criteria.'
                  : 'You have no messages yet.'
                }
              </p>
            </div>
          ) : (
            getFilteredConversations().map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => {
                  setActiveConversation(conversation);
                  markAsRead(conversation.id);
                }}
                className={`healthcare-card p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  activeConversation?.id === conversation.id ? 'ring-2 ring-luxury' : ''
                } ${conversation.unread_count > 0 ? 'bg-accent/5' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-luxury/20 rounded-full flex items-center justify-center">
                      {conversation.participants.find(p => p.id !== user?.id)?.avatar ? (
                        <img
                          src={conversation.participants.find(p => p.id !== user?.id)?.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-luxury" />
                      )}
                    </div>
                    {conversation.participants.find(p => p.id !== user?.id)?.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-ui font-medium text-primary truncate">
                        {conversation.participants.find(p => p.id !== user?.id)?.name}
                      </h5>
                      <div className="flex items-center space-x-1">
                        {conversation.unread_count > 0 && (
                          <span className="bg-luxury text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conversation.unread_count}
                          </span>
                        )}
                        <span className="font-body text-xs text-primary/50">
                          {formatTime(conversation.last_message.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <h6 className="font-ui text-sm font-medium text-primary/80 truncate mb-1">
                      {conversation.subject}
                    </h6>
                    
                    <p className="font-body text-sm text-primary/60 truncate">
                      {conversation.last_message.from_name}: {conversation.last_message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail View */}
        <div className="lg:col-span-2">
          {activeConversation ? (
            <div className="healthcare-card">
              {/* Message Header */}
              <div className="border-b border-accent/20 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-luxury/20 rounded-full flex items-center justify-center">
                      {activeConversation.participants.find(p => p.id !== user?.id)?.avatar ? (
                        <img
                          src={activeConversation.participants.find(p => p.id !== user?.id)?.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <MessageCircle className="h-5 w-5 text-luxury" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-ui font-semibold text-primary">
                        {activeConversation.participants.find(p => p.id !== user?.id)?.name}
                      </h4>
                      <p className="font-body text-sm text-primary/60">
                        {activeConversation.participants.find(p => p.id !== user?.id)?.role}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
                      <Archive className="h-5 w-5 text-primary/60" />
                    </button>
                    <button className="p-2 hover:bg-accent/10 rounded-lg transition-colors">
                      <MoreHorizontal className="h-5 w-5 text-primary/60" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {activeConversation.messages
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-luxury/20 rounded-full flex items-center justify-center flex-shrink-0">
                      {message.from.avatar ? (
                        <img
                          src={message.from.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <MessageCircle className="h-4 w-4 text-luxury" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-ui font-medium text-primary text-sm">
                            {message.from.name}
                          </span>
                          <span className="font-body text-xs text-primary/50">
                            {formatTime(message.timestamp)}
                          </span>
                          <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                          {getMessageTypeIcon(message.message_type)}
                        </div>
                        
                        <button
                          onClick={() => toggleStarred(message.id)}
                          className={`p-1 hover:bg-accent/10 rounded transition-colors ${
                            message.starred ? 'text-yellow-500' : 'text-primary/40'
                          }`}
                        >
                          <Star className="h-4 w-4" fill={message.starred ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      
                      <div className="bg-background p-3 rounded-lg">
                        <p className="font-body text-primary text-sm leading-relaxed">
                          {message.content}
                        </p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-accent/10 rounded">
                                <Paperclip className="h-4 w-4 text-primary/60" />
                                <span className="font-body text-sm text-primary">{attachment.name}</span>
                                <span className="font-body text-xs text-primary/60">
                                  ({formatFileSize(attachment.size)})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <div className="border-t border-accent/20 p-4">
                <div className="flex space-x-3">
                  <textarea
                    placeholder="Type your reply..."
                    rows={2}
                    className="flex-1 p-3 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body text-sm resize-none"
                  />
                  <button className="healthcare-button-primary flex items-center space-x-2 self-end">
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="healthcare-card p-8 text-center">
              <MessageCircle className="h-16 w-16 text-primary/30 mx-auto mb-4" />
              <h4 className="font-heading text-primary mb-2">Select a conversation</h4>
              <p className="font-body text-primary/60">
                Choose a conversation from the list to view messages
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {composing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-accent/20">
              <h2 className="font-heading text-xl font-semibold text-primary">
                Compose Message
              </h2>
              <button
                onClick={() => setComposing(false)}
                className="text-primary/40 hover:text-primary transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  To
                </label>
                <select
                  value={newMessage.to}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                  required
                >
                  <option value="">Select recipient...</option>
                  <option value="admin">Care Coordination Team</option>
                  <option value="hr">HR Department</option>
                  <option value="support">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Message subject"
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                />
              </div>

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Priority
                </label>
                <select
                  value={newMessage.priority}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, priority: e.target.value as Message['priority'] }))}
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block font-ui font-medium text-primary mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Type your message..."
                  rows={6}
                  className="w-full px-3 py-2 border border-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury/50 font-body resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setComposing(false)}
                  className="px-4 py-2 font-body text-primary/70 hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="healthcare-button-primary flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};