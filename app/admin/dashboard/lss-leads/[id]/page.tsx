"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import LoadingLogo from '@/components/admin/LoadingLogo';
import { getLSSLeadById, LSSUser } from '@/lib/admin/lss-leads';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LSSLeadDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<LSSUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user with ID:', id);
        
        if (!id || id === 'undefined') {
          throw new Error('Invalid user ID');
        }

        const result = await getLSSLeadById(id);
        
        if (result.error) {
          throw new Error(result.error);
        }

        setUser(result.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch LSS user');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-4">
        <LoadingLogo />
        <div className="text-gray-500">Loading user details...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-8xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/dashboard/lss-leads"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to LSS Leads
          </Link>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error || 'User not found'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  const sourceLabels = {
    questionnaire: 'Questionnaire',
    property_showcase: 'Property Showcase',
    direct: 'Direct',
  };

  return (
    <div className="max-w-8xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LSS User Details</h1>
            <p className="mt-1 text-sm text-gray-600">
              Detailed information for {user.full_name}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/dashboard/lss-leads"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to LSS Leads
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Information</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.full_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.company_name || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
                    {user.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Lead Source</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {sourceLabels[user.lead_source as keyof typeof sourceLabels] || user.lead_source}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">First Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.first_contact_date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Contact</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.last_contact_date).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900">{user.notes || 'No notes'}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Summary</h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Inquiries</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {user.lss_inquiries?.length || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Questionnaires</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {user.lss_questionnaire_responses?.length || 0}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(user.updated_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Questionnaire Responses */}
      {user.lss_questionnaire_responses && user.lss_questionnaire_responses.length > 0 && (
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Questionnaire Responses</h3>
            <div className="space-y-6">
              {user.lss_questionnaire_responses.map((response, index) => (
                <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900">
                      Response #{index + 1}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(response.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {response.responses && (
                    <div className="bg-gray-50 rounded p-3">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                        {JSON.stringify(response.responses, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inquiries */}
      {user.lss_inquiries && user.lss_inquiries.length > 0 && (
        <div className="mt-6 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inquiries</h3>
            <div className="space-y-4">
              {user.lss_inquiries.map((inquiry, index) => (
                <div key={inquiry.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      Inquiry #{index + 1}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 