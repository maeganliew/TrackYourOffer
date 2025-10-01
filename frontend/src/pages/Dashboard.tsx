import React, { useState, useEffect } from 'react';
import { Briefcase, Tag, Clock, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import { DashboardStats } from '../types';
import { getStatusColour } from '../../../backend/src/Constants'
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock data for demonstration - replace with actual API call
      // const mockStats: DashboardStats = {
      //   totalJobs: 24,
      //   jobsByStatus: {
      //     applied: 12,
      //     interview: 5,
      //     offer: 2,
      //     rejected: 4,
      //     withdrawn: 1,
      //   },
      //   jobsByTag: {
      //     'Frontend': 8,
      //     'React': 6,
      //     'Remote': 10,
      //     'Full-time': 15,
      //   },
      //    recentActivity: [
      //     {
      //       id: '1',
      //       action: 'Applied to',
      //       jobName: 'Senior Frontend Developer at TechCorp',
      //       timestamp: new Date().toISOString(),
      //      },
      //     {
      //        id: '2',
      //        action: 'Updated status for',
      //        jobName: 'Full Stack Engineer at StartupXYZ',
      //      timestamp: new Date(Date.now() - 86400000).toISOString(),
      //     },
      //      {
      //       id: '3',
      //        action: 'Added tag to',
      //  jobName: 'React Developer at DesignCo',
      //    timestamp: new Date(Date.now() - 172800000).toISOString(),
      //      },
      // ],
      // };

      // Actual API call
      const response = await api.get('/dashboard/stats');
      setStats(response.data.dashboardstats);
      console.log(response.data.dashboardstats);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-64"></div>
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Unable to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's your job application overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.jobsByStatus.Applied?stats.jobsByStatus.Applied:0 + stats.jobsByStatus.Interview?stats.jobsByStatus.Interview:0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Offers</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stats.jobsByStatus.offer? stats.jobsByStatus.offer : 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Tag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tags Used</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {Object.keys(stats.jobsByTag).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Status Breakdown */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Job Status Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(stats.jobsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColour(status)}`}>
                    {status}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                  <div className="ml-3 w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalJobs) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="flow-root">
            <ul className="-mb-8">
              {/* {stats.recentActivity.map((activity, idx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {idx !== stats.recentActivity.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                          <Briefcase className="h-4 w-4 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            {activity.action}{' '}
                            <span className="font-medium text-gray-900">{activity.jobName}</span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {format(new Date(activity.timestamp), 'MMM d')}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))} */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;