import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { devConsoleLogger } from '../../modules/devConsole';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught runtime exception:', error, errorInfo);
    
    // Log to our AI Dev Console
    try {
      devConsoleLogger.addLog(
        'error',
        'Runtime',
        `Exception: ${error.message}. Stack trace can be viewed in browser console.`
      );
    } catch (err) {
      console.error('Failed to log to dev console:', err);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex flex-col gap-2 items-center text-center text-xs max-w-md mx-auto my-8">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-full">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-rose-950">Gagal Memuat Komponen UI</h4>
            <p className="text-[10px] text-rose-700 mt-0.5 leading-relaxed">
              Terjadi kegagalan runtime internal pada modul ini. Masalah telah terdeteksi dan direkam ke konsol pengembang.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] mt-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Muat Ulang Aplikasi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
