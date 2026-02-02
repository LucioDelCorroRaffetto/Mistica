// Ejemplo de CheckoutPage con integración de Stripe
// Copiar y adaptar este código a tu checkout flow

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router-dom';

// Inicializar Stripe una sola vez
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_...'
);

interface OrderSummary {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Cargar resumen de la orden del carrito
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchOrderSummary();
  }, [isAuthenticated, navigate]);

  const fetchOrderSummary = async () => {
    try {
      setLoading(true);
      // Obtener items del chango/carrito del localStorage o API
      const changoData = localStorage.getItem('chango');
      
      if (!changoData) {
        setError('El carrito está vacío');
        return;
      }

      const items = JSON.parse(changoData);
      
      // Simular cálculo de totales
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.1; // 10% tax
      const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
      const total = subtotal + tax + shipping;

      const orderSummary: OrderSummary = {
        orderId: `ORD-${Date.now()}`,
        items,
        subtotal,
        tax,
        shipping,
        total,
      };

      setOrderSummary(orderSummary);
    } catch (err) {
      setError('Error cargando el carrito');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    setPaymentSuccess(true);
    
    // Limpiar carrito
    localStorage.removeItem('chango');
    
    // Redirigir a página de confirmación después de 2 segundos
    setTimeout(() => {
      navigate(`/order-confirmation/${paymentIntentId}`);
    }, 2000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!orderSummary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Carrito Vacío
          </h1>
          <button
            onClick={() => navigate('/libros')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
          💳 Proceder al Pago
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Resumen de la Orden
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-slate-600">
                {orderSummary.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Impuestos (10%)</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Envío</span>
                  <span>${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-gray-200 dark:border-slate-600">
                  <span>Total</span>
                  <span>${orderSummary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  📦 Información de Envío
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Nombre:</strong> {user?.name}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Los artículos se entregarán dentro de 5-7 días hábiles.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-700 rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Método de Pago
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 rounded text-red-700 dark:text-red-200 text-sm">
                  {error}
                </div>
              )}

              {paymentSuccess && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded text-green-700 dark:text-green-200 text-sm">
                  ✅ Pago procesado exitosamente. Redirigiendo...
                </div>
              )}

              {!paymentSuccess && (
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    totalAmount={orderSummary.total}
                    orderId={orderSummary.orderId}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-3">
                  🔒 Tu información de pago es segura con Stripe
                </p>
                <div className="flex gap-2 justify-center">
                  <img
                    src="https://www.gstatic.com/authenticator/images/icon-credit-card@2x.png"
                    alt="Visa"
                    className="h-6"
                  />
                  <img
                    src="https://www.gstatic.com/authenticator/images/icon-mastercard@2x.png"
                    alt="Mastercard"
                    className="h-6"
                  />
                  <img
                    src="https://www.gstatic.com/authenticator/images/icon-amex@2x.png"
                    alt="Amex"
                    className="h-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
