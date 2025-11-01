import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { ProductCard } from '../components/ProductCard';
import { Loader } from '../components/Loader';
import { Product } from '../api/products';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') ? Number(searchParams.get('category')) : undefined
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined);
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined);

  const { data: products, isLoading: productsLoading } = useProducts({
    search: search || undefined,
    category_id: selectedCategory,
    min_price: minPrice,
    max_price: maxPrice,
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { addItem, isUpdating } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCategory) params.set('category', selectedCategory.toString());
    if (minPrice) params.set('min_price', minPrice.toString());
    if (maxPrice) params.set('max_price', maxPrice.toString());
    setSearchParams(params);
  };

  const handleAddToCart = (product: Product) => {
    addItem({ product_id: product.id, quantity: 1 });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-lg opacity-90">
            Discover amazing products at great prices
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 py-6 sticky top-0 z-40">
        <div className="container">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button
                type="submit"
                className="btn-primary"
              >
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category */}
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : undefined)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories?.data?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Min Price */}
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice || ''}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="input-field"
            />

            {/* Max Price */}
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice || ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              className="input-field"
            />

            {/* Filter Button */}
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-12 flex-1">
        {productsLoading ? (
          <Loader />
        ) : !products || products.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <Link to="/" className="btn-primary inline-block">
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isLoading={isUpdating}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
