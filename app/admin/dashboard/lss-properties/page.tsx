"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingLogo from '@/components/admin/LoadingLogo';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { getProperties, Property, deleteProperty } from '@/lib/admin/properties';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getProperties();

      if (result.error) {
        throw new Error(result.error);
      }

      setProperties(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const result = await deleteProperty(id);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh the list
      await fetchProperties();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    }
  };

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.address}</div>
          <div className="text-sm text-gray-500">
            {row.original.city}, {row.original.state} {row.original.zip_code}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'property_type',
      header: 'Type',
    },
    {
      accessorKey: 'size_sqft',
      header: 'Size (sq ft)',
      cell: ({ row }) => row.original.size_sqft.toLocaleString(),
    },
    {
      accessorKey: 'price_monthly',
      header: 'Monthly Price',
      cell: ({ row }) => `$${row.original.price_monthly.toLocaleString()}`,
    },
    {
      accessorKey: 'clear_height',
      header: 'Clear Height',
      cell: ({ row }) => row.original.clear_height ? `${row.original.clear_height}'` : '-',
    },
    {
      accessorKey: 'parking_spaces',
      header: 'Parking',
      cell: ({ row }) => row.original.parking_spaces ? row.original.parking_spaces.toString() : '-',
    },
    {
      accessorKey: 'is_featured',
      header: 'Featured',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.is_featured 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {row.original.is_featured ? 'Featured' : 'Standard'}
        </span>
      ),
    },
    {
      accessorKey: 'features',
      header: 'Features',
      cell: ({ row }) => (
        <div className="max-w-xs">
          {row.original.features && row.original.features.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {row.original.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {feature}
                </span>
              ))}
              {row.original.features.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{row.original.features.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">No features</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.original.is_active 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Link
            href={`/admin/dashboard/lss-properties/${row.original.id}`}
            className="text-blue-600 hover:text-blue-900 text-sm"
          >
            View
          </Link>
          <Link
            href={`/admin/dashboard/lss-properties/${row.original.id}/edit`}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-4">
        <LoadingLogo />
        <div className="text-gray-500">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Properties</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all properties in the LSS database.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/admin/dashboard/lss-properties/create"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Property
            </Link>
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
          <DataTable columns={columns} data={properties} />
        </div>
      </div>
    </div>
  );
} 