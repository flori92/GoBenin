import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { NotificationItem } from '../types';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  enabled: boolean;
  notify: (notification: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  toggleEnabled: () => void;
  seed: (items: NotificationItem[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATIONS_KEY = 'gobenin-notifications';
const NOTIFICATIONS_SETTINGS_KEY = 'gobenin-notifications-settings';

type NotificationSettings = {
  enabled: boolean;
};

const loadNotifications = () => {
  if (typeof window === 'undefined') return [] as NotificationItem[];
  const saved = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved) as NotificationItem[];
  } catch {
    return [];
  }
};

const loadSettings = (): NotificationSettings => {
  if (typeof window === 'undefined') return { enabled: true };
  const saved = localStorage.getItem(NOTIFICATIONS_SETTINGS_KEY);
  if (!saved) return { enabled: true };
  try {
    return JSON.parse(saved) as NotificationSettings;
  } catch {
    return { enabled: true };
  }
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadNotifications());
  const [enabled, setEnabled] = useState<boolean>(() => loadSettings().enabled);
  const seededRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NOTIFICATIONS_SETTINGS_KEY, JSON.stringify({ enabled }));
  }, [enabled]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const notify = (notification: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => {
    if (!enabled) return;
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      createdAt: Date.now(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleEnabled = () => {
    setEnabled(prev => !prev);
  };

  const seed = (items: NotificationItem[]) => {
    if (seededRef.current) return;
    if (notifications.length === 0 && items.length > 0) {
      setNotifications(items);
    }
    seededRef.current = true;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        enabled,
        notify,
        markAllRead,
        markRead,
        dismiss,
        clearAll,
        toggleEnabled,
        seed,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
