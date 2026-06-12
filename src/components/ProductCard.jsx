import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

function Stars({ rating }) {
  return (
    <div className="stars" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="12" height="12" viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, onOpenModal, style }) {
  const { addItem, isInCart } = useCart();
  const [imgError, setImgError]     = useState(false);
  const [wished, setWished]         = useState(false);
  const [pickingSize, setPickingSize] = useState(false);

  const inCart       = isInCart(product.id);
  const isOutOfStock = product.stock === 0;
  const isLowStock   = product.stock > 0 && product.stock <= 5;
  const hasSize      = product.sizes && product.sizes.length > 0;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (hasSize) {
      setPickingSize((v) => !v);
    } else {
      addItem(product);
    }
  };

  const handleSizeSelect = (e, size) => {
    e.stopPropagation();
    addItem(product, size);
    setPickingSize(false);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setWished((w) => !w);
  };

  return (
    <article
      className={`product-card${isOutOfStock ? ' product-card--out-of-stock' : ''}`}
      onClick={() => onOpenModal(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpenModal(product)}
      aria-label={`${product.name} — $${product.price}`}
      style={style}
    >
      {/* ── Image ── */}
      <div className="product-card__img-wrap">
        {!imgError ? (
          <img src={product.images[0]} alt={product.name}
            className="product-card__img" loading="lazy"
            onError={() => setImgError(true)} />
        ) : (
          <div className="product-card__img-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {product.badge && (
            <span className={`product-card__badge product-card__badge--${
              product.badge === 'Sale' ? 'sale' : product.badge === 'New' ? 'new' : 'hot'
            }`}>
              {product.badge}
            </span>
          )}
          {discount && (
            <span className="product-card__badge product-card__badge--discount">-{discount}%</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`product-card__wish${wished ? ' product-card__wish--active' : ''}`}
          onClick={handleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick-view overlay */}
        <div className="product-card__overlay">
          <span className="product-card__quick-view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
            View Details
          </span>
        </div>

        {/* Sold-out overlay */}
        {isOutOfStock && (
          <div className="product-card__sold-out">
            <span>Out of Stock</span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>

        {product.description && (
          <p className="product-card__desc">{product.description}</p>
        )}

        <div className="product-card__rating">
          <Stars rating={product.rating} />
          <span className="product-card__rating-val">{product.rating}</span>
          <span className="product-card__reviews">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="product-card__price-row">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="product-card__original">${product.originalPrice.toFixed(2)}</span>
          )}
          {isLowStock && (
            <span className="product-card__low-stock">Only {product.stock} left</span>
          )}
        </div>

        {/* ── Inline size picker ── */}
        {pickingSize && (
          <div className="product-card__size-picker" onClick={(e) => e.stopPropagation()}>
            <p className="product-card__size-label">Select size:</p>
            <div className="product-card__sizes">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className="product-card__size-btn"
                  onClick={(e) => handleSizeSelect(e, size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              className="product-card__size-cancel"
              onClick={(e) => { e.stopPropagation(); setPickingSize(false); }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* ── Cart button ── */}
        {!pickingSize && (
          <button
            className={`btn product-card__btn${
              inCart    ? ' product-card__btn--in-cart' :
              isOutOfStock ? ' product-card__btn--out' : ' btn-primary'
            }`}
            onClick={handleCartClick}
            disabled={isOutOfStock}
            aria-label={inCart ? 'Already in cart' : `Add ${product.name} to cart`}
          >
            {inCart ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                In Cart
              </>
            ) : isOutOfStock ? 'Out of Stock' : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {hasSize ? 'Choose Size' : 'Add to Cart'}
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
