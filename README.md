# LuxeShop — Premium E-Commerce Storefront

A modern, fully-featured e-commerce storefront built with **React 18** and **Vite**. Includes a complete shopping flow: browsing, filtering, cart management, promo codes, and a two-step checkout with form validation.

## Live Demo

🔗 **[luxeshop-gules.vercel.app](https://luxeshop-gules.vercel.app)** — deployed on Vercel.

## Screenshots

> Add screenshots of the homepage, cart, and checkout here.

## Features

- **50 products** across 4 categories — Electronics, Clothing, Home & Garden, Sports
- **Real-time search** — filters by name, category, and description
- **Category filters + price range slider + sort** — instant results
- **Grid / List view toggle** — persistent preference
- **Clothing size picker** — inline on card and in product modal; size stored in cart
- **Promo codes** — `LUXE10` (10% off), `SAVE20` (20% off), `WELCOME15` (15% off)
- **Cart sidebar** — quantity controls, per-item remove, clear all, shipping threshold
- **Two-step checkout** — shipping info → payment, with real-time validation and card auto-formatting
- **Dark / Light mode** — follows system preference, toggleable, persisted
- **Announcement bar** — rotating promo messages, dismissable per session
- **Back-to-top button** — appears after scrolling 400 px
- **Wishlist** — per-card heart toggle
- **Low stock + Out of stock** badges
- **Skeleton loading** on filter changes
- **Toast notifications** on add-to-cart
- **Fully responsive** — mobile-first, tested down to 360 px
- **Cart persistence** — survives page refresh via `localStorage`

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 (functional components + Hooks) |
| Bundler | Vite 5 |
| State | `useReducer` + Context API |
| Styling | Vanilla CSS with CSS custom properties (no framework) |
| Images | Unsplash CDN |
| Fonts | Inter (Google Fonts) |

## Project Structure

```
src/
├── main.jsx
├── App.jsx
├── App.css
├── context/
│   ├── CartContext.jsx      # Cart state, promo codes
│   └── ThemeContext.jsx     # Dark/light mode
├── data/
│   └── products.js          # 50 products with sizes, badges, stock
├── styles/
│   └── index.css            # Global tokens, utilities, animations
└── components/
    ├── AnnouncementBar.jsx/css
    ├── BackToTop.jsx/css
    ├── Header.jsx/css
    ├── Hero.jsx/css
    ├── FilterBar.jsx/css
    ├── ProductGrid.jsx/css
    ├── ProductCard.jsx/css
    ├── ProductModal.jsx/css
    ├── Cart.jsx/css
    ├── Checkout.jsx/css
    └── Footer.jsx/css
```

## Getting Started

**Requirements:** Node.js ≥ 18, npm ≥ 9

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Production build
npm run build

# Preview the build locally
npm run preview
```

## Design Tokens

The entire colour palette, spacing, and shadow system is driven by CSS custom properties defined in `styles/index.css`. Swapping the brand colour is a one-line change:

```css
:root {
  --accent: #6366f1; /* change this to rebrand */
}
```

Dark mode overrides live in `[data-theme="dark"]` and are applied automatically via `ThemeContext`.

## License

MIT
