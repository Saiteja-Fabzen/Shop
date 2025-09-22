import { Home, ShoppingBag, Wallet } from 'lucide-react';

interface NavigationProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navigation({ activeTab = 'shop', onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-purple-900 border-t border-purple-700 safe-bottom">
      <div className="flex justify-around py-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange?.(id)}
            className={`flex flex-col items-center py-2 px-4 min-w-0 flex-1 tap-target btn-scale transition-colors ${
              activeTab === id ? 'text-white' : 'text-purple-300 hover:text-purple-100'
            }`}
            aria-label={`Navigate to ${label}`}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon size={20} className="mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}