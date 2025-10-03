import { JobStatus } from "../../../backend/src/Constants";

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Job {
  id: string;
  name: string;
  status: JobStatus;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  tags?: Tag[];
  file?: {
    url: string;
    type: 'image' | 'pdf';
    filename: string;
  };
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