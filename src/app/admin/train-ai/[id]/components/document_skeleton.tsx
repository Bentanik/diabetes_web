import { Card, CardContent } from "@/components/ui/card"

export default function DocumentListSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                    <Card key={index} className="border-gray-200">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                                    <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                                <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between">
                                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                                    <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
