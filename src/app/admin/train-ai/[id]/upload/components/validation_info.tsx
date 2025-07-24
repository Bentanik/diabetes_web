'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fileForTrainAI } from '@/lib/validations/file_train_ai'
import { InfoIcon } from 'lucide-react'

export default function ValidationInfo() {
    return (
        <Card className="shadow-sm border-gray-200 mt-6">
            <CardHeader>
                <CardTitle className="text-lg text-[#248fca] flex items-center gap-2">
                    <InfoIcon className="w-5 h-5" />
                    Kiểm tra tự động
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                    <p className="mb-2">Hệ thống sẽ tự động kiểm tra:</p>
                    <ul className="space-y-1 text-xs">
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>
                                Tên tài liệu không chứa ký tự đặc biệt như: <strong>/</strong>, <strong>\</strong>, <strong>*</strong>, <strong>?</strong>, <strong>&</strong>, <strong>%</strong>, <strong>#</strong>, <strong>:</strong>, <strong>|</strong>, <strong>&quot;</strong>, <strong>&lt;</strong>, <strong>&gt;</strong>
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Dung lượng tài liệu tối đa {fileForTrainAI.maxSizeMB} MB</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Định dạng tài liệu chỉ được phép: PDF hoặc DOCX</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Nội dung tài liệu bắt buộc liên quan đến chủ đề Tiểu đường</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Kiểm tra không trùng lặp với tài liệu đã có trong hệ thống</span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}