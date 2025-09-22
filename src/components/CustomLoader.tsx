interface CustomLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export default function CustomLoader({
  size = 'md',
  text = 'Loading...',
  fullScreen = false
}: CustomLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Spinning Loader */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-purple-800 border-t-transparent rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-purple-400 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>

      {/* Loading Text */}
      {text && (
        <p className={`text-white font-medium ${textSizeClasses[size]} animate-pulse`}>
          {text}
        </p>
      )}

      {/* Dots Animation */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#002E74] flex items-center justify-center z-50">
        <LoaderContent />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <LoaderContent />
    </div>
  );
}