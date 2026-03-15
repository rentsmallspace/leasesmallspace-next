'use client';

import { useCallback, useEffect, useState } from 'react';
import FormInput from '@/components/admin/FormInput';
import LoadingLogo from '@/components/admin/LoadingLogo';
import { addUser, getUsers } from '@/lib/admin/users';
import { DataTable } from '@/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

const columns: ColumnDef<AdminUser>[] = [
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
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getUsers();

      if (result.error) {
        throw new Error(result.error);
      }

      setUsers(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setGeneratedPassword(null);

    try {
      const formData = new FormData();
      formData.append('email', newUser.email);
      formData.append('fullName', newUser.fullName);

      const result = await addUser(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess('User created successfully');
      setGeneratedPassword(result.password || null);
      setNewUser({ email: '', fullName: '' });
      setShowAddUser(false);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-4">
        <LoadingLogo />
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Admin Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all admin users in the system.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setShowAddUser(!showAddUser);
              if (!showAddUser) {
                // Clear previous messages when opening the form
                setSuccess(null);
                setGeneratedPassword(null);
                setError(null);
              }
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            {showAddUser ? 'Cancel' : 'Add User'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{success}</div>
              {generatedPassword && (
                <div className="mt-4 p-3 bg-white border border-green-200 rounded-md">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Temporary Password (copy and share with the new admin):
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono select-all">
                      {generatedPassword}
                    </code>
                    <button
                      onClick={() => navigator.clipboard.writeText(generatedPassword)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Copy to clipboard"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    The new admin should change this password after their first login.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddUser && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Admin User</h3>
            <form onSubmit={handleAddUser} className="mt-5 space-y-4">
              <FormInput
                label="Full Name"
                type="text"
                name="fullName"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                required
              />
              <FormInput
                label="Email"
                type="email"
                name="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mt-8">
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  );
} 