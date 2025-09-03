"use client";

import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    ReactNode,
} from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationItem {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    createdAt: number;
}

interface NotificationState {
    notifications: NotificationItem[];
    notificationCount: number;
}

type NotificationAction =
    | { type: "ADD_NOTIFICATION"; payload: NotificationItem }
    | { type: "REMOVE_NOTIFICATION"; payload: string }
    | { type: "CLEAR_ALL" }
    | { type: "UPDATE_TIMES" }
    | { type: "SET_NOTIFICATIONS"; payload: NotificationItem[] };

const initialState: NotificationState = {
    notifications: [],
    notificationCount: 0,
};

function notificationReducer(
    state: NotificationState,
    action: NotificationAction
): NotificationState {
    switch (action.type) {
        case "ADD_NOTIFICATION":
            const newNotifications = [action.payload, ...state.notifications];
            const limitedNotifications = newNotifications.slice(0, 50);
            return {
                notifications: limitedNotifications,
                notificationCount: limitedNotifications.length,
            };

        case "REMOVE_NOTIFICATION":
            const filteredNotifications = state.notifications.filter(
                (n) => n.id !== action.payload
            );
            return {
                notifications: filteredNotifications,
                notificationCount: filteredNotifications.length,
            };

        case "CLEAR_ALL":
            return {
                notifications: [],
                notificationCount: 0,
            };

        case "UPDATE_TIMES":
            return {
                ...state,
                notifications: state.notifications.map((notif) => ({
                    ...notif,
                    time: formatTime(notif.createdAt),
                })),
            };

        case "SET_NOTIFICATIONS":
            return {
                ...state,
                notifications: action.payload,
                notificationCount: action.payload.length,
            };

        default:
            return state;
    }
}

interface NotificationContextType {
    state: NotificationState;
    addNotification: (
        notification: Omit<NotificationItem, "id" | "time" | "createdAt">
    ) => string;
    removeNotification: (id: string) => void;
    clearAll: () => void;
    addSuccess: (title: string, message: string) => string;
    addError: (title: string, message: string) => string;
    addWarning: (title: string, message: string) => string;
    addInfo: (title: string, message: string) => string;
    getNotificationsByType: (type: NotificationType) => NotificationItem[];
    playNotificationSound: (type: NotificationType) => void;
    isSoundEnabled: boolean;
    toggleSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(notificationReducer, initialState);
    const [isSoundEnabled, setIsSoundEnabled] = React.useState(true);
    const [isLoaded, setIsLoaded] = React.useState(false);

    // Audio elements for different notification types
    const audioRefs = React.useRef({
        success:
            typeof window !== "undefined"
                ? new Audio("/audio/success_notfi.mp3")
                : null,
        error:
            typeof window !== "undefined"
                ? new Audio("/audio/success_notfi.mp3")
                : null, // Using same sound for now
        warning:
            typeof window !== "undefined"
                ? new Audio("/audio/success_notfi.mp3")
                : null, // Using same sound for now
        info:
            typeof window !== "undefined"
                ? new Audio("/audio/success_notfi.mp3")
                : null, // Using same sound for now
    });

    // Load notifications and sound preference from localStorage
    React.useEffect(() => {
        if (typeof window !== "undefined" && !isLoaded) {
            try {
                // Load notifications
                const savedNotifications =
                    localStorage.getItem("app-notifications");
                if (savedNotifications) {
                    const parsed = JSON.parse(savedNotifications);
                    const withUpdatedTimes = parsed.map(
                        (notif: NotificationItem) => ({
                            ...notif,
                            time: formatTime(notif.createdAt),
                        })
                    );

                    dispatch({
                        type: "SET_NOTIFICATIONS",
                        payload: withUpdatedTimes,
                    });
                }

                // Load sound preference
                const savedSoundPreference = localStorage.getItem(
                    "notification-sound-enabled"
                );
                if (savedSoundPreference !== null) {
                    setIsSoundEnabled(JSON.parse(savedSoundPreference));
                }
            } catch (error) {
                console.error("Failed to load notifications:", error);
            } finally {
                setIsLoaded(true);
            }
        }
    }, [isLoaded]);

    // Save notifications to localStorage whenever state changes
    React.useEffect(() => {
        if (typeof window !== "undefined" && isLoaded) {
            try {
                localStorage.setItem(
                    "app-notifications",
                    JSON.stringify(state.notifications)
                );
            } catch (error) {
                console.error("Failed to save notifications:", error);
            }
        }
    }, [state.notifications, isLoaded]);

    // Function to play notification sound
    const playNotificationSound = React.useCallback(
        (type: NotificationType) => {
            if (
                typeof window !== "undefined" &&
                audioRefs.current[type] &&
                isSoundEnabled
            ) {
                try {
                    // Reset audio to beginning and play
                    const audio = audioRefs.current[type];
                    if (audio) {
                        audio.currentTime = 0;
                        audio.play().catch((error) => {
                            console.log("Audio play failed:", error);
                        });
                    }
                } catch (error) {
                    console.log("Audio play error:", error);
                }
            }
        },
        [isSoundEnabled]
    );

    const toggleSound = React.useCallback(() => {
        const newValue = !isSoundEnabled;
        setIsSoundEnabled(newValue);
        if (typeof window !== "undefined") {
            localStorage.setItem(
                "notification-sound-enabled",
                JSON.stringify(newValue)
            );
        }
    }, [isSoundEnabled]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            dispatch({ type: "UPDATE_TIMES" });
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const addNotification = useCallback(
        (notification: Omit<NotificationItem, "id" | "time" | "createdAt">) => {
            const now = Date.now();
            const newNotification: NotificationItem = {
                ...notification,
                id: `notification-${now}-${Math.random()
                    .toString(36)
                    .substr(2, 9)}`,
                time: formatTime(now),
                createdAt: now,
            };

            // Play sound for the notification
            playNotificationSound(notification.type);

            dispatch({ type: "ADD_NOTIFICATION", payload: newNotification });
            return newNotification.id;
        },
        [playNotificationSound]
    );

    const removeNotification = useCallback((id: string) => {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
    }, []);

    const clearAll = useCallback(() => {
        dispatch({ type: "CLEAR_ALL" });
        // Also clear from localStorage
        if (typeof window !== "undefined") {
            localStorage.removeItem("app-notifications");
        }
    }, []);

    const getNotificationsByType = useCallback(
        (type: NotificationType) => {
            return state.notifications.filter((n) => n.type === type);
        },
        [state.notifications]
    );

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

    const value: NotificationContextType = {
        state,
        addNotification,
        removeNotification,
        clearAll,
        addSuccess,
        addError,
        addWarning,
        addInfo,
        getNotificationsByType,
        playNotificationSound,
        isSoundEnabled,
        toggleSound,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotificationContext must be used within a NotificationProvider"
        );
    }
    return context;
}

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
