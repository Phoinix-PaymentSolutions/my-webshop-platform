import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStoreConfig } from '../../../lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../firebase';
import DashboardLayout from '../../../components/admin/DashboardLayout';
import StatsCard from '../../../components/admin/StatsCard';

export default function AdminDashboard() {
  const router = useRouter();
  const { storeId } = router.query;
  const [store, setStore] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeId) {
      fetchDashboardData();
    }
  }, [storeId]);

  const fetchDashboardData = async () => {
    try {
      // Fetch store config
      const storeConfig = await getStoreConfig(storeId);
      setStore(storeConfig);

      // Fetch orders stats
      const ordersQuery = query(
        collection(db, 'orders'),
        where('storeId', '==', storeId)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      
      let totalRevenue = 0;
      let pendingCount = 0;
      
      ordersSnapshot.docs.forEach(doc => {
        const order = doc.data();
        totalRevenue += order.total || 0;
        if (order.status === 'pending') pendingCount++;
      });

      // Fetch products count
      const productsQuery = query(
        collection(db, 'products'),
        where('storeId', '==', storeId)
      );
      const productsSnapshot = await getDocs(productsQuery);

      // Fetch recent orders
      const recentOrdersQuery = query(
        collection(db, 'orders'),
        where('storeId', '==', storeId),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
      const recentOrdersData = recentOrdersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStats({
        totalOrders: ordersSnapshot.docs.length,
        totalRevenue: totalRevenue,
        totalProducts: productsSnapshot.docs.length,
        pendingOrders: pendingCount
      });

      setRecentOrders(recentOrdersData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Store Not Found</h1>
          <p className="text-gray-600">This store doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout store={store}>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="📋"
            color="blue"
          />
          <StatsCard
            title="Total Revenue"
            value={`€${stats.totalRevenue.toFixed(2)}`}
            icon="💰"
            color="green"
          />
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            color="yellow"
          />
          <StatsCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="⏳"
            color="red"
          />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {order.customerName || order.customerEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        €{order.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.createdAt?.toDate?.()?.toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}