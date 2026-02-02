import { Router } from 'express';
import { ProductRepository } from '../data/product-repository-postgres';

const router = Router();
const productRepo = new ProductRepository();

export interface FilterOptions {
  keyword?: string;
  author?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'name';
  page?: number;
  limit?: number;
}

class FilterService {
  async applyFilters(filters: FilterOptions) {
    let results = await productRepo.advancedSearch({
      keyword: filters.keyword,
      author: filters.author,
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
    });

    // Apply sorting
    results = this.sortResults(results, filters.sortBy || 'newest');

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const start = (page - 1) * limit;
    const paginatedResults = results.slice(start, start + limit);

    return {
      data: paginatedResults,
      total: results.length,
      page,
      limit,
      pages: Math.ceil(results.length / limit),
    };
  }

  private sortResults(products: any[], sortBy: string) {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }

  async getFilterOptions() {
    const products = await productRepo.findAll();

    // Extract unique authors
    const authors = [...new Set(products.map(p => p.author).filter(Boolean))].sort();

    // Extract unique categories
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))].sort();

    // Calculate price range
    const prices = products.map(p => p.price).filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Calculate rating range
    const ratings = [
      { value: 4.5, label: '4.5+ Stars' },
      { value: 4, label: '4+ Stars' },
      { value: 3.5, label: '3.5+ Stars' },
      { value: 3, label: '3+ Stars' },
    ];

    return {
      authors,
      categories,
      priceRange: { min: Math.floor(minPrice), max: Math.ceil(maxPrice) },
      ratings,
    };
  }
}

const filterService = new FilterService();

// Advanced search endpoint
router.post('/advanced-search', async (req, res) => {
  try {
    const filters: FilterOptions = req.body;
    const results = await filterService.applyFilters(filters);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get filter options (for UI dropdowns)
router.get('/options', async (req, res) => {
  try {
    const options = await filterService.getFilterOptions();
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get filter options' });
  }
});

// Quick filter by author
router.get('/by-author/:author', async (req, res) => {
  try {
    const products = await productRepo.findByAuthor(req.params.author);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter by author' });
  }
});

// Quick filter by price range
router.get('/by-price/:min/:max', async (req, res) => {
  try {
    const minPrice = parseFloat(req.params.min);
    const maxPrice = parseFloat(req.params.max);
    const products = await productRepo.findByPriceRange(minPrice, maxPrice);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter by price' });
  }
});

// Search endpoint
router.get('/search/:query', async (req, res) => {
  try {
    const results = await productRepo.search(req.params.query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
