import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../api/products';
import { formatPrice, truncate } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isLoading?: boolean;
}

export const ProductCard = ({
  product,
  onAddToCart,
  isLoading = false,
}: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition hover:border-gray-300">
      {/* Image */}
      <div className="bg-gray-100 h-48 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-sm">No image</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <Link
          to={`/products/${product.id}`}
          className="text-lg font-semibold text-gray-800 hover:text-blue-600 block"
        >
          {truncate(product.name, 40)}
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm">{truncate(product.description, 60)}</p>
        )}

        {/* Stock */}
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-medium ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0 || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition flex items-center space-x-1"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
