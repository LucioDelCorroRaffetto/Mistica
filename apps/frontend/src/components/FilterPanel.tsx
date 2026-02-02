import { useState, useEffect } from "react";
import "./FilterPanel.css";

export interface Filters {
  keyword?: string;
  author?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: "price-asc" | "price-desc" | "rating" | "newest" | "name";
}

interface FilterPanelProps {
  onFilter: (filters: Filters) => void;
  onReset?: () => void;
  initialFilters?: Filters;
}

interface FilterOptions {
  authors: string[];
  categories: string[];
  priceRange: { min: number; max: number };
  ratings: Array<{ value: number; label: string }>;
}

export default function FilterPanel({ onFilter, onReset, initialFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters || {});
  const [options, setOptions] = useState<FilterOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch("/api/filters/options");
      const data = await response.json();
      setOptions(data);
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof Filters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    setFilters(initialFilters || {});
    if (onReset) onReset();
  };

  const handleKeywordSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("keyword", e.target.value);
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
    onFilter({ ...filters, minPrice: min, maxPrice: max });
  };

  if (loading || !options) {
    return <div className="filter-panel loading">Cargando filtros...</div>;
  }

  return (
    <div className={`filter-panel ${isOpen ? "open" : ""}`}>
      {/* Mobile Toggle */}
      <button className="filter-toggle" onClick={() => setIsOpen(!isOpen)}>
        🔍 Filtros {isOpen ? "✕" : "→"}
      </button>

      <div className="filter-content">
        {/* Search Box */}
        <div className="filter-section">
          <h3>Buscar</h3>
          <input
            type="text"
            placeholder="Nombre, autor, descripción..."
            value={filters.keyword || ""}
            onChange={handleKeywordSearch}
            className="filter-input"
          />
        </div>

        {/* Sorting */}
        <div className="filter-section">
          <h3>Ordenar por</h3>
          <select
            value={filters.sortBy || "newest"}
            onChange={(e) =>
              handleFilterChange(
                "sortBy",
                e.target.value as
                  | "price-asc"
                  | "price-desc"
                  | "rating"
                  | "newest"
                  | "name"
              )
            }
            className="filter-select"
          >
            <option value="newest">Más Recientes</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Calificados</option>
            <option value="name">Nombre (A-Z)</option>
          </select>
        </div>

        {/* Category Filter */}
        {options.categories.length > 0 && (
          <div className="filter-section">
            <h3>Categoría</h3>
            <select
              value={filters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="filter-select"
            >
              <option value="">Todas las Categorías</option>
              {options.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Author Filter */}
        {options.authors.length > 0 && (
          <div className="filter-section">
            <h3>Autor</h3>
            <select
              value={filters.author || ""}
              onChange={(e) => handleFilterChange("author", e.target.value)}
              className="filter-select"
            >
              <option value="">Todos los Autores</option>
              {options.authors.slice(0, 15).map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="filter-section">
          <h3>Rango de Precio</h3>
          <div className="price-range">
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handlePriceChange(
                    e.target.value ? parseInt(e.target.value) : options.priceRange.min,
                    filters.maxPrice || options.priceRange.max
                  )
                }
                className="price-input"
                min={options.priceRange.min}
                max={options.priceRange.max}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handlePriceChange(
                    filters.minPrice || options.priceRange.min,
                    e.target.value ? parseInt(e.target.value) : options.priceRange.max
                  )
                }
                className="price-input"
                min={options.priceRange.min}
                max={options.priceRange.max}
              />
            </div>
            <div className="price-display">
              ${filters.minPrice || options.priceRange.min} - $
              {filters.maxPrice || options.priceRange.max}
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <h3>Calificación Mínima</h3>
          <div className="rating-filters">
            {options.ratings.map((rating) => (
              <label key={rating.value} className="rating-option">
                <input
                  type="radio"
                  name="minRating"
                  value={rating.value}
                  checked={filters.minRating === rating.value}
                  onChange={(e) =>
                    handleFilterChange("minRating", parseFloat(e.target.value))
                  }
                />
                <span className="stars">{"★".repeat(Math.floor(rating.value))}</span>
                <span className="label">{rating.label}</span>
              </label>
            ))}
            <label className="rating-option">
              <input
                type="radio"
                name="minRating"
                value=""
                checked={!filters.minRating}
                onChange={() => handleFilterChange("minRating", undefined)}
              />
              <span className="label">Todas las Calificaciones</span>
            </label>
          </div>
        </div>

        {/* Reset Button */}
        {Object.keys(filters).length > 0 && (
          <button className="filter-reset-btn" onClick={handleReset}>
            🔄 Limpiar Filtros
          </button>
        )}
      </div>
    </div>
  );
}
