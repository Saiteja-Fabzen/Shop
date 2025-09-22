'use client';

import { useEffect, useState } from 'react';
import { ApiProduct } from '@/types/api';
import { apiService } from '@/services/api';
import ApiProductCard from './ApiProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';

interface ApiProductSectionProps {
  title: string;
  category?: string;
  brand?: string;
  limit?: number;
  onProductSelect?: (productId: string) => void;
  onViewMore?: () => void;
  showViewMore?: boolean;
}

export default function ApiProductSection({
  title,
  category,
  brand,
  limit = 10,
  onProductSelect,
  onViewMore,
  showViewMore = true,
}: ApiProductSectionProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts({
          category,
          brand,
          limit,
          available: true
        });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, brand, limit]);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-bold">{title}</h3>
          {showViewMore && (
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse" />
          )}
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <ProductCardSkeleton compact count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-white text-xl font-bold mb-4">{title}</h3>
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-white text-xl font-bold mb-4">{title}</h3>
        <div className="text-gray-400">No products available</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">{title}</h3>
        {showViewMore && (
          <button
            onClick={onViewMore}
            className="text-purple-200 text-sm"
          >
            View More
          </button>
        )}
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4" style={{ width: 'calc(100% + 2rem)' }}>
          {products.map((product) => (
            <ApiProductCard
              key={product._id}
              product={product}
              onSelect={onProductSelect}
              compact
            />
          ))}
        </div>
      </div>
    </div>
  );
}