import { useState } from 'react';

// Main App component containing all the dashboard logic and UI
export default function App() {
  // Dummy store and route information
  const store = {
    id: 'store-123',
    name: "The Potion Emporium",
  };

  const [currentPage, setCurrentPage] = useState('dashboard');

  const navigation = [
    { name: 'Dashboard', id: 'dashboard', icon: '📊' },
    { name: 'Products', id: 'products', icon: '📦' },
    { name: 'Orders', id: 'orders', icon: '🛒' },
    { name: 'Settings', id: 'settings', icon: '⚙️' },
  ];

  // Helper component to render content based on the current page
  const PageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">€1,200.50</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">New Orders</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">14</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">Products Sold</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">45</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-gray-500 text-sm font-medium">Page Views</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">2,100</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <p className="mt-2 text-gray-500">
                This is a placeholder for your recent sales, orders, or other key metrics.
              </p>
            </div>
          </div>
        );
      case 'products':
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Product Management</h3>
            <p className="mt-2 text-gray-500">
              Here you would manage your inventory, add new products, and edit existing ones.
            </p>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Order History</h3>
            <p className="mt-2 text-gray-500">
              This is where you would view and fulfill customer orders.
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">Store Settings</h3>
            <p className="mt-2 text-gray-500">
              Update your store information, payment options, and other administrative settings.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {store.name} - Admin
              </h1>
              <p className="text-sm text-gray-500">Store ID: {store.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                target="_blank"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Store →
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setCurrentPage(item.id)}
                      className={`
                        w-full text-left
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        font-medium transition-colors duration-200
                        ${currentPage === item.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold capitalize">{currentPage}</h2>
            </div>
            <PageContent />
          </main>
        </div>
      </div>

      {/* Tailwind CSS CDN script for styling */}
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
