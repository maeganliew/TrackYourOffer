export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Job {
  id: string;
  name: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn' | 'Wishlist';
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
}

export interface Tag {
  _id: string;
  name: string;
  colour: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalJobs: number;
  jobsByStatus: Record<string, number>;
  jobsByTag: Record<string, number>;
  recentActivity: {
    id: string;
    action: string;
    jobName: string;
    timestamp: string;
  }[];
}