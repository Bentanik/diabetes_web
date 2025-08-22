'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
    SaveIcon,
    RotateCcwIcon,
    TargetIcon,
} from 'lucide-react'
import { useGetSettingService } from '@/services/train-ai/services'
import useUpdateSetting from '@/app/admin/train-ai/setting/hook/useUpdateSetting'

export default function AISettings() {
    const { data: defaultSettings, isLoading, isError } = useGetSettingService();

    const { handleUpdateChatSetting } = useUpdateSetting();

    const [settings, setSettings] = useState<API.TSettings>({
        top_k: 5,
        search_accuracy: 0.7,
        max_tokens: 1000,
        temperature: 0.7,
    })

    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Update local settings when API data loads
    useEffect(() => {
        if (defaultSettings) {
            setSettings(defaultSettings)
            setHasChanges(false)
        }
    }, [defaultSettings])

    const handleSettingChange = (key: keyof API.TSettings, value: string | number | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }

    const handleSave = () => {
        setIsSaving(true)
        try {
            handleUpdateChatSetting(settings, () => {
                setHasChanges(false)
            });
        } catch {
            // Show error toast
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        if (defaultSettings) {
            setSettings(defaultSettings)
            setHasChanges(false)
        }
    }

    // Loading skeleton
    if (isLoading) {
        return <AISettingsSkeleton />
    }

    // Error state
    if (isError) {
        return (
            <div className="space-y-6">
                <div className="text-center py-12">
                    <div className="text-red-500 text-lg font-medium mb-2">
                        Không thể tải cài đặt AI
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 mt-1">
                        Tùy chỉnh cách AI trả lời và xử lý thông tin từ cơ sở tri thức
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={!hasChanges || !defaultSettings}
                        className="flex items-center gap-2"
                    >
                        <RotateCcwIcon className="w-4 h-4" />
                        Đặt lại
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-[#248fca] hover:bg-[#248fca]/80"
                    >
                        <SaveIcon className="w-4 h-4" />
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </div>

            <div className="">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TargetIcon className="w-5 h-5 text-[#248fca]" />
                                Tham số cơ bản
                            </CardTitle>
                            <CardDescription>
                                Cài đặt các tham số cốt lõi ảnh hưởng đến chất lượng câu trả lời
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Top K */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="topK" className="text-sm font-medium">
                                        Số lượng câu trả lời (Top K)
                                    </Label>
                                    <Badge variant="secondary" className="font-mono">
                                        {settings.top_k}
                                    </Badge>
                                </div>
                                <Slider
                                    id="topK"
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={[settings.top_k]}
                                    onValueChange={(value) => handleSettingChange('top_k', value[0])}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500">
                                    Số lượng câu trả lời được lấy từ cơ sở tri thức để tạo ra câu trả lời cuối cùng
                                </p>
                            </div>

                            {/* Accuracy Threshold */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="threshold" className="text-sm font-medium">
                                        Ngưỡng độ chính xác
                                    </Label>
                                    <Badge variant="secondary" className="font-mono">
                                        {(settings.search_accuracy * 100).toFixed(0)}%
                                    </Badge>
                                </div>
                                <Slider
                                    id="threshold"
                                    min={0.1}
                                    max={1.0}
                                    step={0.05}
                                    value={[settings.search_accuracy]}
                                    onValueChange={(value) => handleSettingChange('search_accuracy', value[0])}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500">
                                    Chỉ sử dụng thông tin có độ tin cậy cao hơn ngưỡng này
                                </p>
                            </div>

                            {/* Max Tokens */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="maxTokens" className="text-sm font-medium">
                                        Độ dài tối đa câu trả lời
                                    </Label>
                                    <Badge variant="secondary" className="font-mono">
                                        {settings.max_tokens} tokens
                                    </Badge>
                                </div>
                                <Slider
                                    id="maxTokens"
                                    min={100}
                                    max={2000}
                                    step={100}
                                    value={[settings.max_tokens]}
                                    onValueChange={(value) => handleSettingChange('max_tokens', value[0])}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500">
                                    Giới hạn độ dài câu trả lời để đảm bảo tính ngắn gọn
                                </p>
                            </div>

                            {/* Temperature */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="temperature" className="text-sm font-medium">
                                        Tính sáng tạo (Temperature)
                                    </Label>
                                    <Badge variant="secondary" className="font-mono">
                                        {settings.temperature}
                                    </Badge>
                                </div>
                                <Slider
                                    id="temperature"
                                    min={0.1}
                                    max={1.0}
                                    step={0.1}
                                    value={[settings.temperature]}
                                    onValueChange={(value) => handleSettingChange('temperature', value[0])}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500">
                                    Giá trị thấp = trả lời nhất quán, giá trị cao = sáng tạo hơn
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// Skeleton loading component
function AISettingsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Parameters Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-80" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-6 w-12" />
                                    </div>
                                    <Skeleton className="h-2 w-full" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Prompt Configuration Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-36" />
                            <Skeleton className="h-4 w-72" />
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-24 w-full" />
                                    <Skeleton className="h-3 w-56" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column Skeleton */}
                <div className="space-y-6">
                    {/* Quick Actions Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </CardContent>
                    </Card>

                    {/* Settings Preview Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-28" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-24" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <Skeleton key={i} className="h-3 w-full" />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
