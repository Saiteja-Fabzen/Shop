interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryGridProps {
  categories: Category[];
  onCategorySelect?: (categoryId: string) => void;
}

export default function CategoryGrid({ categories, onCategorySelect }: CategoryGridProps) {
  return (
    <div className="px-4 py-6 bg-purple-900">
      <h3 className="text-white text-xl font-bold mb-4">Top Categories</h3>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {categories.slice(0, 6).map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className="transition-colors flex-shrink-0 min-w-[120px] flex flex-col p-4"
          >
            <div className="bg-purple-800 hover:bg-purple-700 rounded-full h-12 w-12 flex items-center justify-center mb-2 mx-auto p-2">
              <span className="text-xl">{category.icon}</span>
            </div>
            <div className="text-white font-medium text-center text-xs">
              {category.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}