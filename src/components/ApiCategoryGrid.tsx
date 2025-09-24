'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Category } from '@/types/api';
import { apiService } from '@/services/api';
import CustomLoader from './CustomLoader';

interface ApiCategoryGridProps {
  onCategorySelect?: (categoryId: string) => void;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  'All': 'https://img.icons8.com/3d-fluency/94/shop.png',
  'Electronics': 'https://img.icons8.com/3d-fluency/94/smartphone.png',
  'Home & Kitchen': 'https://img.icons8.com/3d-fluency/94/ingredients.png',
  'Fashion': 'https://img.icons8.com/3d-fluency/94/clothes.png',
  'Books': 'https://img.icons8.com/3d-fluency/94/ingredients.png',
  'Sports': 'https://img.icons8.com/3d-fluency/94/basketball.png',
  'Beauty': 'https://img.icons8.com/3d-fluency/94/lipstick.png',
  'Toys': 'https://img.icons8.com/3d-fluency/94/claw-machine.png',
  'Health': 'https://img.icons8.com/3d-fluency/94/dumbbell.png'
};

export default function ApiCategoryGrid({ onCategorySelect }: ApiCategoryGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCategories();
        setCategories(response.categories);
        setError(null);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-white text-xl font-bold mb-4">Top Categories</h3>
        <CustomLoader text="Loading categories..." size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-white text-xl font-bold mb-4">Top Categories</h3>
        <div className="text-red-400 text-center py-4">{error}</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="px-4 py-6">
        <h3 className="text-white text-xl font-bold mb-4">Top Categories</h3>
        <div className="text-gray-400 text-center py-4">No categories available</div>
      </div>
    );
  }

  // Create array with "All" category first, then API categories
  const allCategories = [
    { id: 'all', name: 'All' },
    ...categories.slice(0, 5) // Show 5 API categories + All = 6 total
  ];

  return (
    <div className="px-4 py-6">
      <h3 className="text-white text-xl font-bold mb-4">Top Categories</h3>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {allCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect?.(category.name)}
            className="transition-colors flex-shrink-0 min-w-[90px] flex flex-col"
          >
            <div className="bg-[#002E74] border-1 border-[#0053CF] rounded-full h-16 w-16 flex items-center justify-center mb-2 mx-auto p-2">
              <Image
                src={categoryIcons[category.name] || 'https://img.icons8.com/3d-fluency/94/smartphone.png'}
                alt={category.name}
                width={48}
                height={48}
                className="w-10 h-10"
              />
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