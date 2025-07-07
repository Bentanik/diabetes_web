"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BellIcon, CheckCircle, XCircle, AlertCircle, Info, X, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useClickOutside } from "@/hooks/use-click-outside"

export type NotificationType = "success" | "error" | "warning" | "info"

export interface NotificationItem {
    id: string
    type: NotificationType
    title: string
    message: string
    time: string
    isRead: boolean
}

function NotificationItem({
    notification,
    onMarkAsRead,
    onRemove,
}: {
    notification: NotificationItem
    onMarkAsRead: (id: string) => void
    onRemove: (id: string) => void
}) {
    const getIcon = () => {
        switch (notification.type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            case "error":
                return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            case "warning":
                return <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            case "info":
                return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
            default:
                return <Info className="w-5 h-5 text-gray-500 flex-shrink-0" />
        }
    }

    const getBgColor = () => {
        if (notification.isRead) return "bg-white hover:bg-gray-50"
        return "bg-blue-50 hover:bg-blue-100 border-l-4 border-l-[#248fca]"
    }

    return (
        <div
            className={`px-4 py-3 cursor-pointer transition-colors ${getBgColor()}`}
            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
        >
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4
                                className={`text-sm font-semibold leading-5 ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}
                            >
                                {notification.title}
                            </h4>
                            <p className={`text-sm mt-1 leading-5 ${notification.isRead ? "text-gray-500" : "text-gray-600"}`}>
                                {notification.message}
                            </p>
                            <span className="text-xs text-gray-400 mt-2 block">{notification.time}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onRemove(notification.id)
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<NotificationItem[]>([])

    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        setIsOpen(false)
    }, isOpen)

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const handleMarkAsRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    }

    const handleRemove = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
    }

    const handleMarkAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }

    const handleClearAll = () => {
        setNotifications([])
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
                    <BellIcon className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#248fca] hover:bg-[#1e7bb8] text-white text-xs font-semibold border-2 border-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </motion.div>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-96 z-50"
                    >
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="px-4 py-4 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-[#248fca] text-base">Thông báo</h3>
                                    <div className="flex items-center gap-2">
                                        {unreadCount > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs text-[#248fca] hover:text-[#1e7bb8] hover:bg-[#248fca]/10 h-8 px-3 font-medium"
                                            >
                                                Đánh dấu đã đọc
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" onClick={handleClearAll} className="h-8 w-8 hover:bg-gray-200">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                {unreadCount > 0 && (
                                    <p className="text-sm text-gray-500 mt-2">Bạn có {unreadCount} thông báo chưa đọc</p>
                                )}
                            </div>

                            {/* Notification List */}
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((notification) => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                onMarkAsRead={handleMarkAsRead}
                                                onRemove={handleRemove}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 px-4 text-center">
                                        <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 text-sm">Không có thông báo nào</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearAll}
                                        className="w-full text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-9 font-medium"
                                    >
                                        Xóa tất cả thông báo
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
