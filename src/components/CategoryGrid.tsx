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
      
      <div className="grid grid-cols-2 gap-4">
        {categories.slice(0, 6).map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.id)}
            className="bg-purple-800 rounded-xl p-4 hover:bg-purple-700 transition-colors"
          >
            <div className="text-white font-medium mb-2 text-left text-sm">
              {category.name}
            </div>
            <div className="bg-purple-600 rounded-lg h-16 flex items-center justify-center">
              <span className="text-2xl">{category.icon}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}