'use client'
import { useState } from 'react'
import Header from '@/app/admin/train-ai/setting/components/header'
import { FolderIcon, MessageCircleIcon } from 'lucide-react'
import KnowledgeBaseSetting from '@/app/admin/train-ai/setting/components/knowledge_base_setting'

export default function SettingTrainAIComponent() {
    const [activeTab, setActiveTab] = useState('knowledgebases')

    const tabs = [
        { id: 'knowledgebases', label: 'Thư mục', icon: <FolderIcon /> },
        { id: 'prompts', label: 'Prompt Settings', icon: <MessageCircleIcon /> }
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'knowledgebases':
                return <KnowledgeBaseSetting />
            case 'prompts':
                return <PromptsTab />
            default:
                return <KnowledgeBaseSetting />
        }
    }

    return (
        <div>
            <header>
                <Header />
            </header>

            <div className="flex flex-col gap-4">
                {/* Tabs Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 px-1 border-b-2 font-medium flex items-center gap-2 ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Dynamic Content */}
                {renderTabContent()}
            </div>
        </div>
    )
}

// Prompts Tab (không thay đổi)
function PromptsTab() {
    const [selectedTemplate, setSelectedTemplate] = useState('medical-consultation')

    const promptTemplates = [
        { id: 'medical-consultation', name: 'Tư vấn Y tế', description: 'Template cho tư vấn y tế tổng quát' },
        { id: 'diagnosis-support', name: 'Hỗ trợ Chẩn đoán', description: 'Template hỗ trợ chẩn đoán bệnh' },
        { id: 'treatment-advice', name: 'Tư vấn Điều trị', description: 'Template đưa ra lời khuyên điều trị' },
        { id: 'drug-information', name: 'Thông tin Thuốc', description: 'Template cung cấp thông tin về thuốc' }
    ]

    const [systemPrompt, setSystemPrompt] = useState(`Bạn là một trợ lý AI chuyên về y tế, được huấn luyện để hỗ trợ tư vấn sức khỏe.

Nhiệm vụ của bạn:
- Cung cấp thông tin y tế chính xác dựa trên kiến thức được cung cấp
- Luôn khuyến khích bệnh nhân đến gặp bác sĩ khi cần thiết
- Không đưa ra chẩn đoán chắc chắn
- Sử dụng ngôn ngữ dễ hiểu, thân thiện

Lưu ý quan trọng:
- Chỉ dựa vào thông tin trong context được cung cấp
- Nếu không có thông tin, hãy thừa nhận và khuyên gặp bác sĩ
- Không bao giờ đưa ra lời khuyên y tế nguy hiểm`)

    const [userPrompt, setUserPrompt] = useState(`Dựa trên thông tin y tế sau đây:

{context}

Hãy trả lời câu hỏi của bệnh nhân: {question}

Lưu ý:
- Trả lời một cách chi tiết và dễ hiểu
- Nêu rõ nguồn thông tin nếu có
- Khuyến khích gặp bác sĩ nếu cần thiết`)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">💬 Prompt Templates</h3>

                    <div className="space-y-3 mb-6">
                        {promptTemplates.map((template) => (
                            <div key={template.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <input
                                    type="radio"
                                    id={template.id}
                                    name="prompt-template"
                                    checked={selectedTemplate === template.id}
                                    onChange={() => setSelectedTemplate(template.id)}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <div className="flex-1">
                                    <label htmlFor={template.id} className="font-medium text-gray-900 cursor-pointer">
                                        {template.name}
                                    </label>
                                    <p className="text-sm text-gray-500">{template.description}</p>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    ✏️
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            ➕ Tạo Template mới
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                            📥 Import Template
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">🤖 System Prompt</h3>
                    <textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        placeholder="Nhập system prompt..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        System prompt định nghĩa vai trò và hành vi của AI
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">👤 User Prompt Template</h3>
                    <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                        placeholder="Nhập user prompt template..."
                    />
                    <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                        <p className="text-sm text-yellow-800">
                            <strong>Biến có sẵn:</strong> {`{context}`} - Thông tin từ RAG, {`{question}`} - Câu hỏi của user
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">🧪 Test Prompt</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Câu hỏi test
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                rows={3}
                                placeholder="Nhập câu hỏi để test prompt..."
                            />
                        </div>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                            🧪 Test Prompt
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Prompt Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">System tokens:</span>
                            <span className="font-medium">~245</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Template tokens:</span>
                            <span className="font-medium">~89</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Estimated cost:</span>
                            <span className="font-medium">$0.002/query</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">⚡ Thao tác nhanh</h3>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            💾 Lưu Prompt
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200">
                            🔄 Reset về mặc định
                        </button>
                        <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200">
                            📋 Copy Prompt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
