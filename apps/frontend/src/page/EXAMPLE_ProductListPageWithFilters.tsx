// Ejemplo de integración de FilterPanel en ProductListPage
// Copiar y adaptar este código a tu ProductListPage.tsx

import { useState, useEffect } from 'react';
import FilterPanel from '../components/FilterPanel';
import type { Product } from '@domain/entities/Products'; // Importar tipo desde domain

interface FilterOptions {
  keyword?: string;
  category?: string;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'name';
  limit?: number;
  page?: number;
}

export function ProductListPageWithFilters() {
  const [filters, setFilters] = useState<FilterOptions>({
    limit: 12,
    page: 1,
    sort: 'newest',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Cargar productos cuando cambian los filtros
  useEffect(() => {
    fetchFilteredProducts();
  }, [filters]);

  const fetchFilteredProducts = async () => {
    try {
      setLoading(true);
      
      // Construir query string
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.author) queryParams.append('author', filters.author);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.minRating) queryParams.append('minRating', filters.minRating.toString());
      if (filters.sort) queryParams.append('sort', filters.sort);
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.page) queryParams.append('page', filters.page.toString());

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/filters/advanced-search?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch products');

      const data = await response.json();
      setProducts(data.data || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Error fetching filtered products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset page when filters change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          📚 Catálogo de Libros
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* FilterPanel Sidebar */}
          <aside className="lg:col-span-1">
            <FilterPanel 
              onFilter={handleFilterChange}
              initialFilters={filters}
            />
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No se encontraron productos que coincidan con los filtros.
                </p>
              </div>
            )}

            {!loading && products.length > 0 && (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white dark:bg-slate-700 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      <div className="relative h-48 bg-gray-200 dark:bg-slate-600 overflow-hidden group">
                        <img
                          src={product.image_url || 'https://via.placeholder.com/300x400?text=No+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          por {product.author}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {product.rating || 0} ({product.review_count || 0})
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            ${product.price.toFixed(2)}
                          </span>
                          <button className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm font-medium">
                            Ver
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                          filters.page === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductListPageWithFilters;
