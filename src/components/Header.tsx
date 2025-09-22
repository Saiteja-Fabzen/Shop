import { ShoppingBag, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  balance: number;
  onAddBalance?: () => void;
}

export default function Header({ balance = 0, onAddBalance }: HeaderProps) {
  const router = useRouter();

  const handleOrdersClick = () => {
    router.push('/orders');
  };

  return (
    <header className="px-4 py-3 text-white safe-top">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Shop</h1>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-purple-700/50 rounded-full px-3 py-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-xs font-bold text-purple-900">₹</span>
            </div>
            <span className="font-bold">{balance}</span>
            <button 
              onClick={onAddBalance}
              className="ml-2 p-1 hover:bg-purple-600/50 rounded-full transition-colors tap-target btn-scale"
              aria-label="Add balance"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-3 mt-3 overflow-x-auto">
        <button
          onClick={handleOrdersClick}
          className="flex items-center space-x-2 bg-purple-700/50 rounded-lg px-3 py-2 text-sm hover:bg-purple-600/50 transition-colors btn-scale tap-target flex-shrink-0"
        >
          <ShoppingBag size={16} />
          <span>Orders</span>
        </button>
        <button className="flex items-center space-x-2 bg-purple-700/50 rounded-lg px-3 py-2 text-sm hover:bg-purple-600/50 transition-colors btn-scale tap-target flex-shrink-0">
          <span>❓</span>
          <span>Need help?</span>
        </button>
      </div>
    </header>
  );
}