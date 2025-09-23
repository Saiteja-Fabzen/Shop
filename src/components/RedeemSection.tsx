import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface RedeemSectionProps {
  products: Product[];
  onRedeem?: (productId: string) => void;
}

export default function RedeemSection({ products, onRedeem }: RedeemSectionProps) {
  return (
    <div className="px-4 py-6 ">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400 mb-2">
          REDEEM
        </h2>
        <h2 className="text-3xl font-bold text-white">
          THESE
        </h2>
        <div className="text-yellow-400 text-2xl">✨</div>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-32">
            <div className="bg-white rounded-lg p-3 mb-2 aspect-square flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">{product.name.slice(0, 2)}</span>
              </div>
            </div>
            <div className="text-white text-center">
              <p className="text-xs font-medium mb-1">{product.name}</p>
              <div className="flex items-center justify-center mb-2">
                <div className="flex items-center border border-yellow-300 bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-400 rounded-full px-2 py-1">
                  <div className="w-3 h-3 mr-1">
                    <Image
                      src="/images/gems.png"
                      alt="Gems"
                      width={12}
                      height={12}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-orange-800">{product.price}</span>
                </div>
                <span className="text-xs text-gray-300 ml-1">more required</span>
              </div>
              <button 
                onClick={() => onRedeem?.(product.id)}
                className="bg-gradient-button text-white text-xs font-bold py-1 px-3 rounded-md w-full hover:opacity-90 transition-opacity"
              >
                Top Up →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}