import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductModal.css';

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="15" height="15" viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductModal({ product, onClose }) {
  const { addItem, isInCart } = useCart();
  const [activeImg, setActiveImg]       = useState(0);
  const [quantity, setQuantity]         = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const inCart = isInCart(product.id);

  const hasSize = product.sizes && product.sizes.length > 0;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleAddToCart = () => {
    if (hasSize && !selectedSize) return;
    for (let i = 0; i < quantity; i++) addItem(product, selectedSize);
    onClose();
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const canAdd = !product.stock === 0 && (!hasSize || selectedSize);

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <div className="modal" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="modal__close btn-icon" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal__body">
          {/* ── Gallery ── */}
          <div className="modal__gallery">
            <div className="modal__main-img-wrap">
              <img key={activeImg}
                src={product.images[activeImg]}
                alt={`${product.name} — ${activeImg + 1}`}
                className="modal__main-img"
              />
              {discount && <span className="modal__discount-badge">-{discount}%</span>}
            </div>

            {product.images.length > 1 && (
              <div className="modal__thumbs">
                {product.images.map((src, idx) => (
                  <button key={idx}
                    className={`modal__thumb${activeImg === idx ? ' active' : ''}`}
                    onClick={() => setActiveImg(idx)}
                    aria-label={`Image ${idx + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="modal__info">
            <span className="modal__category">{product.category}</span>
            <h2 className="modal__name">{product.name}</h2>

            <div className="modal__rating">
              <Stars rating={product.rating} />
              <strong>{product.rating}</strong>
              <span className="modal__reviews">({product.reviews.toLocaleString()} reviews)</span>
            </div>

            <div className="modal__price-row">
              <span className="modal__price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="modal__original">${product.originalPrice.toFixed(2)}</span>
              )}
              {discount && <span className="modal__save">{discount}% off</span>}
            </div>

            <p className="modal__desc">{product.description}</p>

            {/* ── Size selector ── */}
            {hasSize && (
              <div className="modal__sizes">
                <h4 className="modal__sizes-title">
                  Size
                  {selectedSize && <span className="modal__sizes-chosen"> — {selectedSize}</span>}
                </h4>
                <div className="modal__size-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`modal__size-btn${selectedSize === size ? ' active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="modal__size-hint">Please select a size to continue</p>
                )}
              </div>
            )}

            {product.specs?.length > 0 && (
              <div className="modal__specs">
                <h4 className="modal__specs-title">Features</h4>
                <ul className="modal__specs-list">
                  {product.specs.map((spec) => (
                    <li key={spec} className="modal__spec-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal__stock">
              <span className={`modal__stock-dot${product.stock < 5 ? ' modal__stock-dot--low' : ''}`} />
              {product.stock === 0
                ? 'Out of stock'
                : product.stock < 5
                  ? `Only ${product.stock} left in stock!`
                  : `In stock (${product.stock} units)`}
            </div>

            <div className="modal__actions">
              <div className="modal__qty">
                <button className="modal__qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease">−</button>
                <span className="modal__qty-val">{quantity}</span>
                <button className="modal__qty-btn"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase">+</button>
              </div>

              <button
                className={`btn modal__add-btn${
                  (hasSize && !selectedSize) || product.stock === 0 ? ' modal__add-btn--disabled' : ' btn-primary'
                }`}
                onClick={handleAddToCart}
                disabled={product.stock === 0 || (hasSize && !selectedSize)}
              >
                {product.stock === 0 ? (
                  'Out of Stock'
                ) : hasSize && !selectedSize ? (
                  'Select a Size First'
                ) : inCart ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Add Again
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
