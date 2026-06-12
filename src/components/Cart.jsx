import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart({ onClose, onCheckout }) {
  const {
    items, itemCount, subtotal, removeItem, updateQuantity, clearCart,
    promo, promoDiscount, promoError, applyPromo, removePromo,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');

  const shipping    = subtotal - promoDiscount > 100 || (promo && subtotal - promoDiscount > 0 && subtotal > 100) ? 0 : 9.99;
  const total       = subtotal - promoDiscount + shipping;

  const handleApplyPromo = () => {
    if (promoInput.trim()) applyPromo(promoInput);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <aside className="cart" aria-label="Shopping cart">
        {/* Header */}
        <div className="cart__header">
          <div className="cart__header-title">
            <h2 className="cart__title">Cart</h2>
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </div>
          <div className="cart__header-actions">
            {items.length > 0 && (
              <button className="cart__clear-btn"
                onClick={() => { if (window.confirm('Clear the entire cart?')) clearCart(); }}>
                Clear all
              </button>
            )}
            <button className="btn-icon" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="cart__body">
          {items.length === 0 ? (
            <div className="cart__empty">
              <div className="cart__empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </div>
              <h3 className="cart__empty-title">Your cart is empty</h3>
              <p className="cart__empty-text">Add items you like to your cart</p>
              <button className="btn btn-primary" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <ul className="cart__list">
              {items.map((item) => (
                <li key={item.cartId} className="cart__item">
                  <img src={item.images[0]} alt={item.name} className="cart__item-img" />

                  <div className="cart__item-info">
                    <span className="cart__item-category">{item.category}</span>
                    <p className="cart__item-name">{item.name}</p>
                    {item.selectedSize && (
                      <span className="cart__item-size">Size: {item.selectedSize}</span>
                    )}
                    <span className="cart__item-price">${item.price.toFixed(2)}</span>
                  </div>

                  <div className="cart__item-controls">
                    <div className="cart__qty">
                      <button className="cart__qty-btn"
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        aria-label="Decrease">
                        {item.quantity === 1 ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                          </svg>
                        ) : '−'}
                      </button>
                      <span className="cart__qty-val">{item.quantity}</span>
                      <button className="cart__qty-btn"
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        aria-label="Increase"
                        disabled={item.quantity >= item.stock}>+</button>
                    </div>

                    <span className="cart__item-total">${(item.price * item.quantity).toFixed(2)}</span>

                    <button className="cart__remove-btn btn-icon"
                      onClick={() => removeItem(item.cartId)}
                      aria-label={`Remove ${item.name}`}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6 6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart__footer">
            {/* Promo code */}
            <div className="cart__promo">
              {promo ? (
                <div className="cart__promo-applied">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{promo.label}</span>
                  <button className="cart__promo-remove" onClick={removePromo} aria-label="Remove promo">✕</button>
                </div>
              ) : (
                <div className="cart__promo-row">
                  <input
                    className="cart__promo-input"
                    placeholder="Promo code (e.g. LUXE10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  />
                  <button className="cart__promo-btn" onClick={handleApplyPromo}>Apply</button>
                </div>
              )}
              {promoError && <p className="cart__promo-error">{promoError}</p>}
            </div>

            <div className="cart__summary">
              <div className="cart__summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {promo && (
                <div className="cart__summary-row cart__summary-row--discount">
                  <span>Discount ({promo.code})</span>
                  <span>−${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="cart__summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'cart__free-shipping' : ''}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {subtotal < 100 && !promo && (
                <p className="cart__shipping-note">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="cart__summary-row cart__summary-row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn btn-primary cart__checkout-btn" onClick={onCheckout}>
              Proceed to Checkout
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
