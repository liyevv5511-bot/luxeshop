import './Hero.css';

export default function Hero({ onShopNow }) {
  return (
    <section className="hero" id="home">
      <div className="hero__blob hero__blob--1" aria-hidden="true" />
      <div className="hero__blob hero__blob--2" aria-hidden="true" />

      <div className="hero__content container">
        <div className="hero__text">
          <span className="hero__eyebrow">✦ New Collection 2025</span>

          <h1 className="hero__headline">
            Premium Shopping<br />
            <span className="hero__headline-accent">At a New Level</span>
          </h1>

          <p className="hero__subtext">
            The best brands, the fastest delivery, the most accessible prices.
            Elevate your life — every product is hand-picked for you.
          </p>

          <div className="hero__cta-row">
            <button className="btn btn-primary hero__cta" onClick={onShopNow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              Shop Now
            </button>
            <button className="btn btn-ghost hero__cta-secondary" onClick={onShopNow}>
              Browse Collection
            </button>
          </div>

          <div className="hero__trust">
            <div className="hero__trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Free Shipping
            </div>
            <div className="hero__trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Secure Payment
            </div>
            <div className="hero__trust-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              30-Day Returns
            </div>
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__img-card hero__img-card--main">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
              alt="Featured product" loading="eager" />
          </div>
          <div className="hero__img-card hero__img-card--secondary">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80"
              alt="Featured product 2" loading="eager" />
          </div>
          <div className="hero__stat">
            <span className="hero__stat-value">50+</span>
            <span className="hero__stat-label">Premium products</span>
          </div>
          <div className="hero__rating-badge">
            <span>⭐ 4.9</span>
            <span>Top rated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
