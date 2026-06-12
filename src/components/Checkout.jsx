import { useState } from 'react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const validators = {
  name:       (v) => v.trim().length >= 2  ? '' : 'Name must be at least 2 characters',
  email:      (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email',
  phone:      (v) => /^[+\d\s\-()]{7,}$/.test(v) ? '' : 'Please enter a valid phone number',
  address:    (v) => v.trim().length >= 5  ? '' : 'Address must be at least 5 characters',
  city:       (v) => v.trim().length >= 2  ? '' : 'Please enter a city name',
  zip:        (v) => /^\d{4,10}$/.test(v.replace(/\s/g, '')) ? '' : 'Please enter a valid postal code',
  cardNumber: (v) => /^\d{13,19}$/.test(v.replace(/\s/g, '')) ? '' : 'Please enter a valid card number',
  expiry:     (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) ? '' : 'Enter in MM/YY format',
  cvv:        (v) => /^\d{3,4}$/.test(v) ? '' : 'CVV is 3–4 digits',
  cardName:   (v) => v.trim().length >= 2  ? '' : 'Please enter the cardholder name',
};

const INITIAL_FORM = {
  name: '', email: '', phone: '',
  address: '', city: '', country: 'United States', zip: '',
  cardNumber: '', expiry: '', cvv: '', cardName: '',
};

export default function Checkout({ onClose, onSuccess }) {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(1);

  const shipping = subtotal > 100 ? 0 : 9.99;
  const total    = subtotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'cardNumber') formatted = value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    if (name === 'expiry')     formatted = value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
    if (name === 'cvv')        formatted = value.replace(/\D/g, '').slice(0, 4);

    setForm((prev) => ({ ...prev, [name]: formatted }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validators[name]?.(formatted) ?? '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validators[name]?.(value) ?? '' }));
  };

  const validateFields = (fields) => {
    const newErrors = {};
    const newTouched = {};
    fields.forEach((field) => {
      newErrors[field]  = validators[field]?.(form[field]) ?? '';
      newTouched[field] = true;
    });
    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({ ...prev, ...newTouched }));
    return Object.values(newErrors).every((e) => e === '');
  };

  const handleNextStep = () => {
    if (validateFields(['name', 'email', 'phone', 'address', 'city', 'zip'])) setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields(['cardNumber', 'expiry', 'cvv', 'cardName'])) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1800));
    clearCart();
    setLoading(false);
    onSuccess();
  };

  const Field = ({ name, label, placeholder, type = 'text', half }) => (
    <div className={`form-group${half ? ' checkout__half' : ''}`}>
      <label className="form-label" htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} placeholder={placeholder}
        value={form[name]} onChange={handleChange} onBlur={handleBlur}
        className={`form-input${errors[name] && touched[name] ? ' error' : ''}`}
        autoComplete="on" />
      {errors[name] && touched[name] && (
        <span className="form-error">{errors[name]}</span>
      )}
    </div>
  );

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="checkout" role="dialog" aria-modal="true" aria-label="Checkout">
        {/* Header */}
        <div className="checkout__header">
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <h2 className="checkout__title">Checkout</h2>
          <div className="checkout__steps">
            <div className={`checkout__step${step >= 1 ? ' active' : ''}`}>1. Shipping</div>
            <div className="checkout__step-divider">→</div>
            <div className={`checkout__step${step >= 2 ? ' active' : ''}`}>2. Payment</div>
          </div>
        </div>

        <div className="checkout__body">
          <form className="checkout__form" onSubmit={handleSubmit} noValidate>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="checkout__section">
                <h3 className="checkout__section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Contact Information
                </h3>
                <div className="checkout__grid">
                  <Field name="name"  label="Full Name"     placeholder="John Smith" />
                  <Field name="email" label="Email"         placeholder="john@example.com" type="email" />
                  <Field name="phone" label="Phone Number"  placeholder="+1 (555) 000-0000" />
                </div>

                <h3 className="checkout__section-title" style={{ marginTop: 24 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Shipping Address
                </h3>
                <div className="checkout__grid">
                  <Field name="address" label="Street Address" placeholder="123 Main Street" />
                  <div className="checkout__row">
                    <Field name="city" label="City" placeholder="New York" half />
                    <div className="form-group checkout__half">
                      <label className="form-label" htmlFor="country">Country</label>
                      <select id="country" name="country" value={form.country}
                        onChange={handleChange} className="form-input">
                        {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <Field name="zip" label="Postal Code" placeholder="10001" half />
                  </div>
                </div>

                <button type="button" className="btn btn-primary checkout__next-btn"
                  onClick={handleNextStep}>
                  Continue to Payment
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="checkout__section">
                <button type="button" className="checkout__back-btn" onClick={() => setStep(1)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Back
                </button>

                <h3 className="checkout__section-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Card Details
                </h3>

                <div className="checkout__cards">
                  {['Visa', 'Mastercard', 'AmEx'].map((c) => (
                    <span key={c} className="checkout__card-chip">{c}</span>
                  ))}
                </div>

                <div className="checkout__grid">
                  <Field name="cardName"   label="Cardholder Name"  placeholder="JOHN SMITH" />
                  <Field name="cardNumber" label="Card Number"       placeholder="0000 0000 0000 0000" />
                  <div className="checkout__row">
                    <Field name="expiry" label="Expiry Date" placeholder="MM/YY" half />
                    <Field name="cvv"    label="CVV"         placeholder="123"   half />
                  </div>
                </div>

                <div className="checkout__secure-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Your information is encrypted with SSL
                </div>

                <button type="submit" className="btn btn-primary checkout__submit-btn"
                  disabled={loading}>
                  {loading ? (
                    <span className="checkout__spinner" />
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Order Summary */}
          <div className="checkout__summary">
            <h3 className="checkout__summary-title">Order Summary</h3>
            <ul className="checkout__summary-items">
              {items.map((item) => (
                <li key={item.cartId} className="checkout__summary-item">
                  <div className="checkout__summary-img-wrap">
                    <img src={item.images[0]} alt={item.name} className="checkout__summary-img" />
                    <span className="checkout__summary-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout__summary-name-wrap">
                    <span className="checkout__summary-name">{item.name}</span>
                    {item.selectedSize && (
                      <span className="checkout__summary-size">Size: {item.selectedSize}</span>
                    )}
                  </div>
                  <span className="checkout__summary-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="checkout__summary-totals">
              <div className="checkout__summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="checkout__summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="checkout__summary-row checkout__summary-row--total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
