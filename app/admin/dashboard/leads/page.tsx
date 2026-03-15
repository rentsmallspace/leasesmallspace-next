"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingLogo from '@/components/admin/LoadingLogo';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { getLeads, Lead } from '@/lib/admin/leads';

const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: 'full_name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'created_at',
    header: 'Submitted',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <Link
        href={`/admin/dashboard/leads/${row.original.id}`}
        className="text-blue-600 hover:text-blue-900"
      >
        View<span className="sr-only">, {row.original.full_name}</span>
      </Link>
    ),
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getLeads();

      if (result.error) {
        throw new Error(result.error);
      }

      setLeads(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-4">
        <LoadingLogo />
        <div className="text-gray-500">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Leads</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all leads submitted through the website.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className="h-full bg-white rounded-lg shadow">
          <DataTable columns={columns} data={leads} />
        </div>
      </div>
    </div>
  );
} 