import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Company: ['About Us', 'Careers', 'Blog', 'Press'],
    Support: ['Help Centre', 'Contact Us', 'Returns', 'Delivery'],
    Legal:   ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  };

  return (
    <footer className="footer" id="footer">
      <div className="footer__inner container">
        {/* Brand */}
        <div className="footer__brand">
          <div className="footer__logo">
            <span className="footer__logo-icon">◆</span>
            <span>Luxe<strong>Shop</strong></span>
          </div>
          <p className="footer__tagline">
            Premium quality, fast delivery, unbeatable prices. Elevate your life with Luxe.
          </p>
          <div className="footer__social">
            {[
              { name: 'Instagram', icon: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM21 2H3a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-5 12.5A5.5 5.5 0 1 1 10.5 9a5.5 5.5 0 0 1 5.5 5.5zm1.5-9a1 1 0 1 1-1 1 1 1 0 0 1 1-1z' },
              { name: 'Twitter / X', icon: 'M4 4l16 16M4 20 20 4' },
              { name: 'Facebook', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
              { name: 'YouTube', icon: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
            ].map(({ name, icon }) => (
              <a key={name} href="#" className="footer__social-link" aria-label={name}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(links).map(([heading, items]) => (
          <div key={heading} className="footer__col">
            <h4 className="footer__col-heading">{heading}</h4>
            <ul className="footer__col-links">
              {items.map((item) => (
                <li key={item}><a href="#" className="footer__link">{item}</a></li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="footer__newsletter">
          <h4 className="footer__col-heading">Newsletter</h4>
          <p className="footer__newsletter-text">
            Be the first to hear about new arrivals and exclusive offers.
          </p>
          <form className="footer__newsletter-form"
            onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }}>
            <input type="email" placeholder="your@email.com" required
              className="form-input footer__newsletter-input" aria-label="Email address" />
            <button type="submit" className="btn btn-primary footer__newsletter-btn">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {year} LuxeShop. All rights reserved.</span>
          <div className="footer__payment-icons">
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((p) => (
              <span key={p} className="footer__payment-chip">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
