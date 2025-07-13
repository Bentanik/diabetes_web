import React, { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
    loadingText?: string;
    endText?: string;
    threshold?: number;
    children: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
    hasMore,
    isLoading,
    onLoadMore,
    loadingText = "Đang tải...",
    endText = "Đã tải hết dữ liệu",
    threshold = 20,
    children,
}) => {
    const observerRef = useRef<HTMLDivElement>(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const target = entries[0];
            if (target.isIntersecting && hasMore && !isLoading) {
                console.log("IntersectionObserver triggered");
                onLoadMore();
            }
        },
        [hasMore, isLoading, onLoadMore]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: `${threshold}px`,
            threshold: 0.1,
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => observer.disconnect();
    }, [handleObserver, threshold]);

    return (
        <div className="w-full">
            {children}
            {isLoading && (
                <div className="flex justify-center items-center py-4">
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border seta-500"></div>
                        <span className="text-sm text-gray-600">
                            {loadingText}
                        </span>
                    </div>
                </div>
            )}
            <div ref={observerRef} className="h-4"></div>
            {!hasMore && !isLoading && (
                <div className="text-center py-4 text-gray-500 text-sm">
                    {endText}
                </div>
            )}
        </div>
    );
};

export default InfiniteScroll;
