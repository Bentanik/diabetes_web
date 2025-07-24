/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Interface cho props của Modal component
 */
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    maxWidth?: string
    className?: string
    closeOnBackdrop?: boolean
}

/**
 * Component Modal
 */
export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    maxWidth = "max-w-lg",
    className = "",
    closeOnBackdrop = true,
}) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            onClose()
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose()
        }
    }

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={handleBackdropClick}
                        style={{
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                    />

                    {/* Modal Box */}
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
                            duration: 0.3,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                        }}
                        className={`relative bg-white rounded-xl w-full ${maxWidth} mx-4 z-10 overflow-hidden ${className}`}
                        style={{
                            boxShadow: `
                                0 4px 6px -1px rgba(0, 0, 0, 0.1),
                                0 2px 4px -1px rgba(0, 0, 0, 0.06),
                                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                                0 10px 10px -5px rgba(0, 0, 0, 0.04),
                                0 0 0 1px rgba(255, 255, 255, 0.1)
                            `,
                        }}
                    >
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default Modal
