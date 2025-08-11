'use client'
import { useState } from 'react'
import Header from '@/app/admin/train-ai/setting/components/header'
import { FolderIcon, MessageCircleIcon } from 'lucide-react'
import KnowledgeSetting from '@/app/admin/train-ai/setting/components/knowledge_setting'

export default function SettingTrainAIComponent() {
    const [activeTab, setActiveTab] = useState('knowledgebases')

    const tabs = [
        { id: 'knowledgebases', label: 'Thư mục', icon: <FolderIcon /> },
        { id: 'prompts', label: 'Prompt Settings', icon: <MessageCircleIcon /> }
    ]

    const renderTabContent = () => {
        switch (activeTab) {
            case 'knowledgebases':
                return <KnowledgeSetting />
            default:
                return <KnowledgeSetting />
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
                                    ? 'border-[#248fca] text-[#248fca]'
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
