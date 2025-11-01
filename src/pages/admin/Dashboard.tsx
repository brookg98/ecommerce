import { Link } from 'react-router-dom';
import { Package, Layers } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products */}
        <Link to="/admin/products" className="card hover:shadow-lg transition">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <Package size={32} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Manage Products</h2>
              <p className="text-gray-600">Add, edit, or delete products</p>
            </div>
          </div>
        </Link>

        {/* Categories */}
        <Link to="/admin/categories" className="card hover:shadow-lg transition">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <Layers size={32} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Manage Categories</h2>
              <p className="text-gray-600">Organize product categories</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
