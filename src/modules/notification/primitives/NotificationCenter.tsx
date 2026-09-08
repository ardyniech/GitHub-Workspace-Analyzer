import React, { useRef, useEffect } from 'react';
import { useNotificationCenter } from '../logic/useNotificationCenter';
import { NotificationItem } from './NotificationItem';
import { Bell, CheckCheck, Trash2, X } from 'lucide-react';

export function NotificationCenter() {
  const {
    notifications,
    isOpen,
    unreadCount,
    setIsOpen,
    markAllAsRead,
    clearAll,
    removeNotification,
  } = useNotificationCenter();

  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button with Touch-Friendly Hit-Slop */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) markAllAsRead();
        }}
        className="relative p-1.5 text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer flex items-center justify-center min-w-[32px] min-h-[32px]"
        title="Pusat Notifikasi Real-Time"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Flyout */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-zinc-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-3 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-zinc-900">Pusat Notifikasi</span>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.2 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllAsRead}
                    className="p-1 text-zinc-500 hover:text-zinc-800 rounded text-[10px] flex items-center gap-0.5 cursor-pointer"
                    title="Tandai semua telah dibaca"
                  >
                    <CheckCheck className="w-3 h-3" />
                  </button>
                  <button
                    onClick={clearAll}
                    className="p-1 text-zinc-500 hover:text-red-600 rounded text-[10px] flex items-center gap-0.5 cursor-pointer"
                    title="Hapus semua notifikasi"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-700 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-2.5 max-h-80 overflow-y-auto flex flex-col gap-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-zinc-400 text-xs flex flex-col items-center gap-1.5">
                <Bell className="w-5 h-5 stroke-1 opacity-50" />
                <span>Belum ada notifikasi baru</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  notification={notif}
                  onDismiss={removeNotification}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
