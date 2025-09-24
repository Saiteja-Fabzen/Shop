import { ApiProduct } from '@/types/api';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  products: ApiProduct[];
  onProductSelect?: (productId: string) => void;
  onViewMore?: () => void;
  showViewMore?: boolean;
  bgColor?: string;
}

export default function ProductSection({ 
  title, 
  products, 
  onProductSelect, 
  onViewMore, 
  showViewMore = true,
}: ProductSectionProps) {
  return (
    <div className={`px-4 py-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">{title}</h3>
        {showViewMore && (
          <button
            onClick={onViewMore}
            className="text-yellow-400 text-sm font-medium"
          >
            View More
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-4" style={{ width: 'calc(100% + 2rem)' }}>
          {products.map((product) => (
            <ProductCard
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