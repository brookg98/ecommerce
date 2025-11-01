# E-commerce Frontend

A production-ready React + Vite e-commerce frontend with TypeScript, Tailwind CSS, and integrated API client for the FastAPI backend.

 Features

- User Authentication - Register, login, and persistent JWT-based sessions
- Product Browsing - List, search, filter, and view product details
- Shopping Cart - Add/remove items, update quantities with real-time totals
- Checkout Flow - Complete order creation and payment integration ready
- Order Management - View order history and status
- Admin Dashboard - Protected admin routes for product and category management
- Responsive Design - Mobile-first approach with Tailwind CSS
- Error Handling - Toast notifications for user feedback
- State Management - Zustand for auth/cart state with React Query for API calls

 Tech Stack

- Framework: React 18 with Vite
- Language: TypeScript
- Styling: Tailwind CSS
- State Management: Zustand + React Query
- Forms: React Hook Form + Zod validation
- HTTP Client: Axios
- Icons: Lucide React
- Notifications: React Hot Toast
- Routing: React Router v6

 Project Structure


src/
├── api/                      # API integration layer
│   ├── axiosClient.ts       # Axios instance with interceptors
│   ├── auth.ts              # Authentication endpoints
│   ├── products.ts          # Product endpoints
│   ├── cart.ts              # Cart endpoints
│   ├── orders.ts            # Order endpoints
│   └── payments.ts          # Payment endpoints
├── components/              # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── ProtectedRoute.tsx
│   ├── Loader.tsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts
│   ├── useProducts.ts
│   ├── useCart.ts
│   └── useOrders.ts
├── pages/                   # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Orders.tsx
│   └── admin/
│       ├── Dashboard.tsx
│       └── ManageProducts.tsx
├── stores/                  # Zustand state stores
│   ├── authStore.ts
│   └── cartStore.ts
├── styles/
│   └── index.css           # Global styles with Tailwind
├── utils/
│   ├── constants.ts        # App constants
│   └── helpers.ts          # Utility functions
├── App.tsx                 # Main app component with routing
└── main.tsx                # React entry point


 Getting Started

 Prerequisites

- Node.js 16+ and npm/yarn
- Running FastAPI backend at `http://localhost:8000/api/v1`

 Installation

1. Install dependencies

bash
npm install


2. Create environment file

bash
cp .env.example .env.local


3. Configure API URL

Edit `.env.local`:
env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=E-commerce Store


 Development

Start the development server:

bash
npm run dev


The app will open at `http://localhost:5173`

 Production Build

bash
npm run build


Output will be in the `dist/` directory.

 Preview Production Build

bash
npm run preview


 API Integration

 Axios Client

The `axiosClient` automatically:
- Adds JWT token from localStorage to all requests
- Handles 401 errors by redirecting to login
- Supports request/response interceptors

 Usage Example

typescript
import { useProducts } from './hooks/useProducts';

function MyComponent() {
  const { data: products, isLoading } = useProducts({
    search: 'laptop',
    category_id: 1,
  });

  return (
    <div>
      {isLoading ? <Loader /> : products?.data.map(p => <p>{p.name}</p>)}
    </div>
  );
}


 Authentication Flow

1. Register → User creates account
2. Login → Returns access & refresh tokens
3. Token Storage → Stored in localStorage
4. Auto-attach → Axios adds token to all requests
5. Session Management → Token persisted across page reloads
6. Logout → Clears tokens and redirects to home

 State Management

 Auth Store (Zustand)

typescript
const { user, isAuthenticated, login, logout } = useAuthStore();


 Cart Store (Zustand)

typescript
const { cart, addItem, removeItem, updateItem } = useCartStore();


 API Data (React Query)

typescript
const { data, isLoading, error } = useProducts();


 Pages Overview

 Public Pages
- Home (`/`) - Product listing with search and filters
- Login (`/login`) - User authentication
- Register (`/register`) - New user registration

 Protected Pages
- Cart (`/cart`) - Shopping cart with item management
- Checkout (`/checkout`) - Order summary and payment
- Orders (`/orders`) - User's order history

 Admin Pages
- Dashboard (`/admin/dashboard`) - Admin home
- Products (`/admin/products`) - CRUD for products

 Component Examples

 Using Protected Routes

typescript
<ProtectedRoute adminOnly>
  <AdminDashboard />
</ProtectedRoute>


 Using Hooks

typescript
const { register, handleSubmit } = useForm<FormData>();
const { addItem, isUpdating } = useCart();

const onSubmit = async (data) => {
  addItem({ product_id: 1, quantity: 1 });
};


 Styling with Tailwind

tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Click me
</button>


 Error Handling

Errors are displayed via toast notifications:

typescript
import toast from 'react-hot-toast';

try {
  await login(credentials);
} catch (error) {
  toast.error('Login failed');
}


 Deployment

 Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

 Netlify

bash
npm run build


Deploy the `dist/` folder.

 Docker

bash
docker build -f Dockerfile.frontend -t ecommerce-frontend .
docker run -p 80:80 ecommerce-frontend


 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | Application name | `E-commerce Store` |

 Performance Tips

1. Code Splitting - React Router provides automatic route-based splitting
2. Lazy Loading - Use React.lazy() for admin routes
3. Image Optimization - Use responsive images with proper formats
4. Caching - React Query caches API responses
5. Minification - Vite automatically minifies production builds

 Troubleshooting

 CORS Errors

Ensure backend allows frontend origin:
python
# In FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


 Token Expired

Tokens are automatically handled by the API client. If issues persist:
1. Clear browser localStorage
2. Log out and log back in
3. Check backend token expiration settings

 API Not Responding

1. Check if backend is running: `http://localhost:8000/health`
2. Verify `VITE_API_URL` in `.env.local`
3. Check browser console for CORS/network errors

 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push: `git push origin feature/amazing-feature`
4. Create Pull Request

 License

MIT License - see LICENSE file for details

 Support

For issues and questions, please open an issue on GitHub.
