import { useState, useEffect } from 'react';
import { isAutoPilotEnabled, setAutoPilotEnabled } from '../storage/autoPilotStorage';
import { dispatcher } from '../../../core/dispatcher';

export function useAutoPilot() {
  const [enabled, setEnabled] = useState<boolean>(() => isAutoPilotEnabled());

  useEffect(() => {
    const unsub = dispatcher.on('autopilot:set', (val: boolean) => {
      setEnabled(val);
      setAutoPilotEnabled(val);
    });
    return () => unsub();
  }, []);

  const toggleAutoPilot = () => {
    const next = !enabled;
    setEnabled(next);
    setAutoPilotEnabled(next);
    dispatcher.emit('autopilot:changed', next);
    dispatcher.emit('notify:push', {
      type: 'info',
      title: next ? 'Eksekusi Langsung Otonom: AKTIF' : 'Mode Review Manual: AKTIF',
      message: next
        ? 'Agen akan mengeksekusi dan menyinkronkan perubahan secara otomatis tanpa menunggu konfirmasi berulang.'
        : 'Agen akan meminta konfirmasi review sebelum menerapkan perubahan kode.',
    });
  };

  return {
    isAutoPilot: enabled,
    toggleAutoPilot,
  };
}
