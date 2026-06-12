import { useState, useEffect } from 'react';
import './AnnouncementBar.css';

const MESSAGES = [
  { icon: '🚚', html: 'Free shipping on all orders over <strong>$100</strong>' },
  { icon: '💳', html: 'Use code <strong>LUXE10</strong> for 10% off your first order' },
  { icon: '✨', html: 'New arrivals just dropped — 50 premium products in stock' },
];

export default function AnnouncementBar({ onShopNow }) {
  const [visible, setVisible] = useState(() => sessionStorage.getItem('ann-dismissed') !== '1');
  const [idx, setIdx]         = useState(0);
  const [show, setShow]       = useState(true);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIdx((i) => (i + 1) % MESSAGES.length); setShow(true); }, 300);
    }, 4000);
    return () => clearInterval(id);
  }, [visible]);

  const dismiss = () => {
    sessionStorage.setItem('ann-dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  const msg = MESSAGES[idx];

  return (
    <div className="ann-bar">
      <div className={`ann-bar__msg${show ? ' ann-bar__msg--in' : ''}`}>
        <span className="ann-bar__icon">{msg.icon}</span>
        <span dangerouslySetInnerHTML={{ __html: msg.html }} />
        {idx === 2 && (
          <button className="ann-bar__cta" onClick={onShopNow}>Shop Now →</button>
        )}
      </div>
      <button className="ann-bar__close" onClick={dismiss} aria-label="Dismiss">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  );
}
