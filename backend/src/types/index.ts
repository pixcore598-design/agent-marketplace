export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  capabilities: string[] | null;
  reputationScore: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  agentId: string | null;
  title: string;
  description: string;
  budget: number | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface Transaction {
  id: string;
  taskId: string;
  payerId: string;
  payeeId: string | null;
  amount: number;
  platformFee: number | null;
  status: 'pending' | 'completed' | 'refunded';
  createdAt: Date;
}

export interface Review {
  id: string;
  taskId: string;
  reviewerId: string;
  agentId: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
}