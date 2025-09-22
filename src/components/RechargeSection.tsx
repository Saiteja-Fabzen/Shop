interface RechargeProvider {
  id: string;
  name: string;
  color: string;
}

interface RechargeSectionProps {
  providers: RechargeProvider[];
  onRecharge?: (providerId: string) => void;
}

export default function RechargeSection({ providers, onRecharge }: RechargeSectionProps) {
  return (
    <div className="px-4 py-6 bg-purple-900">
      <h3 className="text-white text-xl font-bold mb-4">Ready, Set, Recharge!</h3>
      
      <div className="flex space-x-4">
        {providers.map((provider) => (
          <button
            key={provider.id}
            onClick={() => onRecharge?.(provider.id)}
            className="flex-1 bg-purple-800 rounded-xl p-4 hover:bg-purple-700 transition-colors"
          >
            <div className="text-white font-medium mb-2">{provider.name}</div>
            <div 
              className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center"
              style={{ backgroundColor: provider.color }}
            >
              <span className="text-white text-xs font-bold">
                {provider.name.slice(0, 2)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}