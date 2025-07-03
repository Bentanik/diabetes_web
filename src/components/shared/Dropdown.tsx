import React from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Interface cho props của Dropdown component
 */
interface DropdownProps {
    isOpen: boolean
    onClose: () => void
    trigger: React.ReactNode
    children: React.ReactNode
    align?: "left" | "right"
    className?: string
}

/**
 * Component Dropdown tái sử dụng với animation
 * Dùng để hiển thị menu thả xuống
 */
export const Dropdown: React.FC<DropdownProps> = ({
    isOpen,
    onClose,
    trigger,
    children,
    align = "right",
    className = ""
}) => {
    const alignClass = align === "left" ? "left-0" : "right-0"

    return (
        <div className="relative">
            {/* Trigger element */}
            {trigger}

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay để đóng dropdown khi click bên ngoài */}
                        <div className="fixed inset-0 z-10" onClick={onClose}></div>

                        {/* Nội dung dropdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className={`absolute ${alignClass} mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden ${className}`}
                        >
                            {children}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
} 