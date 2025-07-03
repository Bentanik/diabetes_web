import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { XIcon } from "lucide-react"

/**
 * Interface cho props của Modal component
 */
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    maxWidth?: string
    className?: string
}

/**
 * Component Modal tái sử dụng với animation Framer Motion
 * Dùng để hiển thị các popup và dialog
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = "max-w-md",
    className = ""
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop với blur effect */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-0 bg-white/20 backdrop-blur-sm"
                        onClick={onClose}
                        style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                    />

                    {/* Nội dung Modal */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className={`relative bg-white rounded-xl p-6 w-full ${maxWidth} mx-4 z-10 shadow-2xl border border-gray-100 ${className}`}
                    >
                        {/* Header Modal */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <XIcon className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Nội dung */}
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
} 