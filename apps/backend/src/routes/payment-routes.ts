import { Router, Request, Response } from 'express';
import stripePaymentService from '../services/stripe-payment-service';
import { query as dbQuery } from '../database/postgres';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = Router();

/**
 * POST /api/payments/create-payment-intent
 * Crea un PaymentIntent para procesar un pago
 */
router.post('/create-payment-intent', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { amount, description, orderId } = req.body;
    const userId = (req as any).userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await stripePaymentService.createPaymentIntent({
      amount,
      currency: 'usd',
      description: description || `Order payment`,
      metadata: {
        userId,
        orderId,
      },
    });

    res.json(paymentIntent);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/confirm-payment
 * Confirma un pago completado
 */
router.post('/confirm-payment', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    const userId = (req as any).userId;

    if (!paymentIntentId || !orderId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Confirmar pago en Stripe
    const paymentDetails = await stripePaymentService.confirmPayment(paymentIntentId);

    if (paymentDetails.status === 'succeeded') {
      // Actualizar orden en base de datos
      await dbQuery(
        'UPDATE orders SET payment_status = $1, stripe_payment_id = $2, status = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
        ['paid', paymentIntentId, 'processing', orderId]
      );

      res.json({
        success: true,
        message: 'Payment confirmed',
        paymentDetails,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not yet completed',
        status: paymentDetails.status,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/create-checkout-session
 * Crea una sesión de checkout
 */
router.post('/create-checkout-session', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { items, successUrl, cancelUrl } = req.body;
    const userId = (req as any).userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Obtener usuario para email
    const userResult = await dbQuery('SELECT email FROM users WHERE id = $1', [userId]);

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.imageUrl ? [item.imageUrl] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripePaymentService.createCheckoutSession({
      lineItems,
      customerEmail: userResult.rows[0]?.email,
      successUrl,
      cancelUrl,
      metadata: { userId },
    });

    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payments/checkout-session/:sessionId
 * Obtiene detalles de una sesión de checkout
 */
router.get('/checkout-session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await stripePaymentService.getCheckoutSession(sessionId);
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/refund
 * Procesa un reembolso
 */
router.post('/refund', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, amount } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment Intent ID required' });
    }

    const refund = await stripePaymentService.refundPayment(paymentIntentId, amount);
    res.json(refund);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/webhook
 * Maneja webhooks de Stripe
 */
router.post('/webhook', (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  try {
    const event = stripePaymentService.constructWebhookEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Manejar diferentes eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        handlePaymentIntentSucceeded(event.data.object as any);
        break;
      case 'payment_intent.payment_failed':
        handlePaymentIntentFailed(event.data.object as any);
        break;
      case 'checkout.session.completed':
        handleCheckoutCompleted(event.data.object as any);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  // Aquí puedes actualizar el estado de la orden en la BD
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment intent failed:', paymentIntent.id);
  // Aquí puedes manejar el fallo del pago
}

async function handleCheckoutCompleted(session: any) {
  console.log('Checkout session completed:', session.id);
  // Aquí puedes procesar la orden completada
}

export default router;
