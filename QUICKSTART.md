 E-commerce Frontend - Quick Start Guide

 5-Minute Setup

 1. Install Dependencies
bash
npm install


 2. Start Backend (if not running)
bash
 In another terminal
cd ../   Go to project root
docker-compose up


 3. Start Frontend
bash
npm run dev


Open http://localhost:5173 in your browser.



 What's Included

  Authentication
- User registration and login
- JWT token management with localStorage
- Auto-login on page reload
- Protected routes with admin checks

  Product Features
- List products with search
- Filter by category and price range
- Product cards with images
- Add to cart directly from product list

  Shopping Cart
- Add/remove items
- Update quantities with +/- buttons
- Real-time total calculation
- Cart persists on backend

  Checkout & Orders
- Complete checkout flow
- Order creation from cart
- Order history viewing
- Payment intent creation (Stripe-ready)

  Admin Dashboard
- Protected admin routes
- Add/edit/delete products
- Manage categories
- Product CRUD operations



File Structure at a Glance


src/
 api/               API endpoints
   axiosClient.ts          HTTP client with JWT interceptor
   auth.ts                 Login, register, etc.
   products.ts             Product operations
   cart.ts                 Cart operations
   orders.ts               Order operations
 payments.ts             Payment operations

 components/        Reusable components
   Navbar.tsx              Header with cart & auth
   Footer.tsx              Global footer
   ProductCard.tsx         Product display
   ProtectedRoute.tsx      Auth guard
 Loader.tsx              Loading spinner

 hooks/             Custom React hooks
   useAuth.ts              Auth operations
   useProducts.ts          Product queries
   useCart.ts              Cart mutations
 useOrders.ts            Order queries

 stores/            Zustand state stores
   authStore.ts            User state
 cartStore.ts            Cart state

 pages/             Page components
   Home.tsx                Product listing
   Login.tsx               Login form
   Register.tsx            Registration form
   Cart.tsx                Shopping cart
   Checkout.tsx            Order summary
   Orders.tsx              Order history
 admin/
       Dashboard.tsx       Admin home
     ManageProducts.tsx  Product CRUD

 utils/             Helpers
   constants.ts            Routes, constants
 helpers.ts              Utility functions

 styles/            Global styles
 index.css               Tailwind + custom

 App.tsx            Main app with routing
 main.tsx           React entry point




 Quick Workflows

 Test User Flow

1. Go to http://localhost:5173/register
2. Create account: test@example.com / password123
3. You'll be redirected to login
4. Login with same credentials
5. Browse products on home page
6. Add item to cart
7. Go to Cart page (/cart)
8. Proceed to Checkout
9. Complete order
10. View in Orders page


 Test Admin Flow

1. Ensure you have admin user (set is_admin=true in DB)
2. Login with admin user
3. You'll see "Admin" link in navbar
4. Click to go to /admin/dashboard
5. Navigate to "Manage Products"
6. Add, edit, or delete products




 Configuration

 Environment File (.env.local)
env
 Backend API URL
VITE_API_URL=http://localhost:8000/api/v1

 App name (appears in pages)
VITE_APP_NAME=E-commerce Store


For production:
env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_APP_NAME=Your Store Name




 Common Tasks

 Add a New Product Filter
Edit `src/pages/Home.tsx`:
typescript
// Add filter input
<input
  type="text"
  placeholder="Brand"
  value={brand}
  onChange={(e) => setBrand(e.target.value)}
/>

// Pass to API
const { data: products } = useProducts({
  search: search,
  category_id: selectedCategory,
  min_price: minPrice,
  max_price: maxPrice,
  brand: brand,  // NEW
});


 Customize Styling
All styles use Tailwind CSS. Edit in component files:
tsx
<div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
  Button
</div>


Global styles in `src/styles/index.css`:
css
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200;
}


 Show Loading State
typescript
import { Loader } from '../components/Loader';

if (isLoading) return <Loader />;
if (isLoading) return <Loader fullScreen />;  // Full screen spinner


 Display Notifications
typescript
import toast from 'react-hot-toast';

toast.success('Item added to cart!');
toast.error('Failed to add item');
toast.loading('Processing...');




 API Integration

 Making API Calls
typescript
// Products
const { data: products } = useProducts({ search: 'laptop' });
await productsAPI.create(productData);  // Admin
await productsAPI.update(id, productData);  // Admin

// Cart
const { addItem, removeItem, updateItem } = useCart();
addItem({ product_id: 123, quantity: 1 });

// Orders
const { data: orders } = useOrders();
const createOrder = useCreateOrder();


 Authentication
typescript
const { login, register, logout, user, isAuthenticated } = useAuth();

await login({ email: 'user@example.com', password: 'password' });
await register({ email, password, full_name });
logout();


 Error Handling
Errors automatically show as toast notifications. For custom handling:
typescript
try {
  await login(credentials);
} catch (error) {
  const message = error.response?.data?.detail  'Error';
  console.error(message);
}




 Deployment

 Build for Production
bash
npm run build


Creates optimized files in `dist/` folder.

 Deploy to Vercel
bash
npm install -g vercel
vercel deploy --prod


 Deploy to Netlify
bash
npm run build
 Drag & drop 'dist' folder to Netlify


 Deploy with Docker
bash
docker build -f Dockerfile.frontend -t ecommerce-frontend .
docker run -p 3000:80 ecommerce-frontend




Development Commands

 Command  Purpose 

 `npm run dev`  Start dev server (port 5173) 
 `npm run build`  Build for production 
 `npm run preview`  Preview production build 
 `npm run lint`  Lint code 
 `npm run type-check`  TypeScript validation 



 Troubleshooting

 "Cannot connect to backend"
bash
 Check backend is running
curl http://localhost:8000/health

 Verify VITE_API_URL in .env.local
 Should be: http://localhost:8000/api/v1


 "CORS error"
Backend must allow your frontend origin:
python
 In FastAPI backend (app/main.py)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=[""],
    allow_headers=[""],
)


 "Blank page / nothing loads"
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - are API calls working?
4. Try clearing localStorage: `localStorage.clear()`

 "Can't login / Token not saving"
1. Check if backend returns tokens in login response
2. Verify localStorage is enabled (not private mode)
3. Check browser console for auth errors

 "Admin links not showing"
1. User must have `is_admin: true` in database
2. Try logging out and back in
3. Check user data: open DevTools  Application  Local Storage  look for 'user'



 Key Technologies

 Tech  Purpose 

 React 18  UI framework 
 Vite  Build tool (fast!) 
 React Router  Client-side routing 
 React Query  Server state management 
 Zustand  Client state management 
 Axios  HTTP client 
 Tailwind CSS  Styling 
 React Hook Form  Form validation 
 Zod  Schema validation 
 Lucide React  Icons 
 React Hot Toast  Notifications 



 Next Steps

1. Test the full flow - Register, browse, add to cart, checkout
2. Test admin features - Add/edit products
3. Customize styling - Update Tailwind colors, fonts
4. Add more filters - Brand, rating, etc.
5. Connect real Stripe - Replace mock payment
6. Deploy - Push to Vercel/Netlify/Docker



  Full Documentation

- Frontend Details: See `README_FRONTEND.md`
- Setup Guide: See `FRONTEND_SETUP.md`
- Backend Docs: See `README.md` (in parent directory)



 Support

 Check the Docs First
- React: https://react.dev
- Tailwind: https://tailwindcss.com
- React Query: https://tanstack.com/query
- Axios: https://axios-http.com

 Common Issues
- CORS  Check backend middleware
- 401 errors  Token expired, login again
- API not found  Check VITE_API_URL
- Component not rendering  Check console for errors



 You're All Set!

The frontend is production-ready and fully connected to the FastAPI backend.


npm install && npm run dev


Open http://localhost:5173 and start shopping! 
