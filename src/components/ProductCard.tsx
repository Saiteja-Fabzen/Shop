import { ApiProduct } from '@/types/api';
import Image from 'next/image';

interface ProductCardProps {
  product: ApiProduct;
  onSelect?: (productId: string) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onSelect, compact = false }: ProductCardProps) {
  const cardWidth = compact ? 'w-40 min-w-40' : 'w-48 min-w-48';
  
  return (
    <div 
      className={`${cardWidth} flex-shrink-0 btn-scale bg-[#002E74] p-2 rounded-lg border-1 border-[#0053CF]`}
      onClick={() => onSelect?.(product._id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.(product._id);
        }
      }}
      aria-label={`View ${product.name} - ₹${product.price.toLocaleString()}`}
    >
      <div className="bg-white rounded-lg p-3 mb-2 aspect-square">
        <Image 
        src={product.images[0]?.url || '/images/placeholder.png'}
        alt={product.name}
      width={100}
      height={100}
      className="w-full h-full object-contain"
        />
      </div>
      
      <div className="text-white">
        <p className="font-medium text-md mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</p>
        <div className="flex items-center">
          <Image
            src="/images/gems.png"
            alt="Gems"
            width={26}
            height={26}
            className="mr-1 flex-shrink-0"
          />
          <span className="font-bold text-md">
            {product.price.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}