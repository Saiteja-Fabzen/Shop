import { ApiProduct } from '@/types/api';
import ProductCard from './ProductCard';

interface BrandSectionProps {
  brandName: string;
  tagline: string;
  products: ApiProduct[];
  onProductSelect?: (productId: string) => void;
  onViewAll?: () => void;
  bgColor?: string;
}

export default function BrandSection({ 
  brandName, 
  tagline, 
  products, 
  onProductSelect, 
  onViewAll,
  bgColor = "bg-purple-900"
}: BrandSectionProps) {
  return (
    <div className={`px-4 py-6 ${bgColor}`}>
      <div className="text-center mb-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-2 border-purple-500/30"></div>
          </div>
          <div className="relative z-10 py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-yellow-400 font-bold text-lg">
                {brandName.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
        
        <h3 className="text-white text-2xl font-bold mb-1">{brandName}</h3>
        <p className="text-purple-200 text-sm">{tagline}</p>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onSelect={onProductSelect}
            compact
          />
        ))}
      </div>
      
      {onViewAll && (
        <button 
          onClick={onViewAll}
          className="w-full bg-gradient-button text-white font-bold py-3 px-6 rounded-lg mt-4 hover:opacity-90 transition-opacity"
        >
          View All
        </button>
      )}
    </div>
  );
}