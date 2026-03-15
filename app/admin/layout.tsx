"use client";

import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className={`min-h-screen ${isLoginPage ? 'bg-gray-50' : ''}`}>
      {children}
    </div>
  );
} 