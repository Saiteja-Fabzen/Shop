'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { ApiProduct } from '@/types/api';
import { apiService } from '@/services/api';
import CustomLoader from '@/components/CustomLoader';
import ImageCarousel from '@/components/ImageCarousel';
import WalletButton from '@/components/WalletButton';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProductById(resolvedParams.id);
        setProduct(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return <CustomLoader fullScreen text="Loading product details..." size="lg" />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-400">{error || 'Product not found'}</div>
      </div>
    );
  }

  const handleRedeem = () => {
    router.push(`/checkout/${product?._id}`);
  };

  const handleBrandClick = () => {
    if (product?.brand) {
      router.push(`/brand/${encodeURIComponent(product.brand)}`);
    }
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };


  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        {/* Fixed Header */}
        <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 py-4 text-white bg-[#212464] z-10 border-b border-purple-700/30 h-16">
          <div className="flex items-center justify-between h-full">
            <button onClick={() => router.back()} className="p-2 -ml-2 flex-shrink-0">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center mx-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {product.name}
            </h1>
            <WalletButton size="small" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="pt-16 pb-24 overflow-y-auto">
        {/* Product Image Carousel */}
        <div className="bg-white mx-4 mt-4 rounded-lg p-6">
          <ImageCarousel images={product.images} productName={product.name} />
        </div>

        {/* Product Info */}
        <div className="px-4 py-6">
          <h2 className="text-white text-xl font-bold mb-2">{product.name}</h2>

          {/* Product Description */}
          {product.description && (
            <div className="mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                {isDescriptionExpanded
                  ? product.description
                  : product.description.length > 150
                    ? `${product.description.substring(0, 150)}...`
                    : product.description
                }
                {product.description.length > 150 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-yellow-400 font-medium ml-2 hover:text-yellow-300 transition-colors"
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </p>
            </div>
          )}

          <div className="flex items-center mb-4">
            <img
              src="/images/gems.png"
              alt="Gems"
              width={30}
              height={30}
              className="mr-1 flex-shrink-0"
              onError={(e) => {
                // Fallback to yellow circle if gems image not found
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-6 h-6 bg-yellow-500 rounded-full items-center justify-center mr-2 flex-shrink-0" style={{ display: 'none' }}>
              <span className="text-xs font-bold text-purple-900">₹</span>
            </div>
            <span className="text-white font-bold text-2xl">
              {product.price.toLocaleString()}
            </span>
            {!product.isAvailable && (
              <span className="ml-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-gray-400 text-sm ml-2">
                {product.rating} ({product.ratingsCount} reviews)
              </span>
            </div>
          </div>


          {/* Brand Link */}
          <button
            onClick={handleBrandClick}
            className="w-full bg-[#002E74] rounded-lg border-1 border-[#0053CF] p-4 mb-6 hover:bg-[#003080] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">{product.brand.charAt(0)}</span>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">{product.brand}</p>
                  <p className="text-purple-200 text-sm">{product.category.name}</p>
                </div>
              </div>
              <span className="text-white">›</span>
            </div>
          </button>

          {/* Product Details - Collapsible Sections */}
          <div className="space-y-4">
            {product.productDetails.map((detail, index) => (
              <div key={index} className="bg-[#002E74] rounded-lg border-1 border-[#0053CF]">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-[#003080] transition-colors"
                >
                  <h3 className="text-white text-lg font-semibold">{detail.section}</h3>
                  {expandedSections.has(index) ? (
                    <ChevronUp className="text-white" size={20} />
                  ) : (
                    <ChevronDown className="text-white" size={20} />
                  )}
                </button>
                {expandedSections.has(index) && (
                  <div className="px-4 pb-4">
                    <p className="text-purple-200 text-sm leading-relaxed">
                      {detail.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Fixed Redeem Button */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-[#002E74]">
          <button
            onClick={handleRedeem}
            className="w-full bg-gradient-button text-black font-bold py-4 px-6 rounded-full hover:opacity-90 transition-opacity"
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
}