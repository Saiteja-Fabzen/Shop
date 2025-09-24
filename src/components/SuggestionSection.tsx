interface SuggestionSectionProps {
  onSuggestProducts?: () => void;
}

export default function SuggestionSection({ onSuggestProducts }: SuggestionSectionProps) {
  const handleSuggestProducts = () => {
    window.open('https://tally.so/r/3ykGop', '_blank', 'noopener,noreferrer');
    if (onSuggestProducts) {
      onSuggestProducts();
    }
  };
  return (
    <div className="px-4 py-8">
      <div className="text-center mb-6">
        <div className="mb-4 relative">
          <div className="text-6xl">📦</div>
        </div>
        
        <h3 className="text-white text-[28px] font-bold mb-2 leading-tight">
          Didn&apos;t find what<br />
          you are looking<br />
          for?
        </h3>
      </div>
      
      <button
        onClick={handleSuggestProducts}
        className="w-full bg-gradient-button text-black font-semibold py-4 px-6 rounded-lg hover:opacity-90 transition-opacity"
      >
        Suggest Products
      </button>
    </div>
  );
}