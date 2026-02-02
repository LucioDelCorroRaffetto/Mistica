import { useState, useEffect, type FormEvent } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import './PaymentForm.css';

interface PaymentFormProps {
  amount?: number;
  totalAmount?: number;
  orderId: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

export default function PaymentForm({
  amount,
  totalAmount,
  orderId,
  onSuccess,
  onError,
  isLoading = false,
}: PaymentFormProps) {
  const effectiveAmount = amount ?? totalAmount ?? 0;
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  useEffect(() => {
    // Crear un PaymentIntent en el servidor
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            amount: (amount ?? totalAmount) || 0,
            orderId,
            description: `Order ${orderId}`,
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment');
        console.error(err);
      }
    };

    if (effectiveAmount > 0) {
      createPaymentIntent();
    }
  }, [amount, orderId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setError('Payment system not ready');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: cardholderName,
              email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        if (onError) onError(stripeError.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirmar pago en el backend
        const response = await fetch('/api/payments/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          if (onSuccess) onSuccess(paymentIntent.id);
        } else {
          setError('Failed to confirm payment');
          if (onError) onError('Failed to confirm payment');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing error');
      if (onError) onError(err.message || 'Payment processing error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          required
          disabled={processing || isLoading}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          required
          disabled={processing || isLoading}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>Card Details</label>
        <div className="card-element-wrapper">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="amount-display">
        <span>Total Amount:</span>
        <span className="amount">${effectiveAmount.toFixed(2)}</span>
      </div>

      <button
        type="submit"
        disabled={processing || isLoading || !stripe || !clientSecret}
        className="btn-submit"
      >
        {processing || isLoading ? 'Processing...' : `Pay $${effectiveAmount.toFixed(2)}`}
      </button>
    </form>
  );
}
