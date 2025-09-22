'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ApiProduct } from '@/types/api';
import { apiService } from '@/services/api';
import ApiProductCard from '@/components/ApiProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import CustomLoader from '@/components/CustomLoader';

export default function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const categoryName = decodeURIComponent(resolvedParams.name);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    fetchProducts(1, true);
  }, [categoryName]);

  const fetchProducts = async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params: any = {
        limit,
        page: pageNum,
        available: true
      };

      // Add category or brand filter based on the category name
      if (categoryName === 'All') {
        // No filter for "All" - show all products
      } else if (categoryName.includes('Products')) {
        // Handle brand-specific categories like "Realme Products"
        const brandName = categoryName.replace(' Products', '');
        params.brand = brandName;
      } else {
        // Handle regular categories
        params.category = categoryName;
      }

      const response = await apiService.getProducts(params);

      if (reset) {
        setProducts(response.data);
      } else {
        setProducts(prev => [...prev, ...response.data]);
      }

      setHasMore(response.data.length === limit);
      setPage(pageNum);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(page + 1, false);
    }
  };

  const handleProductSelect = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return <CustomLoader fullScreen text="Loading products..." size="lg" />;
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        {/* Fixed Header */}
        <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-3 text-white bg-[#212464] z-10 border-b border-purple-700/30 h-16">
          <div className="flex items-start justify-between h-full">
            <button onClick={() => router.back()} className="p-2 -ml-2 mt-1 flex-shrink-0">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center mx-2 leading-tight line-clamp-2 overflow-hidden">
              {categoryName}
            </h1>
            <div className="flex items-center bg-purple-700/50 rounded-full px-3 py-2 flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs font-bold text-purple-900">₹</span>
              </div>
              <span className="font-bold">1</span>
              <button className="ml-2 text-lg">+</button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="pt-16 pb-24 overflow-y-auto">
          <div className="px-4 py-6">
          {error ? (
            <div className="text-red-400 text-center py-8">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
              No products found in {categoryName}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {products.map((product) => (
                  <div key={product._id} className="w-full">
                    <ApiProductCard
                      product={product}
                      onSelect={handleProductSelect}
                    />
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
            )}
          </div>
        </div>

        {/* Fixed Footer - matches product page spacing */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-[#002E74]">
          <div className="text-center">
            <span className="text-purple-200 text-sm">
              {products.length} products found in {categoryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}