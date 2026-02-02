import { useState } from "react";
import type { Product } from "@domain/entities/Products";
import "./ProductComparator.css";

interface ProductComparatorProps {
  onCompare?: (products: Product[]) => void;
  onClose?: () => void;
}

export default function ProductComparator({
  onCompare,
  onClose,
}: ProductComparatorProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/filters/search/${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = (product: Product) => {
    if (selectedProducts.length >= 4) {
      alert("Máximo 4 productos para comparar");
      return;
    }
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const removeProduct = (id: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const handleCompare = () => {
    if (selectedProducts.length < 2) {
      alert("Selecciona al menos 2 productos para comparar");
      return;
    }
    if (onCompare) {
      onCompare(selectedProducts);
    }
  };

  return (
    <div className="product-comparator">
      {/* Floating Button */}
      <button
        className="comparator-fab"
        onClick={() => setIsOpen(!isOpen)}
        title="Comparar Productos"
      >
        ⚖️ {selectedProducts.length}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="comparator-modal">
          <div className="comparator-header">
            <h2>Comparador de Productos</h2>
            <button
              className="comparator-close"
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
            >
              ✕
            </button>
          </div>

          <div className="comparator-content">
            {/* Search Section */}
            <div className="comparator-search">
              <input
                type="text"
                placeholder="Buscar productos para agregar..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />

              {loading && <div className="loading">Buscando...</div>}

              {searchResults.length > 0 && (
                <div className="search-results">
                  {searchResults.map((product) => (
                    <div key={product.id} className="search-result-item">
                      <img src={product.imageUrl} alt={product.name} />
                      <div className="item-info">
                        <h4>{product.name}</h4>
                        <p className="price">${product.price}</p>
                      </div>
                      <button
                        className="btn-add"
                        onClick={() => addProduct(product)}
                        disabled={selectedProducts.some((p) => p.id === product.id)}
                      >
                        {selectedProducts.some((p) => p.id === product.id)
                          ? "✓ Agregado"
                          : "+ Agregar"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Comparison Table */}
            {selectedProducts.length > 0 && (
              <div className="comparator-table-container">
                <table className="comparator-table">
                  <thead>
                    <tr>
                      <th>Característica</th>
                      {selectedProducts.map((product) => (
                        <th key={product.id}>
                          <div className="product-header">
                            <img src={product.imageUrl} alt={product.name} />
                            <div className="product-info">
                              <h4>{product.name}</h4>
                              <p className="author">{product.author}</p>
                            </div>
                            <button
                              className="remove-btn"
                              onClick={() => removeProduct(product.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="feature-name">Precio</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="price-cell">
                          <strong>${product.price}</strong>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="feature-name">Categoría</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id}>{product.category}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="feature-name">Stock</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id}>
                          <span
                            className={`stock-badge ${
                              product.stock > 5 ? "in-stock" : "low-stock"
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock} unidades` : "Agotado"}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="feature-name">Calificación</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id}>
                          <div className="rating-display">
                            <span className="stars">
                              {"★".repeat(Math.floor(product.rating || 0))}
                            </span>
                            <span className="value">
                              {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0})
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="feature-name">Descripción</td>
                      {selectedProducts.map((product) => (
                        <td key={product.id} className="description-cell">
                          <p>{product.description?.substring(0, 150)}...</p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Action Buttons */}
            {selectedProducts.length > 0 && (
              <div className="comparator-actions">
                <button className="btn-clear" onClick={() => setSelectedProducts([])}>
                  🗑️ Limpiar Selección
                </button>
                <button
                  className="btn-compare"
                  onClick={handleCompare}
                  disabled={selectedProducts.length < 2}
                >
                  ⚖️ Comparar Productos ({selectedProducts.length})
                </button>
              </div>
            )}

            {selectedProducts.length === 0 && searchResults.length === 0 && (
              <div className="empty-state">
                <p>🔍 Busca y selecciona productos para compararlos</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
