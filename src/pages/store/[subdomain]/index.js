import { useState } from 'react';
import { getStoreConfig, getStoreProducts } from '../../../lib/firebase';
import ProductGrid from '../../../components/ProductGrid';
import StoreHeader from '../../../components/StoreHeader';
import CheckoutModal from '../../../components/CheckoutModal';

export default function StorePage({ store, products }) {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Store Not Found</h1>
          <p className="text-gray-600 mt-2">This store doesn't exist or is inactive.</p>
        </div>
      </div>
    );
  }

  const handleCheckout = async (orderData) => {
    try {
      const response = await fetch('/api/checkout/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to Mollie payment page
        window.location.href = result.paymentUrl;
      } else {
        throw new Error(result.error || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StoreHeader store={store} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to {store.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {store.description}
          </p>
        </div>
        
        <ProductGrid 
          products={products} 
          store={store}
          cart={cart}
          setCart={setCart}
          onCheckout={() => setShowCheckout(true)}
        />
      </main>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cart}
        store={store}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { subdomain } = params;
  
  try {
    const store = await getStoreConfig(subdomain);
    if (!store) {
      return { props: { store: null, products: [] } };
    }
    
    const products = await getStoreProducts(store.id);
    
    return {
      props: {
        store,
        products
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { props: { store: null, products: [] } };
  }
}