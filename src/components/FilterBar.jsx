import { CATEGORIES } from '../data/products';
import './FilterBar.css';

const SORT_OPTIONS = [
  { value: 'default',    label: 'Default' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'reviews',    label: 'Most Reviews' },
];

export default function FilterBar({ filters, onChange, resultCount, viewMode, onViewMode, categoryCounts }) {
  const { category, sort, maxPrice } = filters;

  return (
    <div className="filterbar">
      {/* Category chips */}
      <div className="filterbar__section">
        <span className="filterbar__label">Category</span>
        <div className="filterbar__chips">
          {CATEGORIES.map((cat) => (
            <button key={cat}
              className={`tag${category === cat ? ' active' : ''}`}
              onClick={() => onChange({ category: cat })}>
              {cat}
              {categoryCounts && categoryCounts[cat] !== undefined && (
                <span className="filterbar__chip-count">{categoryCounts[cat]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="filterbar__section">
        <span className="filterbar__label">
          Max Price: <strong>{maxPrice === 1500 ? 'All' : `$${maxPrice}`}</strong>
        </span>
        <input type="range" min={10} max={1500} step={10} value={maxPrice}
          className="filterbar__range"
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          aria-label="Maximum price" />
        <div className="filterbar__range-labels">
          <span>$10</span>
          <span>$1500+</span>
        </div>
      </div>

      {/* Right: sort + view toggle */}
      <div className="filterbar__right">
        <span className="filterbar__count">{resultCount} products found</span>

        <select className="filterbar__sort" value={sort}
          onChange={(e) => onChange({ sort: e.target.value })} aria-label="Sort by">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {onViewMode && (
          <div className="filterbar__view-toggle">
            <button
              className={`filterbar__view-btn${viewMode === 'grid' ? ' active' : ''}`}
              onClick={() => onViewMode('grid')}
              aria-label="Grid view"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
            <button
              className={`filterbar__view-btn${viewMode === 'list' ? ' active' : ''}`}
              onClick={() => onViewMode('list')}
              aria-label="List view"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
