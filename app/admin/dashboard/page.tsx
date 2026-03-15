"use client";

import { UserGroupIcon, UserIcon, ClipboardDocumentListIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { getLeadCount, getRecentLeads } from '@/lib/admin/leads';
import { getAdminUserCount } from '@/lib/admin/users';
import { getLSSLeadCount } from '@/lib/admin/lss-leads';
import LoadingLogo from '@/components/admin/LoadingLogo';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    // RentSmallSpace stats
    rssTotalLeads: 0,
    rssRecentLeads: 0,
    adminUsers: 0,
    // LeaseSmallSpace stats
    lssTotalLeads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const [rssLeadsCount, adminCount, rssRecentLeads, lssLeadsCount] = await Promise.all([
          getLeadCount(),
          getAdminUserCount(),
          getRecentLeads(24),
          getLSSLeadCount(),
        ]);

        if (rssLeadsCount.error) throw new Error(rssLeadsCount.error);
        if (adminCount.error) throw new Error(adminCount.error);
        if (rssRecentLeads.error) throw new Error(rssRecentLeads.error);
        if (lssLeadsCount.error) throw new Error(lssLeadsCount.error);

        setStats({
          rssTotalLeads: rssLeadsCount.count || 0,
          rssRecentLeads: rssRecentLeads.data?.length || 0,
          adminUsers: adminCount.count || 0,
          lssTotalLeads: lssLeadsCount.count || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-4">
        <LoadingLogo />
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-8xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          {/* Welcome message */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900">Welcome to the Admin Dashboard</h2>
            <p className="mt-2 text-gray-600">
              Select a section from the sidebar to get started.
            </p>
          </div>

          {/* RentSmallSpace Stats */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">RentSmallSpace</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* RSS Total Leads */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-500 rounded-md p-3">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.rssTotalLeads}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* RSS Recent Activity */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-500 rounded-md p-3">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Recent Activity</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.rssRecentLeads}</div>
                          <span className="ml-2 text-sm text-gray-500">last 24h</span>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Users */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-indigo-500 rounded-md p-3">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Admin Users</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.adminUsers}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LeaseSmallSpace Stats */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">LeaseSmallSpace</h3>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* LSS Total Leads */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-green-500 rounded-md p-3">
                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Leads</dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">{stats.lssTotalLeads}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 