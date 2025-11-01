import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuthStore } from '../stores/authStore';
import { Loader } from '../components/Loader';
import { formatPrice } from '../utils/helpers';

export const Cart = () => {
  const { isAuthenticated } = useAuthStore();
  const { cart, isLoading, removeItem, updateItem, isUpdating } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view your cart</p>
          <Link to="/login" className="btn-primary inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
          <Link to="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.product_id} className="card flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product_name}</h3>
                  <p className="text-gray-600">
                    {formatPrice(item.unit_price)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-3 bg-gray-100 px-3 py-2 rounded">
                  <button
                    onClick={() =>
                      updateItem({
                        productId: item.product_id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    disabled={isUpdating}
                    className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItem({
                        productId: item.product_id,
                        quantity: item.quantity + 1,
                      })
                    }
                    disabled={isUpdating}
                    className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Total */}
                <div className="text-right w-24">
                  <p className="font-semibold text-lg">
                    {formatPrice(Number(item.unit_price) * item.quantity)}
                  </p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.product_id)}
                  disabled={isUpdating}
                  className="ml-4 text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card sticky top-20 space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>

            {/* Items */}
            <div className="flex justify-between text-gray-600">
              <span>Items ({cart.item_count}):</span>
              <span>{formatPrice(cart.total)}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(cart.total)}
              </span>
            </div>

            {/* Checkout */}
            <Link to="/checkout" className="btn-primary w-full text-center block">
              Proceed to Checkout
            </Link>

            {/* Continue Shopping */}
            <Link to="/" className="btn-secondary w-full text-center block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
