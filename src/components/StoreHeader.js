import React, { useState } from 'react';
import Image from 'next/image';
import { Instagram, Facebook } from 'lucide-react';

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.10z"/>
  </svg>
);

export default function StoreHeader({ store, socials = [], cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getSocialIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'instagram':
        return <Instagram style={{ width: '20px', height: '20px' }} />;
      case 'facebook':
        return <Facebook style={{ width: '20px', height: '20px' }} />;
      case 'tiktok':
        return <TikTokIcon />;
      default:
        return null;
    }
  };

  const headerStyle = {
    backgroundColor: store?.brandColor || '#ffffff',
    color: store?.textColor || '#1f2937',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    borderBottom: '1px solid #f3f4f6',
    position: 'sticky',
    top: 0,
    zIndex: 40
  };

  const containerStyle = {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1.5rem'
  };

  const flexStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '5rem'
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const logoStyle = {
    width: '48px',
    height: '48px',
    position: 'relative',
    borderRadius: '8px',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    letterSpacing: '-0.025em',
    margin: 0
  };

  const descriptionStyle = {
    fontSize: '0.875rem',
    opacity: 0.75,
    margin: '0.25rem 0 0 0'
  };

  const navStyle = {
    display: 'none',
    alignItems: 'center',
    gap: '2rem'
  };

  const navLinkStyle = {
    fontWeight: '500',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'opacity 0.2s',
    cursor: 'pointer'
  };

  const rightSideStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const socialContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  const socialLinkStyle = {
    color: store?.textColor ? `${store.textColor}80` : '#6b7280',
    padding: '0.5rem',
    borderRadius: '9999px',
    textDecoration: 'none',
    transition: 'all 0.2s',
    cursor: 'pointer'
  };

  const cartStyle = {
    position: 'relative',
    fontSize: '1.5rem'
  };

  const cartBadgeStyle = {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: store?.accentColor || '#ef4444',
    color: 'white',
    fontSize: '0.75rem',
    borderRadius: '9999px',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  };

  const mobileButtonStyle = {
    padding: '0.5rem',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: store?.textColor || '#374151',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const mobileMenuStyle = {
    borderTop: '1px solid #f3f4f6',
    padding: '1rem 0'
  };

  const mobileNavStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  };

  const mobileLinkStyle = {
    fontWeight: '500',
    padding: '0.5rem 0',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer'
  };

  // Media query simulation for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={flexStyle}>
          {/* Logo and Store Name */}
          <div style={logoContainerStyle}>
            {store?.logoUrl && (
              <div style={logoStyle}>
                <Image
                  src={store.logoUrl}
                  alt={`${store.name} logo`}
                  fill
                  style={{ objectFit: 'contain', borderRadius: '8px' }}
                />
              </div>
            )}
            <div>
              <h1 style={titleStyle}>
                {store?.name || 'Store Name'}
              </h1>
              {store?.description && (
                <p style={descriptionStyle}>
                  {store.description}
                </p>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav style={{ ...navStyle, display: isMobile ? 'none' : 'flex' }}>
            <a href="#home" style={navLinkStyle}>Home</a>
            <a href="#menu" style={navLinkStyle}>Menu</a>
            <a href="#information" style={navLinkStyle}>Information</a>
            <a href="#reviews" style={navLinkStyle}>Reviews</a>
            <a href="#contact" style={navLinkStyle}>Contact</a>
          </nav>

          {/* Right Side */}
          <div style={rightSideStyle}>
            {/* Social Media Icons */}
            {socials.length > 0 && (
              <div style={socialContainerStyle}>
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={socialLinkStyle}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    {getSocialIcon(social.type)}
                  </a>
                ))}
              </div>
            )}

            {/* Cart */}
            {cartCount > 0 && (
              <div style={cartStyle}>
                <span>🛒</span>
                <span style={cartBadgeStyle}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              </div>
            )}

            {/* Mobile button */}
            <button
              style={{...mobileButtonStyle, display: isMobile ? 'block' : 'none'}}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={mobileMenuStyle}>
            <nav style={mobileNavStyle}>
              <a href="#home" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#menu" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Menu</a>
              <a href="#information" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Information</a>
              <a href="#reviews" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Reviews</a>
              <a href="#contact" style={mobileLinkStyle} onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}