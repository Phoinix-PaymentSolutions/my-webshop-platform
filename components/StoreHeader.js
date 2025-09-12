import Image from 'next/image';

export default function StoreHeader({ store, cartCount = 0 }) {
  return (
    <header 
      className="bg-white shadow-sm sticky top-0 z-40"
      style={{ 
        backgroundColor: store.brandColor || '#ffffff',
        color: store.textColor || '#000000'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            {store.logoUrl && (
              <div className="w-12 h-12 relative mr-4">
                <Image
                  src={store.logoUrl}
                  alt={`${store.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <p className="text-sm opacity-80">{store.description}</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#products" className="hover:opacity-80 transition-opacity">Products</a>
            <a href="#about" className="hover:opacity-80 transition-opacity">About</a>
            <a href="#contact" className="hover:opacity-80 transition-opacity">Contact</a>
            
            {/* Cart Indicator */}
            {cartCount > 0 && (
              <div className="relative">
                <span className="text-2xl">🛒</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}