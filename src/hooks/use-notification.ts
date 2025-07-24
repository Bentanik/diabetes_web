/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useCallback, useEffect } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  createdAt: number; // timestamp for sorting
}

interface UseNotificationsOptions {
  maxNotifications?: number;
  persistKey?: string; // localStorage key
  autoMarkAsReadDelay?: number; // auto mark as read after X ms
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    maxNotifications = 50,
    persistKey = "app-notifications",
    autoMarkAsReadDelay = 0, // 0 = disabled
  } = options;

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && persistKey) {
      try {
        const saved = localStorage.getItem(persistKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          setNotifications(parsed);
        }
      } catch (error) {
        console.error("Failed to load notifications from localStorage:", error);
      }
    }
  }, [persistKey]);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      persistKey &&
      notifications.length > 0
    ) {
      try {
        localStorage.setItem(persistKey, JSON.stringify(notifications));
      } catch (error) {
        console.error("Failed to save notifications to localStorage:", error);
      }
    }
  }, [notifications, persistKey]);

  // Add new notification
  const addNotification = useCallback(
    (
      notification: Omit<
        NotificationItem,
        "id" | "time" | "isRead" | "createdAt"
      >
    ) => {
      const now = Date.now();
      const newNotification: NotificationItem = {
        ...notification,
        id: `notification-${now}-${Math.random().toString(36).substr(2, 9)}`,
        time: formatTime(now),
        isRead: false,
        createdAt: now,
      };

      setNotifications((prev) => {
        // Add new notification at the beginning
        const updated = [newNotification, ...prev];

        // Limit max notifications
        const limited = updated.slice(0, maxNotifications);

        return limited;
      });

      // Auto mark as read after delay
      if (autoMarkAsReadDelay > 0) {
        setTimeout(() => {
          markAsRead(newNotification.id);
        }, autoMarkAsReadDelay);
      }

      return newNotification.id;
    },
    [maxNotifications, autoMarkAsReadDelay]
  );

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    if (typeof window !== "undefined" && persistKey) {
      localStorage.removeItem(persistKey);
    }
  }, [persistKey]);

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Get notifications by type
  const getNotificationsByType = useCallback(
    (type: NotificationType) => {
      return notifications.filter((n) => n.type === type);
    },
    [notifications]
  );

  // Utility methods for common notification types
  const addSuccess = useCallback(
    (title: string, message: string) => {
      return addNotification({ type: "success", title, message });
    },
    [addNotification]
  );

  const addError = useCallback(
    (title: string, message: string) => {
      return addNotification({ type: "error", title, message });
    },
    [addNotification]
  );

  const addWarning = useCallback(
    (title: string, message: string) => {
      return addNotification({ type: "warning", title, message });
    },
    [addNotification]
  );

  const addInfo = useCallback(
    (title: string, message: string) => {
      return addNotification({ type: "info", title, message });
    },
    [addNotification]
  );

  return {
    notifications,
    unreadCount,
    addNotification,
    addSuccess,
    addError,
    addWarning,
    addInfo,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    getNotificationsByType,
  };
}

// Utility function to format time
function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;

  return new Date(timestamp).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
