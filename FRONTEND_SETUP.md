# Frontend Setup Guide

 Quick Start

 1. Install Dependencies

bash
npm install


 2. Configure Environment

Copy the example environment file:

bash
cp .env.local .env.local


The default configuration connects to the local FastAPI backend:
env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=E-commerce Store


 3. Start Development Server

bash
npm run dev


Open http://localhost:5173 in your browser.

 Project Structure Overview

 `/src/api/` - API Integration
- `axiosClient.ts` - Configured Axios with JWT interceptors
- `auth.ts` - Authentication API methods
- `products.ts` - Product CRUD operations
- `cart.ts` - Shopping cart operations
- `orders.ts` - Order management
- `payments.ts` - Payment integration

 `/src/components/` - Reusable Components
- `Navbar.tsx` - Top navigation with cart and auth
- `Footer.tsx` - Global footer
- `ProductCard.tsx` - Product display card
- `ProtectedRoute.tsx` - Route protection for auth/admin
- `Loader.tsx` - Loading spinner

 `/src/pages/` - Page Components
- `Home.tsx` - Product listing with filters
- `Login.tsx` & `Register.tsx` - Auth pages
- `Cart.tsx` - Shopping cart view
- `Checkout.tsx` - Order creation
- `Orders.tsx` - Order history
- `admin/Dashboard.tsx` - Admin home
- `admin/ManageProducts.tsx` - Product management

 `/src/hooks/` - Custom Hooks
- `useAuth()` - Authentication logic
- `useProducts()` - Product queries with React Query
- `useCart()` - Cart mutations
- `useOrders()` - Order queries

 `/src/stores/` - State Management
- `authStore.ts` - Auth state with Zustand
- `cartStore.ts` - Cart state with Zustand

 `/src/utils/` - Helpers
- `constants.ts` - Routes and constants
- `helpers.ts` - Utility functions

 Key Features Implemented

 Authentication
 User registration and login
 JWT token management
 Persistent sessions with localStorage
 Protected routes
 Auto-logout on 401

 Product Management
 Product listing with search
 Category filtering
 Price range filtering
 Product details
 Admin CRUD operations

 Shopping Cart
 Add/remove items
 Update quantities
 Real-time totals
 7-day cart persistence (via backend)

 Checkout & Orders
 Order creation from cart
 Order history viewing
 Order status tracking
 Payment intent creation (Stripe-ready)

 Admin Dashboard
 Protected admin routes
 Product management (CRUD)
 Category management
 Product search and pagination

 Development Commands

bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint


 API Integration Examples

 Fetching Products

typescript
import { useProducts } from './hooks/useProducts';

function ProductList() {
  const { data: products, isLoading } = useProducts({
    search: 'laptop',
    category_id: 1,
    min_price: 100,
    max_price: 1000,
  });

  if (isLoading) return <Loader />;

  return products?.data.map(p => <ProductCard product={p} />);
}


 Adding to Cart

typescript
import { useCart } from './hooks/useCart';

function ProductCard({ product }) {
  const { addItem, isUpdating } = useCart();

  return (
    <button
      onClick={() => addItem({ product_id: product.id, quantity: 1 })}
      disabled={isUpdating}
    >
      Add to Cart
    </button>
  );
}


 User Authentication

typescript
import { useAuth } from './hooks/useAuth';

function LoginForm() {
  const { login } = useAuth();

  const handleLogin = async (email, password) => {
    await login({ email, password });
    // Auto-redirects to home or admin dashboard
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin('user@example.com', 'password123');
    }}>
      {/* Form fields */}
    </form>
  );
}


 Styling with Tailwind CSS

All components use Tailwind CSS classes. Common utilities:

tsx
// Colors
className="text-blue-600 bg-gray-100 hover:bg-gray-200"

// Spacing
className="p-4 m-2 space-x-4"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Utilities
className="rounded-lg shadow-sm border border-gray-200"


Custom utility classes are defined in `/src/styles/index.css`:
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input-field` - Form input
- `.card` - Card component

 Error Handling & Toast Notifications

Errors are displayed via React Hot Toast:

typescript
import toast from 'react-hot-toast';

try {
  await login(credentials);
  toast.success('Login successful!');
} catch (error) {
  toast.error(error.response?.data?.detail || 'Login failed');
}


Toast appears in top-right corner automatically.

 Performance Optimizations

1. React Query Caching - API responses cached and reused
2. Code Splitting - Automatic route-based splitting with React Router
3. Image Optimization - Lazy loading ready (add `loading="lazy"` to img tags)
4. Type Safety - Full TypeScript support prevents runtime errors
5. Minification - Vite minifies all code in production builds

 Testing the Full Flow

1. Register: Visit `/register` and create an account
2. Login: Visit `/login` with your credentials
3. Browse: Homepage shows products with filters
4. Add to Cart: Click shopping cart icon on any product
5. View Cart: Navigate to `/cart` to see items
6. Checkout: Proceed to `/checkout` to create order
7. Orders: View order history at `/orders`
8. Admin: If admin user, access `/admin/dashboard`

 Deployment

 Build for Production

bash
npm run build


Output files are in `/dist/` directory.

 Deploy to Vercel

bash
vercel deploy --prod


 Deploy to Netlify

bash
npm run build
# Upload the 'dist' folder to Netlify


 Docker Deployment

bash
docker build -f Dockerfile.frontend -t ecommerce-frontend .
docker run -p 80:80 ecommerce-frontend


 Environment Variables

Create `.env.local` with:

env
# Backend API URL
VITE_API_URL=http://localhost:8000/api/v1

# Application name (shown in browser title, etc.)
VITE_APP_NAME=E-commerce Store


For production, update the API URL to your deployed backend.

 Troubleshooting

 "Cannot find module" errors
bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install


 CORS errors
- Ensure backend CORS is configured for your frontend origin
- Check `VITE_API_URL` is correct
- Check browser console for actual error

 Blank page
- Check browser console for errors (F12)
- Verify backend is running: `curl http://localhost:8000/health`
- Check network tab to see if API calls are working

 Token not persisting
- Check browser localStorage (F12 → Application → Storage)
- Verify backend JWT settings are correct
- Try logging out and back in

 Browser DevTools

 React Developer Tools
Install browser extension to inspect React components in DevTools.

 Network Tab
Monitor API calls to debug integration issues.

 Local Storage
View stored tokens and user data.

 Next Steps

1. Connect real Stripe payments for checkout
2. Add image uploads for products
3. Implement email notifications
4. Add product reviews and ratings
5. Implement wishlist feature
6. Add inventory management
7. Create customer support chat
8. Add analytics tracking

 Support & Documentation

- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com
- React Query: https://tanstack.com/query
- Zustand: https://github.com/pmndrs/zustand
