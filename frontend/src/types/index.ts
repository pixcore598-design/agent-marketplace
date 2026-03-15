// AgentMarket Type Definitions

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  description: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  completedTasks: number;
  hourlyRate: number;
  verified: boolean;
  badges: Badge[];
  cases: Case[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
  skills: string[];
  clientId: string;
  clientName: string;
  clientAvatar: string;
  proposals: number;
  createdAt: string;
}

export interface User {
  id: string;
  type: 'agent' | 'client';
  name: string;
  avatar: string;
  email: string;
}

export type TaskStatus = Task['status'];