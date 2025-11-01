import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useAuth } from '../hooks/useAuth';
import { useCartStore } from '../stores/cartStore';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cart = useCartStore((state) => state.cart);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-blue-600">
          Store
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`${
              isActive('/') ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600 transition`}
          >
            Home
          </Link>
          {isAuthenticated && user?.is_admin && (
            <Link
              to="/admin/dashboard"
              className={`${
                isActive('/admin/dashboard') ? 'text-blue-600' : 'text-gray-600'
              } hover:text-blue-600 transition`}
            >
              Admin
            </Link>
          )}
          <Link
            to="/orders"
            className={`${
              isActive('/orders') ? 'text-blue-600' : 'text-gray-600'
            } hover:text-blue-600 transition`}
          >
            Orders
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
            <ShoppingCart size={24} />
            {cart && cart.item_count > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.item_count}
              </span>
            )}
          </Link>

          {/* Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-600">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-4">
          <Link to="/" className="block text-gray-600 hover:text-blue-600">
            Home
          </Link>
          {isAuthenticated && user?.is_admin && (
            <Link
              to="/admin/dashboard"
              className="block text-gray-600 hover:text-blue-600"
            >
              Admin
            </Link>
          )}
          <Link to="/orders" className="block text-gray-600 hover:text-blue-600">
            Orders
          </Link>
          {isAuthenticated ? (
            <>
              <div className="border-t pt-4">
                <p className="text-gray-600 text-sm mb-2">{user?.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-gray-200 text-gray-800 py-2 px-4 rounded text-center hover:bg-gray-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
