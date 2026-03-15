"use client";

import { usePathname } from "next/navigation";

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <div className={`min-h-screen ${isLoginPage ? "bg-gray-50" : ""}`}>
      {children}
    </div>
  );
}
