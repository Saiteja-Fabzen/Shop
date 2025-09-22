'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageData {
  url: string;
  altText: string;
  isPrimary?: boolean;
}

interface ImageCarouselProps {
  images: ImageData[];
  productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setImageLoading(true);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageLoading(true);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
    setImageLoading(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <div className="relative">
      {/* Main Image Container */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <img
          src={currentImage.url}
          alt={currentImage.altText || productName}
          className="w-full h-full object-cover"
          onLoad={() => setImageLoading(false)}
          onError={(e) => {
            setImageLoading(false);
            e.currentTarget.src = '/images/placeholder.png';
          }}
        />

        {/* Navigation Arrows - Only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Navigation - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="mt-4">
          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mb-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentIndex === index ? 'bg-purple-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>

          {/* Thumbnail Images */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  currentIndex === index
                    ? 'border-purple-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.altText || `${productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.png';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}