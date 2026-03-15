"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoadingLogo from '@/components/admin/LoadingLogo';
import { DataTable } from '@/components/DataTable';
import { getLSSLeads, LSSUser } from '@/lib/admin/lss-leads';
import { ColumnDef } from '@tanstack/react-table';

export default function LSSLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leads, setLeads] = useState<LSSUser[]>([]);

  useEffect(() => { 
    const fetchLeads = async () => {
      try {
        const result = await getLSSLeads();
        
        if (result.error) {
          throw new Error(result.error);
        }

        setLeads(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch LSS leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-4">
        <LoadingLogo />
        <div className="text-gray-500">Loading LSS leads...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-8xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dashboard
          </Link>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Define columns for the data table
  const columns: ColumnDef<LSSUser>[] = [
    {
      accessorKey: 'full_name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link 
            href={`/admin/dashboard/lss-leads/${row.original.id}`}
            className="font-medium text-indigo-600 hover:text-indigo-900"
          >
            {row.getValue('full_name')}
          </Link>
          <span className="text-sm text-gray-500">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">{row.getValue('phone')}</span>
      ),
    },
    {
      accessorKey: 'company_name',
      header: 'Company',
      cell: ({ row }) => {
        const company = row.getValue('company_name') as string | null;
        return (
          <span className="text-sm text-gray-900">
            {company || '-'}
          </span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800',
          pending: 'bg-yellow-100 text-yellow-800',
        };
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: 'lead_source',
      header: 'Source',
      cell: ({ row }) => {
        const source = row.getValue('lead_source') as string;
        const sourceLabels = {
          questionnaire: 'Questionnaire',
          property_showcase: 'Property Showcase',
          direct: 'Direct',
        };
        return (
          <span className="text-sm text-gray-900">
            {sourceLabels[source as keyof typeof sourceLabels] || source}
          </span>
        );
      },
    },
    {
      accessorKey: 'first_contact_date',
      header: 'First Contact',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {new Date(row.getValue('first_contact_date') as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'last_contact_date',
      header: 'Last Contact',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900">
          {new Date(row.getValue('last_contact_date') as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'lss_inquiries',
      header: 'Inquiries',
      cell: ({ row }) => {
        const inquiries = row.getValue('lss_inquiries') as Array<any>;
        return (
          <span className="text-sm text-gray-900">
            {inquiries?.length || 0}
          </span>
        );
      },
    },
    {
      accessorKey: 'lss_questionnaire_responses',
      header: 'Questionnaires',
      cell: ({ row }) => {
        const responses = row.getValue('lss_questionnaire_responses') as Array<any>;
        return (
          <span className="text-sm text-gray-900">
            {responses?.length || 0}
          </span>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {new Date(row.getValue('created_at') as string).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-8xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">LSS Leads</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage leads from LeaseSmallSpace.com
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">All LSS Leads</h2>
            <span className="text-sm text-gray-500">
              {leads.length} lead{leads.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <DataTable 
            data={leads} 
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
} 