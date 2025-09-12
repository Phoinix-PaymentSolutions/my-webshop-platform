import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function DashboardLayout({ children, store }) {
  const router = useRouter();
  const { storeId } = router.query;

  const navigation = [
    { name: 'Dashboard', href: `/admin/${storeId}`, icon: '📊' },
    { name: 'Products', href: `/admin/${storeId}/products`, icon: '📦' },
    { name: 'Orders', href: `/admin/${storeId}/orders`, icon: '🛒' },
    { name: 'Settings', href: `/admin/${storeId}/settings`, icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {store?.name} - Admin
              </h1>
              <p className="text-sm text-gray-600">Store ID: {storeId}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href={`/store/${storeId}`}
                target="_blank"
                className="text-blue-600 hover:text-blue-800"
              >
                View Store →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <nav className="w-64 bg-white rounded-lg shadow p-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium ${
                      router.asPath === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}