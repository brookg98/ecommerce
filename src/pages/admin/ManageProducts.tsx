import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProducts, useCategories } from '../../hooks/useProducts';
import { productsAPI } from '../../api/products';
import { Loader } from '../../components/Loader';
import { Product } from '../../api/products';
import { Trash2, Edit2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/helpers';

const productSchema = z.object({
  sku: z.string().min(1, 'SKU required'),
  name: z.string().min(1, 'Name required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  category_id: z.number().optional(),
  image_url: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ManageProducts = () => {
  const { data: products, isLoading: productsLoading, refetch } = useProducts({ limit: 1000 });
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingId) {
        await productsAPI.update(editingId, data);
        toast.success('Product updated');
      } else {
        await productsAPI.create(data);
        toast.success('Product created');
      }
      reset();
      setEditingId(null);
      setIsFormOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Error saving product');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted');
        refetch();
      } catch {
        toast.error('Error deleting product');
      }
    }
  };

  const handleEdit = (product: Product) => {
    reset({
      sku: product.sku,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stock: product.stock,
      category_id: product.category_id,
      image_url: product.image_url,
    });
    setEditingId(product.id);
    setIsFormOpen(true);
  };

  if (productsLoading || categoriesLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <button
          onClick={() => {
            reset();
            setEditingId(null);
            setIsFormOpen(!isFormOpen);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>{isFormOpen ? 'Cancel' : 'Add Product'}</span>
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="card mb-8 p-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium mb-1">SKU</label>
                <input {...register('sku')} className="input-field" />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input {...register('name')} className="input-field" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="input-field"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <input
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  className="input-field"
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select {...register('category_id', { valueAsNumber: true })} className="input-field">
                  <option value="">Select a category</option>
                  {categories?.data?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input {...register('image_url')} className="input-field" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea {...register('description')} className="input-field" rows={3} />
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setIsFormOpen(false);
                  setEditingId(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      {!products || products.data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No products yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-2 text-left">SKU</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.data.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
