"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BellIcon, CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useClickOutside } from "@/hooks/use-click-outside"
import { useNotificationContext, type NotificationItem } from "@/context/notification_context"

function NotificationItemComponent({
    notification,
    onRemove,
}: {
    notification: NotificationItem
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

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-3 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold leading-5 text-gray-900">
                                {notification.title}
                            </h4>
                            <p className="text-sm mt-1 leading-5 text-gray-600">
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
        </motion.div>
    )
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    
    const { 
        state: { notifications, notificationCount },
        removeNotification, 
        clearAll,
    } = useNotificationContext()

    const dropdownRef = useClickOutside<HTMLDivElement>(() => {
        setIsOpen(false)
    }, isOpen)

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="relative"
                >
                    <BellIcon className="w-5 h-5" />
                    {notificationCount > 0 && (
                        <motion.div 
                            key={notificationCount} // Key để animate khi count thay đổi
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-[#248fca] text-white text-[10px] font-bold rounded-full border-2 border-white"
                        >
                            {notificationCount > 99 ? "99+" : notificationCount}
                        </motion.div>
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
                                </div>
                                {notificationCount > 0 && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        Bạn có {notificationCount} thông báo
                                    </p>
                                )}
                            </div>

                            {/* Notification List */}
                            <div className="max-h-80 overflow-y-auto">
                                <AnimatePresence mode="popLayout">
                                    {notifications.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {notifications.map((notification: NotificationItem) => (
                                                <NotificationItemComponent
                                                    key={notification.id}
                                                    notification={notification}
                                                    onRemove={removeNotification}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <motion.div 
                                            key="empty-state"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-12 px-4 text-center"
                                        >
                                            <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 text-sm">Không có thông báo nào</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <AnimatePresence>
                                {notifications.length > 0 && (
                                    <motion.div 
                                        key="footer"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-4 py-3 border-t border-gray-100 bg-gray-50"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                clearAll()
                                                setIsOpen(false)
                                            }}
                                            className="w-full text-sm text-red-600 hover:text-red-600 hover:bg-red-50 h-9 font-medium"
                                        >
                                            Xóa tất cả thông báo
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
