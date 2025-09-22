interface ProductCardSkeletonProps {
  compact?: boolean;
  count?: number;
}

export default function ProductCardSkeleton({ compact = false, count = 3 }: ProductCardSkeletonProps) {
  return (
    <div className="flex space-x-4 pb-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`
            bg-gray-800 rounded-lg overflow-hidden animate-pulse
            ${compact ? 'w-40 flex-shrink-0' : 'w-full'}
          `}
        >
          {/* Image Skeleton */}
          <div className={`bg-gray-700 ${compact ? 'h-32' : 'h-48'}`} />

          {/* Content Skeleton */}
          <div className="p-3 space-y-2">
            {/* Title */}
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />

            {/* Rating */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-3 h-3 bg-gray-700 rounded-full" />
              ))}
              <div className="h-3 bg-gray-700 rounded w-8 ml-2" />
            </div>

            {/* Price */}
            <div className="h-5 bg-gray-700 rounded w-2/3" />

            {/* Brand/Category */}
            <div className="flex space-x-2">
              <div className="h-3 bg-gray-700 rounded w-1/4" />
              <div className="h-3 bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}