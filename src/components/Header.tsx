import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import WalletButton from './WalletButton';

export default function Header() {
  const router = useRouter();

  const handleOrdersClick = () => {
    router.push('/orders');
  };

  return (
    <header className="px-4 py-3 mt-4 text-white safe-top">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Shop</h1>
        
        <div className="flex items-center space-x-2">
          <WalletButton size="small" />
        </div>
      </div>
      
      <div className="flex space-x-3 mt-3 overflow-x-auto">
        <button
          onClick={handleOrdersClick}
          className="flex items-center space-x-2 bg-[#002E74] border-1 border-[#0053CF] rounded-lg px-3 py-2 text-sm transition-colors btn-scale tap-target flex-shrink-0"
        >
          <ShoppingBag size={16} />
          <span>Orders</span>
        </button>
        <button className="flex items-center space-x-2 bg-[#002E74] border-1 border-[#0053CF] rounded-lg px-3 py-2 text-sm transition-colors btn-scale tap-target flex-shrink-0">
          <span>❓</span>
          <span>Need help?</span>
        </button>
      </div>
    </header>
  );
}