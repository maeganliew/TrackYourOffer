import React, { useState, useEffect } from 'react';
import { Briefcase, Tag, Clock, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import { DashboardStats } from '../types';
import { getStatusColour } from '../../../backend/src/Constants'

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nudges, setNudges] = useState<string[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
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
      //     }
      // ],
      // };

      // Actual API call
      const statsRes = await api.get('/dashboard/stats');
      setStats(statsRes.data.dashboardstats);

      const activityRes = await api.get('/dashboard/activity');
      
      setNudges(activityRes.data.nudges || []);
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
        {/* Total Jobs */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 text-indigo-600" />
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                <dd className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-yellow-600" />
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {(stats.jobsByStatus.Applied || 0) + (stats.jobsByStatus.Interview || 0)}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Offers</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.jobsByStatus.Offer || 0}
                </dd>
              </div>
            </div>
          </div>
        </div>

        {/* Tags Used */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center">
              <Tag className="h-6 w-6 text-purple-600" />
              <div className="ml-4 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Tags Used</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {Object.keys(stats.jobsByTag).length}
                </dd>
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

          {stats.totalJobs > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.jobsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColour(
                      status
                    )}`}
                  >
                    {status}
                  </span>
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
          ) : (
            <p className="text-gray-500 text-sm mt-2">
              There are currently no jobs added. Add some jobs to view your status breakdown!
            </p>
          )}
        </div>

        {/* Temporary fix: Tailwind class whitelist to ensure JIT generates them */}
        <div className="hidden
          bg-pink-100 text-pink-800 border-pink-200
          text-blue-600 bg-blue-100
          text-yellow-600 bg-yellow-100
          text-green-600 bg-green-100
          text-red-600 bg-red-100
          text-gray-600 bg-gray-100
        "></div>

        {/* Activity Nudges */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Nudges</h3>
          {nudges.length > 0 ? (
            <ul className="space-y-2 text-sm text-gray-700">
              {nudges.map((msg, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 bg-indigo-900 rounded-full flex-shrink-0" />
                  <div className="leading-relaxed text-slate-800">{msg}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              No activity nudges right now. Once you add jobs or update statuses, you'll see reminders here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
