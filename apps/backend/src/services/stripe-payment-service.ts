import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16',
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
  description?: string;
  receiptEmail?: string;
}

export interface CheckoutSessionData {
  lineItems: Array<{
    price_data: {
      currency: string;
      product_data: {
        name: string;
        description?: string;
        images?: string[];
      };
      unit_amount: number;
    };
    quantity: number;
  }>;
  customerId?: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

export class StripePaymentService {
  /**
   * Crea un PaymentIntent para procesar un pago
   */
  async createPaymentIntent(data: PaymentIntentData) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convertir a centavos
        currency: data.currency || 'usd',
        metadata: data.metadata,
        description: data.description,
        receipt_email: data.receiptEmail,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirma un pago
   */
  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: (paymentIntent.amount ?? 0) / 100,
        currency: paymentIntent.currency,
        charges: (paymentIntent as any).charges?.data || [],
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Crea una sesión de checkout (para Checkout.js)
   */
  async createCheckoutSession(data: CheckoutSessionData) {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: data.lineItems,
        mode: 'payment',
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        customer_email: data.customerEmail,
        metadata: data.metadata,
      });

      return {
        id: session.id,
        url: session.url,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Obtiene detalles de una sesión de checkout
   */
  async getCheckoutSession(sessionId: string) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return {
        id: session.id,
        status: session.payment_status,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency,
        customerEmail: session.customer_email,
        paymentIntent: session.payment_intent,
      };
    } catch (error) {
      console.error('Error getting checkout session:', error);
      throw error;
    }
  }

  /**
   * Procesa un reembolso
   */
  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return {
        id: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
        paymentIntent: refund.payment_intent,
      };
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }

  /**
   * Crea un cliente en Stripe
   */
  async createCustomer(data: {
    email: string;
    name?: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const customer = await stripe.customers.create({
        email: data.email,
        name: data.name,
        metadata: data.metadata,
      });

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Actualiza un cliente
   */
  async updateCustomer(customerId: string, data: any) {
    try {
      const customer = await stripe.customers.update(customerId, data);

      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  /**
   * Obtiene métodos de pago guardados de un cliente
   */
  async getPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data.map((pm: any) => ({
        id: pm.id,
        brand: (pm.card as any)?.brand,
        last4: (pm.card as any)?.last4,
        expMonth: (pm.card as any)?.exp_month,
        expYear: (pm.card as any)?.exp_year,
      }));
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Valida un webhook de Stripe
   */
  constructWebhookEvent(payload: string | Buffer, sig: string, secret: string) {
    try {
      return stripe.webhooks.constructEvent(payload, sig, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw error;
    }
  }
}

export default new StripePaymentService();
