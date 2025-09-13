import { useState } from 'react';

// The main App component containing all the logic and UI
export default function App() {
  // Store and product information
  const store = {
    name: "The Potion Emporium",
    description: "Handcrafted magical potions for every need.",
  };

  const dummyProducts = [
    {
      id: 1,
      name: "Elixir of Life",
      description: "A potent brew that revitalizes the body and mind.",
      price: 25.00,
      imageUrl: "https://placehold.co/400x300/e0f2fe/0c4a6e?text=Elixir+of+Life",
      inventory: 10,
    },
    {
      id: 2,
      name: "Mana Potion",
      description: "Restores your magical energy instantly.",
      price: 15.50,
      imageUrl: "https://placehold.co/400x300/fecaca/991b1b?text=Mana+Potion",
      inventory: 5,
    },
    {
      id: 3,
      name: "Invisibility Draught",
      description: "Become unseen for a short duration.",
      price: 50.00,
      imageUrl: "https://placehold.co/400x300/d1d5db/374151?text=Invisibility+Draught",
      inventory: 2,
    },
    {
      id: 4,
      name: "Healing Salve",
      description: "A soothing balm for minor wounds and ailments.",
      price: 12.00,
      imageUrl: "https://placehold.co/400x300/dcfce7/14532d?text=Healing+Salve",
      inventory: 15,
    },
    {
      id: 5,
      name: "Dragon's Breath",
      description: "A spicy concoction to give you fiery strength.",
      price: 35.75,
      imageUrl: "https://placehold.co/400x300/fee2e2/991b1b?text=Dragon%27s+Breath",
      inventory: 0, // Out of stock example
    },
    {
      id: 6,
      name: "Phoenix Feather Elixir",
      description: "A rare potion that grants second chances.",
      price: 99.99,
      imageUrl: "https://placehold.co/400x300/fef3c7/92400e?text=Phoenix+Elixir",
      inventory: 1,
    },
  ];

  const [products] = useState(dummyProducts);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Function to add an item to the cart
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

  // Function to remove an item from the cart
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // Function to update the quantity of a cart item
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

  // Calculate the total price of the items in the cart
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Placeholder for a checkout function
  const onCheckout = () => {
    // In a real app, this would handle the payment process
    console.log("Proceeding to checkout with total:", cartTotal.toFixed(2));
    // Clear the cart after a successful "checkout"
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    // Tailwind CSS global styles for the app
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800 flex flex-col">
      {/* Header section with store information */}
      <header className="bg-white sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
            <p className="text-sm text-gray-500">{store.description}</p>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="md:hidden relative p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
          >
            {/* Cart SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H19l-4 8H7zm0 0l-1.6 8H19"
              />
            </svg>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main content area, structured for desktop and mobile */}
      <main className="container mx-auto px-4 py-8 flex-1 flex flex-col md:flex-row gap-8">
        {/* Product Grid - Scrollable on both desktop and mobile */}
        <section className="flex-1 flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Our Products</h2>
          <div className="flex-1 overflow-y-auto pr-4 -mr-4"> {/* Custom scrollbar styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {products.length === 0 ? (
                <div className="text-center col-span-full py-12">
                  <div className="text-gray-400 text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600">Check back soon for new products!</p>
                </div>
              ) : (
                products.map(product => (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover object-center"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/e0e0e0/ffffff?text=Product+Image"; }}
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.inventory <= 0}
                          className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {product.inventory > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                      {product.inventory <= 5 && product.inventory > 0 && (
                        <p className="text-orange-600 text-sm mt-2 text-right">
                          Only {product.inventory} left in stock!
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Cart Section - Hidden on mobile, fixed on desktop */}
        <section className="hidden md:block md:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-28">
            <h2 className="text-2xl font-bold mb-4">Your Cart ({cart.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H19l-4 8H7zm0 0l-1.6 8H19" />
                  </svg>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/e0e0e0/ffffff?text=Item"; }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500 hover:text-red-700">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-xl mb-4">
                  <span>Total:</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 flex items-end md:hidden transition-opacity duration-300">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl transform translate-y-0 transition-transform duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Cart ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
                {/* Close Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5H19l-4 8H7zm0 0l-1.6 8H19" />
                  </svg>
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-md object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/e0e0e0/ffffff?text=Item"; }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">€{item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-500 hover:text-red-700">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-xl mb-4">
                  <span>Total:</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tailwind CSS CDN script for styling */}
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
