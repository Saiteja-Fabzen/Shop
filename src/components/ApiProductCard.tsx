'use client';

import { useState } from 'react';
import { ApiProduct } from '@/types/api';

interface ApiProductCardProps {
  product: ApiProduct;
  onSelect?: (productId: string) => void;
  compact?: boolean;
}

export default function ApiProductCard({ product, onSelect, compact = false }: ApiProductCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  const handleClick = () => {
    if (onSelect) {
      onSelect(product._id);
    }
  };

  const cardWidth = compact ? 'w-40 min-w-40' : 'w-48 min-w-48';

  return (
    <div
      onClick={handleClick}
      className={`${cardWidth} flex-shrink-0 btn-scale bg-[#002E74] p-2 rounded-lg border-1 border-[#0053CF] cursor-pointer`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View ${product.name} - ₹${product.price.toLocaleString()}`}
    >
      <div className="bg-white rounded-lg p-3 mb-2 aspect-square relative">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={primaryImage?.url}
          alt={primaryImage?.altText || product.name}
          className="w-full h-full object-contain"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            setImageLoading(false);
            e.currentTarget.src = '/images/placeholder.png';
          }}
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-medium">Out of Stock</span>
          </div>
        )}
        {product.stock <= 5 && product.isAvailable && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="text-white">
        <p className="font-medium text-md mb-1 line-clamp-2">{product.name}</p>
        <div className="flex items-center">
          <img
            src="/images/gems.png"
            alt="Gems"
            width={26}
            height={26}
            className="mr-1 flex-shrink-0"
            onError={(e) => {
              // Fallback to yellow circle if gems image not found
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-1" style={{ display: 'none' }}>
            <span className="text-xs font-bold text-purple-900">₹</span>
          </div>
          <span className="font-bold text-md">
            {product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}