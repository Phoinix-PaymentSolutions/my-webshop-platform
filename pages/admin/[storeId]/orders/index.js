import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getStoreConfig } from '../../../../lib/firebase';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import DashboardLayout from '../../../../components/admin/DashboardLayout';

export default function OrdersAdmin() {
  const router = useRouter();
  const { storeId } = router.query;
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  const fetchData = async () => {
    try {
      const storeConfig = await getStoreConfig(storeId);
      setStore(storeConfig);

      const ordersQuery = query(
        collection(db, 'orders'),
        where('storeId', '==', storeId),
        orderBy('createdAt', 'desc')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout store={store}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'all', label: `All (${orders.length})` },
                { key: 'pending', label: `Pending (${statusCounts.pending || 0})` },
                { key: 'confirmed', label: `Confirmed (${statusCounts.confirmed || 0})` },
                { key: 'processing', label: `Processing (${statusCounts.processing || 0})` },
                { key: 'shipped', label: `Shipped (${statusCounts.shipped || 0})` },
                { key: 'delivered', label: `Delivered (${statusCounts.delivered || 0})` },
                { key: 'cancelled', label: `Cancelled (${statusCounts.cancelled || 0})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <div>
                        <p className="text-lg font-medium">No {filter === 'all' ? '' : filter} orders</p>
                        <p className="mt-1">Orders will appear here when customers place them</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id.slice(0, 8)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Payment: {order.paymentStatus || 'pending'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerName}
                          </div>
                          <div className="text-sm text-gray-500">{order.customerEmail}</div>
                          <div className="text-sm text-gray-500">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {order.items?.length || 0} items
                        </div>
                        <div className="text-xs text-gray-500 max-w-xs truncate">
                          {order.items?.map(item => `${item.name} (${item.quantity})`).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        €{order.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <button
                          onClick={() => {
                            const details = `
                              Order: #${order.id}
                              Customer: ${order.customerName} (${order.customerEmail})
                              Phone: ${order.customerPhone}
                              Address: ${order.shippingAddress}
                              
                              Items:
                              ${order.items?.map(item => `- ${item.name} × ${item.quantity} = €${(item.price * item.quantity).toFixed(2)}`).join('\n')}
                              
                              Total: €${order.total?.toFixed(2)}
                              Status: ${order.status}
                              Payment: ${order.paymentStatus || 'pending'}
                            `;
                            alert(details);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
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