import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

export default function Header({ onCartOpen, onSearch }) {
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled]   = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [menuOpen, setMenuOpen]   = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    onSearch(val);
  };

  const clearSearch = () => {
    setSearchVal('');
    onSearch('');
    inputRef.current?.focus();
  };

  const navLinks = [
    { label: 'Home',     href: '#home' },
    { label: 'Products', href: '#products' },
    { label: 'About',    href: '#footer' },
    { label: 'Contact',  href: '#footer' },
  ];

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner container">
        {/* Logo */}
        <a href="#home" className="header__logo">
          <span className="header__logo-icon">◆</span>
          <span className="header__logo-text">Luxe<strong>Shop</strong></span>
        </a>

        {/* Nav (desktop) */}
        <nav className="header__nav">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="header__nav-link">{link.label}</a>
          ))}
        </nav>

        {/* Search */}
        <div className="header__search">
          <span className="header__search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input ref={inputRef} type="text" placeholder="Search products..."
            value={searchVal} onChange={handleSearch}
            className="header__search-input" aria-label="Search products" />
          {searchVal && (
            <button className="header__search-clear btn-icon" onClick={clearSearch} aria-label="Clear search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="header__actions">
          <button className="btn-icon header__theme-btn" onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <button className="header__cart-btn" onClick={onCartOpen}
            aria-label={`Cart — ${itemCount} items`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {itemCount > 0 && (
              <span className="badge header__cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
            )}
          </button>

          <button className="btn-icon header__menu-btn"
            onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="header__mobile-nav">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="header__mobile-link"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="header__mobile-search">
            <input type="text" placeholder="Search products..."
              value={searchVal} onChange={handleSearch}
              className="form-input" aria-label="Search products" />
          </div>
        </nav>
      )}
    </header>
  );
}
