const HeaderSkeleton = () => (
    <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
                {/* Breadcrumb skeleton */}
                <div className="flex items-center space-x-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>

                {/* Title and actions skeleton */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                        <div className="h-6 bg-gray-100 rounded-full w-20 animate-pulse"></div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                </div>

                {/* Stats skeleton */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg p-4">
                            <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                            <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
)

const DocumentMainSkeleton = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and filters skeleton */}
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 max-w-md">
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
            </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="bg-gray-50 px-6 py-3 border-b">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="col-span-2">
                        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Table rows */}
            <div className="divide-y divide-gray-200">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="px-6 py-4">
                        <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-4">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Pagination skeleton */}
        <div className="mt-6 flex items-center justify-between">
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                ))}
            </div>
        </div>
    </div>
)

export const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gray-50">
        <HeaderSkeleton />
        <DocumentMainSkeleton />
    </div>
)
