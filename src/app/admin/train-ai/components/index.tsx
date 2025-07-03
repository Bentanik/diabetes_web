"use client"

import type React from "react"

import FolderList from "@/app/admin/train-ai/components/folder_list"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/shared/Modal"
import { BellIcon, FolderIcon, SettingsIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import ProfileHospitalMenu from "@/components/profile_hospital_menu"
import CreateKnowlegeModal from "@/app/admin/train-ai/components/create_knowlege"

const SettingModal = ({
    isOpen,
    onClose,
    // onHandleSetting,
}: {
    isOpen: boolean
    onClose: () => void
    onHandleSetting: () => void
}) => {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const handleSubmit = () => {
        if (name.trim()) {
            // onHandleSetting({
            //     name: name.trim(),
            //     description: description.trim(),
            // })
            setName("")
            setDescription("")
            onClose()
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tạo thư mục mới">
            <div className="space-y-4">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên thư mục</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên thư mục..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Mô tả ngắn về thư mục này..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-end gap-3 pt-4"
                >
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleSubmit} disabled={!name.trim()}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Tạo thư mục
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </Modal>
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
            <SettingModal
                isOpen={settingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
                onHandleSetting={() => { }}
            />

            {/* Create Folder Modal */}
            <CreateKnowlegeModal
                isOpen={createFolderModalOpen}
                onClose={() => setCreateFolderModalOpen(false)}
            />
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
