"use client";

import { useNotification } from "@/context/notification_context";
import { useCallback } from "react";

export function useNotificationHelpers() {
  const { addNotification, updateNotification, removeNotification } =
    useNotification();

  const showSuccess = useCallback(
    (title: string, message: string, duration = 5000) => {
      return addNotification({
        type: "success",
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (
      title: string,
      message: string,
      actions?: Array<{ label: string; onClick: () => void }>
    ) => {
      return addNotification({
        type: "error",
        title,
        message,
        duration: 0, // Don't auto dismiss errors
        actions,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (title: string, message: string, duration = 8000) => {
      return addNotification({
        type: "warning",
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (title: string, message: string, duration = 6000) => {
      return addNotification({
        type: "info",
        title,
        message,
        duration,
      });
    },
    [addNotification]
  );

  const showProgress = useCallback(
    (title: string, message: string, progress = 0) => {
      return addNotification({
        type: "progress",
        title,
        message,
        progress,
        duration: 0, // Don't auto dismiss progress
      });
    },
    [addNotification]
  );

  const updateProgress = useCallback(
    (id: string, progress: number, message?: string) => {
      updateNotification(id, {
        progress,
        ...(message && { message }),
      });
    },
    [updateNotification]
  );

  const completeProgress = useCallback(
    (id: string, successTitle: string, successMessage: string) => {
      updateNotification(id, {
        type: "success",
        title: successTitle,
        message: successMessage,
        progress: 100,
        duration: 5000, // Auto dismiss after 5s
      });
    },
    [updateNotification]
  );

  const failProgress = useCallback(
    (
      id: string,
      errorTitle: string,
      errorMessage: string,
      retryAction?: () => void
    ) => {
      updateNotification(id, {
        type: "error",
        title: errorTitle,
        message: errorMessage,
        duration: 0,
        actions: retryAction
          ? [
              {
                label: "Đóng",
                onClick: () => removeNotification(id),
                variant: "outline" as const,
              },
              { label: "Thử lại", onClick: retryAction },
            ]
          : undefined,
      });
    },
    [updateNotification, removeNotification]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showProgress,
    updateProgress,
    completeProgress,
    failProgress,
  };
}
