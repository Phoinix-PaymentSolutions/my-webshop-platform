import React, { useState } from 'react';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

// Custom TikTok icon since it's not in lucide-react
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z"/>
  </svg>
);

export default function StoreHeader({ store, socials = [], cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getSocialIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'tiktok':
        return <TikTokIcon />;
      default:
        return null;
    }
  };

  return (
    <header 
      className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40"
      style={{ 
        backgroundColor: store?.brandColor || '#ffffff',
        color: store?.textColor || '#1f2937'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Store Name - Left Side */}
          <div className="flex items-center space-x-4">
            {store?.logoUrl && (
              <div className="flex-shrink-0">
                <div className="h-12 w-12 relative">
                  <Image
                    src={store.logoUrl}
                    alt={`${store.name} logo`}
                    fill
                    className="object-contain rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {store?.name || 'Store Name'}
              </h1>
              {store?.description && (
                <p className="text-sm opacity-75 mt-1">
                  {store.description}
                </p>
              )}
            </div>
          </div>

          {/* Center Navigation - Desktop Only */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="font-medium hover:opacity-70 transition-opacity duration-200"
            >
              Home
            </a>
            <a 
              href="#menu" 
              className="font-medium hover:opacity-70 transition-opacity duration-200"
            >
              Menu
            </a>
            <a 
              href="#information" 
              className="font-medium hover:opacity-70 transition-opacity duration-200"
            >
              Information
            </a>
            <a 
              href="#reviews" 
              className="font-medium hover:opacity-70 transition-opacity duration-200"
            >
              Reviews
            </a>
            <a 
              href="#contact" 
              className="font-medium hover:opacity-70 transition-opacity duration-200"
            >
              Contact
            </a>
          </nav>

          {/* Right Side - Social Media Links & Cart */}
          <div className="flex items-center space-x-4">
            {/* Social Media Icons */}
            {socials.length > 0 && (
              <div className="hidden sm:flex items-center space-x-2">
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full"
                    aria-label={`Visit our ${social.type}`}
                    style={{
                      color: store?.textColor ? `${store.textColor}80` : '#6b7280'
                    }}
                  >
                    {getSocialIcon(social.type)}
                  </a>
                ))}
              </div>
            )}

            {/* Cart Indicator */}
            {cartCount > 0 && (
              <div className="relative">
                <span className="text-2xl">🛒</span>
                <span 
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
                  style={{ backgroundColor: store?.accentColor || '#ef4444' }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                color: store?.textColor || '#374151'
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-3">
              <a 
                href="#home" 
                className="font-medium py-2 hover:opacity-70 transition-opacity duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#menu" 
                className="font-medium py-2 hover:opacity-70 transition-opacity duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </a>
              <a 
                href="#information" 
                className="font-medium py-2 hover:opacity-70 transition-opacity duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Information
              </a>
              <a 
                href="#reviews" 
                className="font-medium py-2 hover:opacity-70 transition-opacity duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reviews
              </a>
              <a 
                href="#contact" 
                className="font-medium py-2 hover:opacity-70 transition-opacity duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              
              {/* Mobile Social Links */}
              {socials.length > 0 && (
                <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
                  {socials.map((social, index) => (
                    <a 
                      key={index} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      {getSocialIcon(social.type)}
                    </a>
                  ))}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}