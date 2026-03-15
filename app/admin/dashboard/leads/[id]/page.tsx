'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FormInput from '@/components/admin/FormInput';
import { getLeadById } from '@/lib/admin/leads';

interface SubmissionData {
  [key: string]: {
    answer: any;
    question: string;
  };
}

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  business_name: string;
  additional_comments: string;
  submission_data: SubmissionData;
  created_at: string;
  user_id: string | null;
}

export default function LeadDetails() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLead();
  }, [params.id]);

  const fetchLead = async () => {
    try {
      const { data, error } = await getLeadById(params.id as string);
      if (error) throw error;
      setLead(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch lead');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderAnswer = (answer: any) => {
    if (Array.isArray(answer)) {
      return (
        <ul className="list-disc list-inside space-y-1">
          {answer.map((item, index) => (
            <li key={index} className="text-gray-600">
              {item.label}
              {item.description && (
                <span className="text-gray-500 text-sm ml-2">({item.description})</span>
              )}
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div className="text-gray-600">
        {answer.label}
        {answer.description && (
          <span className="text-gray-500 text-sm ml-2">({answer.description})</span>
        )}
      </div>
    );
  };

  const filteredSubmissionData = lead?.submission_data
    ? Object.entries(lead.submission_data).filter(([key, value]) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          value.question.toLowerCase().includes(searchLower) ||
          (typeof value.answer === 'object' &&
            (value.answer.label?.toLowerCase().includes(searchLower) ||
              value.answer.description?.toLowerCase().includes(searchLower)))
        );
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading lead details...</div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              {error || 'Lead not found'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Leads
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Lead Details</h1>
              <p className="mt-2 text-sm text-gray-700">
                Submitted on {formatDate(lead.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact Information */}
        <div className="space-y-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Contact Information
              </h3>
              <dl className="mt-5 space-y-4">
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.full_name}</dd>
                </div>
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.email}</dd>
                </div>
                {lead.phone && (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.phone}</dd>
                  </div>
                )}
                {lead.business_name && (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.business_name}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {lead.additional_comments && (
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Additional Comments
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  {lead.additional_comments}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Submission Details */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Submission Details
                </h3>
                <div className="w-80">
                  <FormInput
                    label="Search"
                    name="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    required={false}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="max-h-[calc(100vh-24rem)] overflow-y-auto space-y-6 pr-4">
                {filteredSubmissionData.map(([key, value]) => (
                  <div key={key} className="border-b border-gray-200 pb-6 last:border-0">
                    <h4 className="text-sm font-medium text-gray-900">{value.question}</h4>
                    <div className="mt-2">{renderAnswer(value.answer)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 