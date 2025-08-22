import React, { createContext, useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
  description?: string;
  read?: boolean;
  timestamp?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notif: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  markAllRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  markAllRead: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [
      {
        ...notif,
        id,
        read: false,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}; 