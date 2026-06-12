import ProductCard from './ProductCard';
import './ProductGrid.css';

function SkeletonCard({ isListView }) {
  return (
    <div className={`skeleton-card${isListView ? ' skeleton-card--list' : ''}`}>
      <div className="skeleton-card__img skeleton-shimmer" />
      <div className="skeleton-card__body">
        <div className="skeleton-shimmer skeleton-card__line skeleton-card__line--sm" />
        <div className="skeleton-shimmer skeleton-card__line skeleton-card__line--lg" />
        <div className="skeleton-shimmer skeleton-card__line skeleton-card__line--md" />
        <div className="skeleton-shimmer skeleton-card__line skeleton-card__line--btn" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, onOpenModal, viewMode = 'grid', isLoading = false }) {
  const isListView = viewMode === 'list';

  if (isLoading) {
    return (
      <div className="product-grid" data-view={viewMode}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} isListView={isListView} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="product-grid__empty">
        <div className="product-grid__empty-icon">🔍</div>
        <h3 className="product-grid__empty-title">No products found</h3>
        <p className="product-grid__empty-text">
          Try adjusting your search term or clearing the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid" data-view={viewMode}>
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenModal={onOpenModal}
          style={{ animationDelay: `${idx * 0.05}s` }}
        />
      ))}
    </div>
  );
}
