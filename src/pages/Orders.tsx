import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { useAuthStore } from '../stores/authStore';
import { Loader } from '../components/Loader';
import { formatPrice } from '../utils/helpers';

export const Orders = () => {
  const { isAuthenticated } = useAuthStore();
  const { data: orders, isLoading } = useOrders();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Please login to view orders</p>
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

  if (!orders || orders.data.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No orders yet</p>
          <Link to="/" className="btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="space-y-4">
        {orders.data.map((order) => (
          <div key={order.id} className="card">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Order Info */}
              <div>
                <p className="text-sm text-gray-600">Order #</p>
                <p className="font-bold text-lg">{order.id}</p>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Total */}
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-bold text-lg text-blue-600">
                  {formatPrice(order.total_amount)}
                </p>
              </div>

              {/* View Details */}
              <Link
                to={`/orders/${order.id}`}
                className="btn-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
