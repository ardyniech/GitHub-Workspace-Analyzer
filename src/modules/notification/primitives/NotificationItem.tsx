import React, { FC } from 'react';
import { AppNotification } from '../logic/types';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export interface NotificationItemProps {
  key?: React.Key;
  notification: AppNotification;
  onDismiss: (id: string) => void;
}

export const NotificationItem: FC<NotificationItemProps> = ({ notification, onDismiss }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const timeAgo = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)}m lalu`;
    return `${Math.floor(diff / 3600)}j lalu`;
  };

  return (
    <div
      className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 relative group ${
        notification.read
          ? 'bg-zinc-50/70 border-zinc-200/80 text-zinc-600'
          : 'bg-white border-zinc-300 shadow-xs text-zinc-900'
      }`}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center justify-between gap-1">
          <h4 className="text-xs font-bold truncate">{notification.title}</h4>
          <span className="text-[9.5px] text-zinc-400 shrink-0">{timeAgo(notification.timestamp)}</span>
        </div>
        <p className="text-[11px] leading-relaxed mt-0.5 break-words">{notification.message}</p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded cursor-pointer"
        title="Tutup notifikasi"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
