"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

/**
 * Component skeleton cho FolderCard khi đang loading
 * Hiển thị placeholder với animation shimmer
 */
const SkeletonFolderCard = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
        >
            <Card className="p-6 border border-gray-200 bg-white h-full">
                {/* Header skeleton */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Icon skeleton */}
                        <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse" />
                        <div>
                            {/* Title skeleton */}
                            <div className="h-5 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                            {/* Document count skeleton */}
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                        </div>
                    </div>
                    {/* Menu button skeleton */}
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Description skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>

                {/* Footer skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-4 animate-pulse" />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

/**
 * Component hiển thị nhiều skeleton cards trong grid
 */
export const SkeletonFolderGrid = ({ count = 6 }: { count?: number }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonFolderCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonFolderCard;
