'use client'

import Modal from "@/components/shared/Modal"
import { motion } from "framer-motion"
import { UploadIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WarningModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    errors: string[]
}

export default function WarningModal({
    isOpen,
    onClose,
    onConfirm,
    errors,
}: WarningModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="relative rounded-lg overflow-hidden">
                <div className="relative bg-[#248fca] p-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-4 text-white text-lg font-semibold"
                    >
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <UploadIcon className="w-5 h-5 text-[#248fca]" />
                        </div>
                        <span>Cảnh báo khi tải tài liệu</span>
                    </motion.div>
                </div>

                <div className="p-6 space-y-4">
                    <p>File bạn upload có các vấn đề sau:</p>
                    <ul className="list-disc list-inside text-sm text-red-600">
                        {errors.map((err, i) => (
                            <li key={i}>{err}</li>
                        ))}
                    </ul>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button
                            onClick={onConfirm}
                            className="bg-[#248fca] hover:bg-[#248fca]/80"
                        >
                            Vẫn tiếp tục
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
