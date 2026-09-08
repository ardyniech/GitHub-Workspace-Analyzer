import { useState, useEffect } from 'react';
import { dispatcher } from '../../../core/dispatcher';
import { AppNotification } from './types';

export function useNotificationCenter() {
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'welcome-notify',
      type: 'info',
      title: 'Selamat Datang',
      message: 'Sistem siap membantu analisis repositori dan keamanan dependensi.',
      timestamp: Date.now(),
      read: true,
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsub = dispatcher.on('notify:push', (data: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
      if (!data) return;
      const newNotif: AppNotification = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        read: false,
        ...data,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });
    return () => unsub();
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    isOpen,
    unreadCount,
    setIsOpen,
    markAllAsRead,
    clearAll,
    removeNotification,
  };
}
