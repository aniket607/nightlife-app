export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-primary py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Section Skeleton */}
          <div className="w-full bg-gray-800/50 rounded-lg p-4 animate-pulse">
            <div className="aspect-video w-full bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-700 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded mb-4 w-2/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>

          {/* Right Section Skeleton */}
          <div className="w-full bg-gray-800/50 rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-6 w-1/4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
