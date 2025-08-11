'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import {
    SaveIcon,
    RotateCcwIcon,
    LightbulbIcon,
    TargetIcon,
    MessageSquareIcon,
    ZapIcon
} from 'lucide-react'

interface AISettings {
    topK: number
    accuracyThreshold: number
    systemPrompt: string
    contextPrompt: string
    maxTokens: number
    temperature: number
    enableAdvancedSettings: boolean
}

const defaultSettings: AISettings = {
    topK: 5,
    accuracyThreshold: 0.7,
    systemPrompt: 'Bạn là một trợ lý AI chuyên về y tế, đặc biệt là bệnh tiểu đường. Hãy trả lời dựa trên kiến thức y tế chính xác và đáng tin cậy.',
    contextPrompt: 'Dựa trên thông tin được cung cấp, hãy đưa ra câu trả lời chính xác và hữu ích. Nếu thông tin không đủ, hãy nói rõ điều đó.',
    maxTokens: 1000,
    temperature: 0.7,
    enableAdvancedSettings: false
}

export default function AISettings() {
    const [settings, setSettings] = useState<AISettings>(defaultSettings)
    const [isLoading, setIsLoading] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    const handleSettingChange = (key: keyof AISettings, value: string | number | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }))
        setHasChanges(true)
    }

    const handleSave = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setHasChanges(false)
        } catch {
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        setSettings(defaultSettings)
        setHasChanges(false)
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
                        disabled={!hasChanges}
                        className="flex items-center gap-2"
                    >
                        <RotateCcwIcon className="w-4 h-4" />
                        Khôi phục
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isLoading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <SaveIcon className="w-4 h-4" />
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Basic Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Parameters */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TargetIcon className="w-5 h-5 text-blue-600" />
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
                                        {settings.topK}
                                    </Badge>
                                </div>
                                <Slider
                                    id="topK"
                                    min={1}
                                    max={20}
                                    step={1}
                                    value={[settings.topK]}
                                    onValueChange={(value) => handleSettingChange('topK', value[0])}
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
                                        {(settings.accuracyThreshold * 100).toFixed(0)}%
                                    </Badge>
                                </div>
                                <Slider
                                    id="threshold"
                                    min={0.1}
                                    max={1.0}
                                    step={0.05}
                                    value={[settings.accuracyThreshold]}
                                    onValueChange={(value) => handleSettingChange('accuracyThreshold', value[0])}
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
                                        {settings.maxTokens} tokens
                                    </Badge>
                                </div>
                                <Slider
                                    id="maxTokens"
                                    min={100}
                                    max={2000}
                                    step={100}
                                    value={[settings.maxTokens]}
                                    onValueChange={(value) => handleSettingChange('maxTokens', value[0])}
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

                    {/* Prompt Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquareIcon className="w-5 h-5 text-green-600" />
                                Cấu hình Prompt
                            </CardTitle>
                            <CardDescription>
                                Tùy chỉnh cách AI hiểu và trả lời câu hỏi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* System Prompt */}
                            <div className="space-y-3">
                                <Label htmlFor="systemPrompt" className="text-sm font-medium">
                                    System Prompt
                                </Label>
                                <Textarea
                                    id="systemPrompt"
                                    placeholder="Định nghĩa vai trò và tính cách của AI..."
                                    value={settings.systemPrompt}
                                    onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
                                    rows={4}
                                    className="resize-none"
                                />
                                <p className="text-xs text-gray-500">
                                    Định nghĩa vai trò, tính cách và cách thức hoạt động của AI
                                </p>
                            </div>

                            {/* Context Prompt */}
                            <div className="space-y-3">
                                <Label htmlFor="contextPrompt" className="text-sm font-medium">
                                    Context Prompt
                                </Label>
                                <Textarea
                                    id="contextPrompt"
                                    placeholder="Hướng dẫn cách AI xử lý thông tin..."
                                    value={settings.contextPrompt}
                                    onChange={(e) => handleSettingChange('contextPrompt', e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                />
                                <p className="text-xs text-gray-500">
                                    Hướng dẫn cách AI xử lý và tổng hợp thông tin từ cơ sở tri thức
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Quick Actions & Preview */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ZapIcon className="w-5 h-5 text-yellow-600" />
                                Hành động nhanh
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleSettingChange('systemPrompt', defaultSettings.systemPrompt)}
                            >
                                <RotateCcwIcon className="w-4 h-4 mr-2" />
                                Khôi phục System Prompt
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleSettingChange('contextPrompt', defaultSettings.contextPrompt)}
                            >
                                <RotateCcwIcon className="w-4 h-4 mr-2" />
                                Khôi phục Context Prompt
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => setSettings(defaultSettings)}
                            >
                                <RotateCcwIcon className="w-4 h-4 mr-2" />
                                Khôi phục tất cả
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Settings Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LightbulbIcon className="w-5 h-5 text-purple-600" />
                                Xem trước cài đặt
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Top K:</span>
                                    <span className="font-medium">{settings.topK}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Độ chính xác:</span>
                                    <span className="font-medium">{(settings.accuracyThreshold * 100).toFixed(0)}%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Max tokens:</span>
                                    <span className="font-medium">{settings.maxTokens}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Temperature:</span>
                                    <span className="font-medium">{settings.temperature}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tips */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardHeader>
                            <CardTitle className="text-blue-800 text-sm">
                                💡 Mẹo cài đặt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-blue-700 space-y-2">
                            <p>• <strong>Top K:</strong> Giá trị 3-7 thường cho kết quả tốt nhất</p>
                            <p>• <strong>Độ chính xác:</strong> 0.7-0.8 cân bằng giữa chất lượng và độ phủ</p>
                            <p>• <strong>Temperature:</strong> 0.7 cho câu trả lời cân bằng</p>
                            <p>• <strong>System Prompt:</strong> Rõ ràng, ngắn gọn về vai trò AI</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
