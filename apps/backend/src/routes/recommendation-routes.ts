import { Router } from 'express';
import { AIRecommendationService } from '../services/ai-recommendation-service';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = Router();
const recommendationService = new AIRecommendationService();

/**
 * GET /api/recommendations/personalized
 * Obtiene recomendaciones personalizadas para el usuario autenticado
 */
router.get('/personalized', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const limit = parseInt(req.query.limit as string) || 5;

    const recommendations = await recommendationService.getPersonalizedRecommendations(
      userId,
      limit
    );

    res.json({
      data: recommendations,
      type: 'personalized',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

/**
 * GET /api/recommendations/product/:productId
 * Obtiene recomendaciones basadas en un producto específico
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit as string) || 4;

    const recommendations = await recommendationService.getProductRecommendations(
      productId,
      limit
    );

    res.json({
      data: recommendations,
      type: 'similar-products',
      forProduct: productId,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

/**
 * GET /api/recommendations/trending
 * Obtiene productos en tendencia/populares
 */
router.get('/trending', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 8;
    const trending = await recommendationService.getTrendingProducts(limit);

    res.json({
      data: trending,
      type: 'trending',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get trending products' });
  }
});

/**
 * GET /api/recommendations/new-arrivals
 * Obtiene nuevos productos
 */
router.get('/new-arrivals', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const newArrivals = await recommendationService.getNewArrivals(limit);

    res.json({
      data: newArrivals,
      type: 'new-arrivals',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get new arrivals' });
  }
});

/**
 * POST /api/recommendations/cart-based
 * Obtiene recomendaciones basadas en el carrito
 */
router.post('/cart-based', async (req, res) => {
  try {
    const { productIds } = req.body;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Product IDs required' });
    }

    const recommendations = await recommendationService.getCartBasedRecommendations(
      productIds,
      limit
    );

    res.json({
      data: recommendations,
      type: 'cart-based',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export default router;
