import { useState, useMemo, useCallback } from 'react';

import { CartProvider, useCart } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { products as allProducts, CATEGORIES } from './data/products';

import Header        from './components/Header';
import Hero          from './components/Hero';
import FilterBar     from './components/FilterBar';
import ProductGrid   from './components/ProductGrid';
import ProductModal  from './components/ProductModal';
import Cart          from './components/Cart';
import Checkout      from './components/Checkout';
import Footer        from './components/Footer';
import AnnouncementBar from './components/AnnouncementBar';
import BackToTop     from './components/BackToTop';

import './styles/index.css';
import './App.css';

function OrderSuccess({ onClose, orderNumber }) {
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="success-modal" role="dialog" aria-label="Order placed">
        <div className="success-modal__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="success-modal__title">Order Confirmed!</h2>
        <p className="success-modal__order-num">Order #{orderNumber}</p>
        <p className="success-modal__text">
          Thank you! Your order has been placed successfully. You'll receive a delivery confirmation email shortly.
        </p>
        <button className="btn btn-primary success-modal__btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </>
  );
}

function Toast() {
  const { toast } = useCart();
  if (!toast) return null;
  return (
    <div className="toast" role="alert">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      {toast}
    </div>
  );
}

function AppContent() {
  const [cartOpen, setCartOpen]         = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber]   = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode]         = useState('grid');
  const [isFiltering, setIsFiltering]   = useState(false);

  const [search, setSearch]   = useState('');
  const [filters, setFilters] = useState({
    category: 'All',
    sort: 'default',
    maxPrice: 1500,
  });

  const updateFilter = useCallback((patch) => {
    setIsFiltering(true);
    setFilters((prev) => ({ ...prev, ...patch }));
    setTimeout(() => setIsFiltering(false), 400);
  }, []);

  const displayedProducts = useMemo(() => {
    let list = allProducts;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'All') {
      list = list.filter((p) => p.category === filters.category);
    }

    list = list.filter((p) => p.price <= filters.maxPrice);

    switch (filters.sort) {
      case 'price-asc':  list = [...list].sort((a, b) => a.price - b.price); break;
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating':     list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'reviews':    list = [...list].sort((a, b) => b.reviews - a.reviews); break;
      default: break;
    }

    return list;
  }, [search, filters]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((cat) => {
      counts[cat] = cat === 'All'
        ? allProducts.length
        : allProducts.filter((p) => p.category === cat).length;
    });
    return counts;
  }, []);

  const openCart      = () => { setCartOpen(true); setCheckoutOpen(false); };
  const openCheckout  = () => { setCartOpen(false); setCheckoutOpen(true); };
  const handleOrderSuccess = () => {
    const num = `LX-${Date.now().toString().slice(-6)}`;
    setOrderNumber(num);
    setCheckoutOpen(false);
    setOrderSuccess(true);
  };
  const scrollToProducts = () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="app">
      <AnnouncementBar onShopNow={scrollToProducts} />

      <Header
        onCartOpen={openCart}
        onSearch={(val) => { setSearch(val); scrollToProducts(); }}
      />

      <main>
        <Hero onShopNow={scrollToProducts} />

        <section className="products-section container" id="products">
          <div className="products-section__header">
            <div className="products-section__heading">
              <h2 className="products-section__title">
                {search ? `Results for "${search}"` : 'Products'}
              </h2>
              <p className="products-section__subtitle">
                {search
                  ? `${displayedProducts.length} products found`
                  : 'Discover our curated premium collection'}
              </p>
            </div>
            <span className="products-section__count">
              <strong>{displayedProducts.length}</strong> items
            </span>
          </div>

          <FilterBar
            filters={filters}
            onChange={updateFilter}
            resultCount={displayedProducts.length}
            viewMode={viewMode}
            onViewMode={setViewMode}
            categoryCounts={categoryCounts}
          />

          <ProductGrid
            products={displayedProducts}
            onOpenModal={setSelectedProduct}
            viewMode={viewMode}
            isLoading={isFiltering}
          />
        </section>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      {cartOpen && (
        <Cart onClose={() => setCartOpen(false)} onCheckout={openCheckout} />
      )}

      {checkoutOpen && (
        <Checkout onClose={() => setCheckoutOpen(false)} onSuccess={handleOrderSuccess} />
      )}

      {orderSuccess && (
        <OrderSuccess
          onClose={() => setOrderSuccess(false)}
          orderNumber={orderNumber}
        />
      )}

      <Toast />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ThemeProvider>
  );
}
