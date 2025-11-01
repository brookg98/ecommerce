import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCreateOrder } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { Loader } from '../components/Loader';
import { formatPrice } from '../utils/helpers';
import { paymentsAPI } from '../api/payments';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart, isLoading: cartLoading } = useCart();
  const createOrderMutation = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      setIsProcessing(true);

      const orderResponse = await createOrderMutation.mutateAsync();

      const paymentResponse = await paymentsAPI.createIntent({
        order_id: orderResponse.data.id,
      });

      toast.success(
        'Order created! Payment intent ready. (Demo: This would redirect to Stripe)'
      );

      setTimeout(() => {
        navigate(`/orders/${orderResponse.data.id}`);
      }, 1500);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading) {
    return <Loader fullScreen />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center pb-4 border-b border-gray-200"
                >
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity} × {formatPrice(item.unit_price)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(Number(item.unit_price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            <p className="text-gray-600 text-sm">
              (Demo: In production, this would be a full form)
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
              Standard shipping will be calculated after order confirmation.
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div>
          <div className="card sticky top-20 space-y-4">
            <h2 className="text-xl font-bold">Payment Summary</h2>

            <div className="space-y-2 text-gray-600 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(cart.total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full btn-primary disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
