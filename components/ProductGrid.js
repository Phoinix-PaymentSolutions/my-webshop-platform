import { useState } from 'react';
import Image from 'next/image';

export default function ProductGrid({ products, store, cart, setCart, onCheckout }) {
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      {/* Floating Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-6 max-w-sm z-50 border">
          <h3 className="text-lg font-semibold mb-3">Cart ({cart.length} items)</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-xs">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right ml-2">
                  <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 text-xs hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between font-bold text-lg mb-3">
              <span>Total: €{cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
              <Image
                src={product.imageUrl || '/placeholder-product.jpg'}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">
                  €{product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.inventory <= 0}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
              {product.inventory <= 5 && product.inventory > 0 && (
                <p className="text-orange-600 text-sm mt-1">
                  Only {product.inventory} left in stock!
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600">Check back soon for new products!</p>
        </div>
      )}
    </div>
  );
}