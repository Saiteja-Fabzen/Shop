'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ApiCategoryGrid from '@/components/ApiCategoryGrid';
import ApiProductSection from '@/components/ApiProductSection';
import SuggestionSection from '@/components/SuggestionSection';

export default function HomePage() {
  const router = useRouter();

  const handleProductSelect = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleCategorySelect = (categoryName: string) => {
    router.push(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleSuggestProducts = () => {
    console.log('Suggest products clicked');
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md mx-auto bg-gradient-to-b from-[#1a1a2e] to-[#16213e] min-h-screen">
        <Header />

        <main className="overflow-auto">
        <ApiCategoryGrid onCategorySelect={handleCategorySelect} />

        <ApiProductSection
          title="Electronics"
          category="Electronics"
          limit={10}
          onProductSelect={handleProductSelect}
          onViewMore={() => router.push('/category/Electronics')}
        />

        <ApiProductSection
          title="Home & Kitchen"
          category="Home & Kitchen"
          limit={10}
          onProductSelect={handleProductSelect}
          onViewMore={() => router.push('/category/Home%20%26%20Kitchen')}
        />

        <ApiProductSection
          title="Realme Products"
          brand="Realme"
          limit={10}
          onProductSelect={handleProductSelect}
          onViewMore={() => router.push('/category/Realme%20Products')}
        />

        <ApiProductSection
          title="Motorola Products"
          brand="Motorola"
          limit={10}
          onProductSelect={handleProductSelect}
          onViewMore={() => router.push('/category/Motorola%20Products')}
        />

          <SuggestionSection onSuggestProducts={handleSuggestProducts} />
        </main>
      </div>
    </div>
  );
}
