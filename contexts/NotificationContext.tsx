import React, { createContext, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { NotificationItem } from '../types';
import { supabase } from '../lib/supabase';

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
const NOTIFICATIONS_SEEDED_KEY = 'gobenin-notifications-seeded';

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

export const NotificationProvider: React.FC<{ children: ReactNode; userId?: string | null }> = ({ children, userId }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadNotifications());
  const [enabled, setEnabled] = useState<boolean>(() => loadSettings().enabled);
  const [hasSeeded, setHasSeeded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(NOTIFICATIONS_SEEDED_KEY) === 'true';
  });
  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

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

    if (userId) {
      supabase.from('notifications').insert({
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        channel: 'in_app',
      });
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (userId) {
      supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', userId);
    }
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    if (userId) {
      supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', id);
    }
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (userId) {
      supabase.from('notifications').delete().eq('id', id);
    }
  };

  const clearAll = () => {
    setNotifications([]);
    if (userId) {
      supabase.from('notifications').delete().eq('user_id', userId);
    }
  };

  const toggleEnabled = () => {
    setEnabled(prev => !prev);
  };

  const seed = (items: NotificationItem[]) => {
    if (hasSeeded) return;
    if (notifications.length === 0 && items.length > 0) {
      setNotifications(items);
    }
    setHasSeeded(true);
    localStorage.setItem(NOTIFICATIONS_SEEDED_KEY, 'true');
  };

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('id, title, message, type, created_at, read_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (!data) return;
      setNotifications(data.map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type,
        createdAt: new Date(item.created_at).getTime(),
        read: Boolean(item.read_at),
      })));
    };

    fetchNotifications();

    if (realtimeRef.current) {
      supabase.removeChannel(realtimeRef.current);
    }

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        payload => {
          const record = payload.new as any;
          setNotifications(prev => [
            {
              id: record.id,
              title: record.title,
              message: record.message,
              type: record.type,
              createdAt: new Date(record.created_at).getTime(),
              read: Boolean(record.read_at),
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    realtimeRef.current = channel;

    return () => {
      if (realtimeRef.current) {
        supabase.removeChannel(realtimeRef.current);
      }
    };
  }, [userId]);

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
