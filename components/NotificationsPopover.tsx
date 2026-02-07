import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { ViewState } from '../types';

const formatRelativeTime = (timestamp: number, language: 'en' | 'fr') => {
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return language === 'fr' ? 'À l’instant' : 'Just now';
  if (diffMinutes < 60) return language === 'fr' ? `Il y a ${diffMinutes} min` : `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return language === 'fr' ? `Il y a ${diffHours} h` : `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return language === 'fr' ? `Il y a ${diffDays} j` : `${diffDays}d ago`;
};

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'booking':
      return { icon: 'confirmation_number', bg: 'bg-emerald-100', text: 'text-emerald-600' };
    case 'price':
      return { icon: 'trending_down', bg: 'bg-orange-100', text: 'text-orange-600' };
    case 'reminder':
      return { icon: 'schedule', bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'promo':
      return { icon: 'discount', bg: 'bg-purple-100', text: 'text-purple-600' };
    default:
      return { icon: 'info', bg: 'bg-gray-100', text: 'text-gray-600' };
  }
};

interface NotificationsPopoverProps {
  align?: 'left' | 'right';
  className?: string;
  onNavigate?: (view: ViewState, itemId?: string, itemType?: 'tour' | 'location' | 'booking') => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ align = 'right', className = '', onNavigate }) => {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const { notifications, unreadCount, enabled, markAllRead, markRead, dismiss, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    return [...notifications].sort((a, b) => b.createdAt - a.createdAt);
  }, [notifications]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-charcoal-dark/50 backdrop-blur-md text-primary border border-primary/30 w-10 h-10 flex items-center justify-center rounded-full hover:bg-primary hover:text-navy-dark transition-all shadow-glow relative"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-14 w-80 rounded-2xl shadow-xl border p-4 z-50 animation-fade-in-down ${
            theme === 'dark' ? 'bg-[#2c241b] border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('notifications_center')}</h3>
              {!enabled && <span className="text-xs text-orange-400 mt-1">{t('notifications_paused')}</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={markAllRead} className="text-xs font-semibold text-primary hover:underline">
                {t('mark_all_read')}
              </button>
              <button onClick={clearAll} className="text-xs font-semibold text-gray-400 hover:text-primary">
                {t('clear_all')}
              </button>
            </div>
          </div>

          {sorted.length === 0 ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-symbols-outlined">notifications_off</span>
              </div>
              <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('no_notifications_title')}</p>
              <p className="text-xs text-gray-500 mt-1">{t('no_notifications_desc')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
              {sorted.map(notification => {
                const styles = getTypeStyles(notification.type);
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      markRead(notification.id);
                      if (notification.link && onNavigate) {
                        onNavigate(notification.link.view, notification.link.itemId, notification.link.itemType);
                        setOpen(false);
                      }
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors border ${
                      notification.read
                        ? theme === 'dark'
                          ? 'border-white/5 hover:bg-white/5'
                          : 'border-gray-100 hover:bg-gray-50'
                        : theme === 'dark'
                          ? 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                          : 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full ${styles.bg} ${styles.text} flex items-center justify-center shrink-0`}>
                      <span className="material-symbols-outlined text-[18px]">{styles.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {notification.title}
                        </p>
                        {!notification.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                      <div className="text-[10px] text-gray-400 mt-2">
                        {formatRelativeTime(notification.createdAt, language)}
                      </div>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        dismiss(notification.id);
                      }}
                      className="text-gray-400 hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
