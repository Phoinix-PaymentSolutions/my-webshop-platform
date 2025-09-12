import { useState } from 'react';
import { useRouter } from 'next/router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { getStoreConfig } from '../../../../lib/firebase';
import DashboardLayout from '../../../../components/admin/DashboardLayout';

export default function NewProduct() {
  const router = useRouter();
  const { storeId } = router.query;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    inventory: '',
    category: '',
    imageUrl: ''
  });

  useState(() => {
    if (storeId) {
      fetchStore();
    }
  }, [storeId]);

  const fetchStore = async () => {
    const storeConfig = await getStoreConfig(storeId);
    setStore(storeConfig);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        ...product,
        storeId: storeId,
        price: parseFloat(product.price),
        inventory: parseInt(product.inventory),
        active: true,
        createdAt: serverTimestamp()
      });

      router.push(`/admin/${storeId}/products`);
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  return (
    <DashboardLayout store={store}>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-gray-600">Create a new product for your store</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={product.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows="4"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={product.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Inventory</label>
                  <input
                    type="number"
                    required
                    value={product.inventory}
                    onChange={(e) => handleChange('inventory', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  required
                  value={product.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., electronics, clothing, books"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={product.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.push(`/admin/${storeId}/products`)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}