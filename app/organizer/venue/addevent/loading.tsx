export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-primary py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="container mx-auto">
        <div className="w-full max-w-2xl mx-auto">
          {/* Form Skeleton */}
          <div className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-8 w-1/2"></div>
            
            {/* Image Upload Area */}
            <div className="aspect-video w-full bg-gray-700 rounded-lg mb-6"></div>
            
            {/* Form Fields */}
            <div className="space-y-6">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-gray-700 rounded"></div>
                <div className="h-12 bg-gray-700 rounded"></div>
              </div>
              <div className="h-24 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
