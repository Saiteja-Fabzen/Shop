'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ApiProduct } from '@/types/api';
import { apiService } from '@/services/api';
import ApiProductCard from '@/components/ApiProductCard';
import CustomLoader from '@/components/CustomLoader';

export default function BrandProductsPage({ params }: { params: Promise<{ name: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const brandName = decodeURIComponent(resolvedParams.name);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProducts({
          brand: brandName,
          limit: 50,
          skip: 0
        });
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load brand products');
        console.error('Error fetching brand products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProducts();
  }, [brandName]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return <CustomLoader fullScreen text="Loading brand products..." size="lg" />;
  }

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        <header className="px-4 py-3 text-white safe-top">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-purple-700/50 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-bold">{brandName} Products</h1>
          </div>
        </header>

        <main className="px-4 py-6">
          {error ? (
            <div className="text-center py-8">
              <div className="bg-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-red-300">{error}</p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-white text-xl font-semibold mb-2">No Products Found</h2>
              <p className="text-gray-400 mb-6">No products available for {brandName}</p>
              <button
                onClick={() => router.push('/')}
                className="bg-gradient-button text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                Browse All Products
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-gray-300 text-sm">
                  {products.length} product{products.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <ApiProductCard
                    key={product._id}
                    product={product}
                    onClick={() => handleProductClick(product._id)}
                    cardWidth="w-full"
                  />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}