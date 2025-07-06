"use client"
import FolderList from "@/app/admin/train-ai/components/folder_list"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/shared/Modal"
import { Skeleton } from "@/components/ui/skeleton"
import { BellIcon, FolderIcon, InfoIcon, SettingsIcon, LightbulbIcon, SparklesIcon, WandIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useMemo } from "react"
import ProfileHospitalMenu from "@/components/profile_hospital_menu"
import CreateKnowlegeModal from "@/app/admin/train-ai/components/create_knowlege"
import { Checkbox } from "@radix-ui/react-checkbox"
import { suggestPromptAsync, updateSettingsAsync } from "@/services/train-ai/api-services"
import { useGetKnowledgeBaseListService } from "@/services/train-ai/services"

// Types for simplified settings
interface AISettings {
    system_prompt: string
    selected_collections: string[]
}

// Collections Skeleton Component
const CollectionsSkeleton = () => (
    <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
        {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded-md">
                <Skeleton className="w-4 h-4 rounded" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-16" />
            </div>
        ))}
    </div>
)

// Prompt Ideas Generator Modal
const PromptIdeaModal = ({
    isOpen,
    onClose,
    onSelectPrompt,
}: {
    isOpen: boolean
    onClose: () => void
    onSelectPrompt: (prompt: string) => void
}) => {
    const [idea, setIdea] = useState("")
    const [generatedPrompt, setGeneratedPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGeneratePrompt = async () => {
        if (!idea.trim()) return

        setIsGenerating(true)
        try {
            const response = await suggestPromptAsync({
                idea: idea.trim(),
                language: "vi",
            })
            console.log(response)
            setGeneratedPrompt(response.suggested_template)
        } catch (error) {
            console.error("Error generating prompt:", error)
            // Fallback to a basic prompt if API fails
            setGeneratedPrompt(`Bạn là một trợ lý AI chuyên về ${idea.trim().toLowerCase()}.

Nhiệm vụ chính của bạn:
- Cung cấp thông tin chính xác và đáng tin cậy về ${idea.trim().toLowerCase()}
- Giải thích các khái niệm phức tạp một cách dễ hiểu
- Đưa ra lời khuyên và hướng dẫn phù hợp
- Hỗ trợ người dùng đưa ra quyết định sáng suốt

Nguyên tắc hoạt động:
- Luôn dựa trên bằng chứng khoa học và thông tin đáng tin cậy
- Thừa nhận giới hạn kiến thức khi không chắc chắn
- Khuyến khích tham khảo ý kiến chuyên gia khi cần thiết
- Sử dụng ngôn ngữ phù hợp với trình độ của người dùng`)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleUsePrompt = () => {
        if (generatedPrompt) {
            onSelectPrompt(generatedPrompt)
            onClose()
            // Reset state
            setIdea("")
            setGeneratedPrompt("")
        }
    }

    const handleClose = () => {
        onClose()
        // Reset state when closing
        setIdea("")
        setGeneratedPrompt("")
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Tạo System Prompt từ ý tưởng">
            <div
                className="space-y-6 overflow-y-auto max-h-[80vh]"
                style={{
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                }}
            >
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        className="inline-block mb-4"
                    >
                        <LightbulbIcon className="w-12 h-12 text-yellow-500" />
                    </motion.div>
                    <p className="text-sm text-gray-600">
                        Mô tả ý tưởng hoặc mục đích sử dụng AI của bạn, chúng tôi sẽ tạo system prompt phù hợp
                    </p>
                </div>

                {/* Idea Input */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ý tưởng của bạn</label>
                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Ví dụ: 
- Tư vấn dinh dưỡng cho bệnh nhân tiểu đường
- Hỗ trợ chăm sóc sức khỏe tâm thần
- Giải đáp thắc mắc về thuốc và tác dụng phụ
- Hướng dẫn phục hồi chức năng sau phẫu thuật
- Tư vấn sức khỏe sinh sản..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                    <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">Hãy mô tả chi tiết mục đích và lĩnh vực bạn muốn AI hỗ trợ</p>
                        <span className="text-xs text-gray-400">{idea.length} ký tự</span>
                    </div>
                </motion.div>

                {/* Generate Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center"
                >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            onClick={handleGeneratePrompt}
                            disabled={!idea.trim() || isGenerating}
                            className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                        >
                            {isGenerating ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                    </motion.div>
                                    Đang tạo prompt...
                                </>
                            ) : (
                                <>
                                    <WandIcon className="w-4 h-4" />
                                    Tạo System Prompt
                                </>
                            )}
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Generated Prompt */}
                {generatedPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <SparklesIcon className="w-5 h-5 text-blue-600" />
                                System Prompt được tạo
                            </h3>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{generatedPrompt}</pre>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">Bạn có thể chỉnh sửa prompt này sau khi sử dụng</p>
                                <span className="text-xs text-gray-400">{generatedPrompt.length} ký tự</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" onClick={handleClose}>
                            Hủy
                        </Button>
                    </motion.div>

                    {generatedPrompt && (
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button onClick={handleUsePrompt} className="bg-blue-600 text-white hover:bg-blue-700">
                                Sử dụng prompt này
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

const SettingModal = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) => {
    const { knowledge_bases, isPending } = useGetKnowledgeBaseListService()

    // Filter collections with document_count > 0
    const availableCollections = useMemo(() => {
        if (!knowledge_bases) return []
        return knowledge_bases.filter((collection) => collection.document_count > 0)
    }, [knowledge_bases])

    // Initialize with default values
    const [settings, setSettings] = useState<AISettings>({
        system_prompt: "",
        selected_collections: [],
    })

    const [promptIdeaModalOpen, setPromptIdeaModalOpen] = useState(false)

    const handleSubmit = async () => {
        await updateSettingsAsync({
            system_prompt: settings.system_prompt,
            available_collections: settings.selected_collections,
        })
        onClose()
    }

    const handleCollectionToggle = (collectionId: string) => {
        setSettings((prev) => ({
            ...prev,
            selected_collections: prev.selected_collections.includes(collectionId)
                ? prev.selected_collections.filter((id) => id !== collectionId)
                : [...prev.selected_collections, collectionId],
        }))
    }

    const selectAllCollections = () => {
        if (availableCollections) {
            setSettings((prev) => ({
                ...prev,
                selected_collections: availableCollections.map((c) => c.name),
            }))
        }
    }

    const clearAllCollections = () => {
        setSettings((prev) => ({
            ...prev,
            selected_collections: [],
        }))
    }

    const handleSelectPrompt = (prompt: string) => {
        setSettings((prev) => ({
            ...prev,
            system_prompt: prompt,
        }))
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Cài đặt AI">
                <div
                    className="space-y-6 overflow-y-auto max-h-[80vh]"
                    style={{
                        msOverflowStyle: "none",
                        scrollbarWidth: "none",
                    }}
                >
                    {/* System Prompt */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                <div className="flex items-center gap-2">
                                    System Prompt
                                    <InfoIcon className="w-4 h-4 text-gray-400" />
                                </div>
                            </label>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPromptIdeaModalOpen(true)}
                                    className="gap-2 text-xs bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
                                >
                                    <LightbulbIcon className="w-3 h-3" />
                                    Gợi ý prompt
                                </Button>
                            </motion.div>
                        </div>

                        <textarea
                            value={settings.system_prompt}
                            onChange={(e) => setSettings((prev) => ({ ...prev, system_prompt: e.target.value }))}
                            placeholder="Nhập system prompt để định hướng AI phản hồi...

Ví dụ: Bạn là một trợ lý AI chuyên về y tế. Hãy trả lời các câu hỏi một cách chính xác, dựa trên kiến thức y khoa và luôn khuyến khích người dùng tham khảo ý kiến bác sĩ chuyên khoa."
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500">
                                System prompt sẽ định hướng cách AI phản hồi và xử lý thông tin. Hãy mô tả rõ vai trò và cách thức hoạt
                                động mong muốn.
                            </p>
                            <span className="text-xs text-gray-400">{settings.system_prompt.length} ký tự</span>
                        </div>
                    </motion.div>

                    {/* Collections Selection */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-medium text-gray-900">
                                Bộ sưu tập tài liệu (
                                {isPending ? (
                                    <Skeleton className="inline-block w-8 h-4" />
                                ) : (
                                    `${settings.selected_collections.length}/${availableCollections?.length || 0}`
                                )}
                                )
                            </h3>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={selectAllCollections}
                                    className="text-xs bg-transparent"
                                    disabled={isPending || !availableCollections?.length}
                                >
                                    Chọn tất cả
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={clearAllCollections}
                                    className="text-xs bg-transparent"
                                    disabled={isPending}
                                >
                                    Bỏ chọn
                                </Button>
                            </div>
                        </div>

                        {isPending ? (
                            <CollectionsSkeleton />
                        ) : availableCollections && availableCollections.length > 0 ? (
                            <div className="space-y-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                                {availableCollections.map((collection, index) => (
                                    <motion.div
                                        key={collection.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                        className="flex items-center space-x-3 p-2 bg-white rounded-md hover:bg-blue-50 transition-colors"
                                    >
                                        <Checkbox
                                            id={`collection-${collection.name}`}
                                            checked={settings.selected_collections.includes(collection.name)}
                                            onCheckedChange={() => handleCollectionToggle(collection.name)}
                                        />
                                        <label
                                            htmlFor={`collection-${collection.name}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                        >
                                            {collection.name}
                                        </label>
                                        <div className="text-xs text-gray-400 flex flex-col items-end">
                                            <span>{collection.name}</span>
                                            <span className="text-xs text-gray-500">{collection.document_count} tài liệu</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                                <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Chưa có bộ sưu tập nào có tài liệu</p>
                                <p className="text-xs text-gray-400 mt-1">Tải lên tài liệu vào thư mục để bắt đầu</p>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                            Chỉ hiển thị các bộ sưu tập có tài liệu. Chọn các bộ sưu tập mà AI sẽ sử dụng để tìm kiếm thông tin và trả
                            lời câu hỏi.
                        </p>
                    </motion.div>

                    {/* Selected Collections Summary */}
                    {settings.selected_collections.length > 0 && availableCollections && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Bộ sưu tập đã chọn:</h4>
                            <div className="flex flex-wrap gap-2">
                                {settings.selected_collections.map((collectionId) => {
                                    const collection = availableCollections.find((c) => c.name === collectionId)
                                    return (
                                        <span
                                            key={collectionId}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {collection?.name}
                                            <span className="ml-1 text-blue-600">({collection?.document_count})</span>
                                        </span>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex justify-end gap-3 pt-6 border-t border-gray-200"
                    >
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" onClick={onClose}>
                                Hủy
                            </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                onClick={handleSubmit}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                                disabled={!settings.system_prompt.trim() || settings.selected_collections.length === 0}
                            >
                                Lưu cài đặt
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </Modal>

            {/* Prompt Idea Modal */}
            <PromptIdeaModal
                isOpen={promptIdeaModalOpen}
                onClose={() => setPromptIdeaModalOpen(false)}
                onSelectPrompt={handleSelectPrompt}
            />
        </>
    )
}

/**
 * Component Header cho trang Train AI
 * Bao gồm tiêu đề, mô tả và các button hành động
 */
const Header = () => {
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)
    const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false)

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-6 border border-gray-200 mb-6 shadow-lg"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">Huấn luyện AI</h1>
                    <p className="text-gray-600 mt-1 text-sm">
                        Huấn luyện AI để tự động phân tích và đưa ra lời khuyên cho bệnh nhân
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setCreateFolderModalOpen(true)}>
                            <FolderIcon className="w-4 h-4" />
                            Tạo thư mục
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setSettingsModalOpen(true)}>
                            <SettingsIcon className="w-4 h-4" />
                            Cài đặt
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="icon">
                            <BellIcon className="w-5 h-5" />
                        </Button>
                    </motion.div>

                    <div>
                        <ProfileHospitalMenu profile={1} />
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            <SettingModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />

            {/* Create Folder Modal */}
            <CreateKnowlegeModal isOpen={createFolderModalOpen} onClose={() => setCreateFolderModalOpen(false)} />
        </motion.div>
    )
}

/**
 * Component chính cho trang Train AI
 * Bao gồm Header và danh sách thư mục
 */
export default function TrainAIComponent() {
    return (
        <div>
            {/* Header trang */}
            <header>
                <Header />
            </header>

            {/* Nội dung chính - Danh sách thư mục */}
            <main>
                <FolderList />
            </main>
        </div>
    )
}
