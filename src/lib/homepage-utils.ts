import { Zap, Users, MessageSquare, BarChart3 } from 'lucide-react';

/**
 * Pure functions and data for homepage
 */

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const getFeatures = (): Feature[] => [
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Real-time Updates',
    description: 'See changes as they happen with WebSocket technology'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with live user presence'
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Instant Chat',
    description: 'Communicate directly within your task boards'
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Visual Organization',
    description: 'Organize tasks with drag-and-drop Kanban boards'
  }
];

export const getNavigation = () => ({
  routes: {
    login: '/auth/login',
    register: '/auth/register',
    demo: '/demo',
    dashboard: '/dashboard'
  },
  
  appInfo: {
    name: 'TaskBoard',
    description: 'Real-time collaborative task board with WebSockets',
    version: '1.0.0'
  }
});
