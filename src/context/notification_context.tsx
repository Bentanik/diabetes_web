/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type NotificationType = "success" | "error" | "warning" | "info" | "progress"

export type NotificationPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "center"

export interface NotificationData {
    id: string
    type: NotificationType
    title: string
    message: string
    progress?: number
    duration?: number // Auto dismiss after duration (ms), 0 = no auto dismiss
    progressId?: string // Unique ID for progress notifications
    position?: NotificationPosition // Custom position for individual notification
    actions?: Array<{
        label: string
        onClick: () => void
        variant?: "default" | "outline"
    }>
    onClose?: () => void
}

interface NotificationContextType {
    notifications: NotificationData[]
    defaultPosition: NotificationPosition
    setDefaultPosition: (position: NotificationPosition) => void
    addNotification: (notification: Omit<NotificationData, "id">) => string
    removeNotification: (id: string) => void
    updateNotification: (id: string, updates: Partial<NotificationData>) => void
    updateProgress: (progressId: string, progress: number, message?: string) => void
    addOrUpdateProgress: (notification: Omit<NotificationData, "id"> & { progressId: string }) => string
    clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("useNotification must be used within NotificationProvider")
    }
    return context
}

// Helper function để get position classes
const getPositionClasses = (position: NotificationPosition) => {
    switch (position) {
        case "top-left":
            return "top-6 left-6"
        case "top-center":
            return "top-6 left-1/2 transform -translate-x-1/2"
        case "top-right":
            return "top-6 right-6"
        case "bottom-left":
            return "bottom-6 left-6"
        case "bottom-center":
            return "bottom-6 left-1/2 transform -translate-x-1/2"
        case "bottom-right":
            return "bottom-6 right-6"
        case "center":
            return "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        default:
            return "bottom-6 right-6"
    }
}

// Helper function để get animation direction - Fixed version
const getAnimationProps = (position: NotificationPosition) => {
    let x = 0, y = 0

    // Xác định hướng animation dựa trên position
    if (position.includes("top")) {
        y = -50
    } else if (position.includes("bottom")) {
        y = 50
    }

    if (position.includes("left")) {
        x = -50
    } else if (position.includes("right")) {
        x = 50
    }

    // Đặc biệt cho center position
    if (position === "center") {
        y = -20 // Nhẹ nhàng từ trên xuống
    }

    return {
        initial: { opacity: 0, x, y, scale: 0.9 },
        animate: { opacity: 1, x: 0, y: 0, scale: 1 },
        exit: { opacity: 0, x, y, scale: 0.9 }
    }
}

// Component hiển thị một notification
function NotificationItem({
    notification,
    onRemove,
}: { notification: NotificationData; onRemove: (id: string) => void }) {
    const getIcon = () => {
        switch (notification.type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case "error":
                return <XCircle className="w-5 h-5 text-red-500" />
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />
            case "info":
                return <Info className="w-5 h-5 text-blue-500" />
            case "progress":
                return <div className="w-5 h-5 border-2 border-[#248fca] border-t-transparent rounded-full animate-spin" />
            default:
                return <Info className="w-5 h-5 text-gray-500" />
        }
    }

    const getColorClasses = () => {
        switch (notification.type) {
            case "success":
                return "border-green-200 bg-green-50"
            case "error":
                return "border-red-200 bg-red-50"
            case "warning":
                return "border-yellow-200 bg-yellow-50"
            case "info":
                return "border-blue-200 bg-blue-50"
            case "progress":
                return "border-[#248fca]/20 bg-[#248fca]/5"
            default:
                return "border-gray-200 bg-white"
        }
    }

    const handleClose = () => {
        if (notification.onClose) {
            notification.onClose()
        }
        onRemove(notification.id)
    }

    return (
        <motion.div
            {...getAnimationProps(notification.position || "bottom-right")}
            className={`w-full ${notification.type === "progress" ? "max-w-md" : "max-w-sm"}`}
            layout
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className={`p-4 rounded-lg shadow-lg border-2 ${getColorClasses()} bg-white`}>
                <div className="flex items-start gap-3">
                    {getIcon()}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>

                        {/* Progress bar cho type progress */}
                        {notification.type === "progress" && notification.progress !== undefined && (
                            <div className="space-y-2 mb-3">
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <motion.div
                                        className="bg-gradient-to-r from-[#248fca] to-[#1e7bb8] h-2 rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${notification.progress}%` }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Tiến trình</span>
                                    <span>{notification.progress}%</span>
                                </div>
                            </div>
                        )}

                        {/* Action buttons */}
                        {notification.actions && notification.actions.length > 0 && (
                            <div className="flex gap-2 mt-3">
                                {notification.actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        size="sm"
                                        variant={action.variant || "default"}
                                        onClick={action.onClick}
                                        className={`text-xs ${action.variant === "outline" ? "bg-transparent" : "bg-[#248fca] hover:bg-[#1e7bb8]"
                                            }`}
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Component hiển thị notifications theo position
function NotificationContainer({
    position,
    notifications,
    onRemove
}: {
    position: NotificationPosition;
    notifications: NotificationData[];
    onRemove: (id: string) => void
}) {
    const positionedNotifications = notifications.filter(
        n => (n.position || "bottom-right") === position
    )

    if (positionedNotifications.length === 0) return null

    return (
        <div className={`fixed z-50 space-y-3 pointer-events-none ${getPositionClasses(position)}`}>
            <AnimatePresence mode="popLayout">
                {positionedNotifications.map((notification) => (
                    <div key={notification.id} className="pointer-events-auto">
                        <NotificationItem notification={notification} onRemove={onRemove} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    )
}

// Provider component
export function NotificationProvider({
    children,
    defaultPosition = "bottom-right"
}: {
    children: ReactNode;
    defaultPosition?: NotificationPosition
}) {
    const [notifications, setNotifications] = useState<NotificationData[]>([])
    const [currentDefaultPosition, setCurrentDefaultPosition] = useState<NotificationPosition>(defaultPosition)

    const addNotification = useCallback((notification: Omit<NotificationData, "id">) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification: NotificationData = {
            ...notification,
            id,
            position: notification.position || currentDefaultPosition,
            duration: notification.duration ?? (notification.type === "success" ? 5000 : 0),
        }

        setNotifications((prev) => [...prev, newNotification])

        // Auto dismiss if duration is set
        if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
                removeNotification(id)
            }, newNotification.duration)
        }

        return id
    }, [currentDefaultPosition])

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, [])

    const updateNotification = useCallback((id: string, updates: Partial<NotificationData>) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)))
    }, [])

    const updateProgress = useCallback((progressId: string, progress: number, message?: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.progressId === progressId ? { ...n, progress, ...(message && { message }) } : n)),
        )
    }, [])

    const addOrUpdateProgress = useCallback(
        (notification: Omit<NotificationData, "id"> & { progressId: string }) => {
            const existingNotification = notifications.find((n) => n.progressId === notification.progressId)

            if (existingNotification) {
                updateNotification(existingNotification.id, {
                    progress: notification.progress,
                    message: notification.message,
                    title: notification.title,
                })
                return existingNotification.id
            } else {
                return addNotification(notification)
            }
        },
        [notifications, updateNotification, addNotification],
    )

    const clearAll = useCallback(() => {
        setNotifications([])
    }, [])

    const setDefaultPosition = useCallback((position: NotificationPosition) => {
        setCurrentDefaultPosition(position)
    }, [])

    // Get all unique positions being used
    const usedPositions = Array.from(
        new Set(notifications.map(n => n.position || currentDefaultPosition))
    ) as NotificationPosition[]

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                defaultPosition: currentDefaultPosition,
                setDefaultPosition,
                addNotification,
                removeNotification,
                updateNotification,
                updateProgress,
                addOrUpdateProgress,
                clearAll,
            }}
        >
            {children}
            {/* Render notification containers for each position */}
            {usedPositions.map(position => (
                <NotificationContainer
                    key={position}
                    position={position}
                    notifications={notifications}
                    onRemove={removeNotification}
                />
            ))}
        </NotificationContext.Provider>
    )
}