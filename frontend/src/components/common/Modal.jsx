import React from 'react';
import { Award, AlertTriangle, CheckCircle2, Info, X, ShieldAlert } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info', // 'info' | 'success' | 'warning' | 'danger' | 'confirm'
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#EAF2EC] border border-[#B8D4C1] text-[#1B3B2B] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        );
      case 'warning':
      case 'danger':
      case 'confirm':
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#FDF0F0] border border-[#F3C6C6] text-[#8C2525] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F4EFE6] border border-[#D8C8AF] text-[#A37B34] flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1917]/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="glass-card bg-white border border-[#C5A059] max-w-md w-full p-5 sm:p-7 shadow-[0_16px_48px_-8px_rgba(35,30,25,0.18)] space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200 my-auto rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {renderIcon()}
            <div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917] leading-tight">{title || 'Notice'}</h3>
              <span className="text-[9px] sm:text-[10px] text-[#A37B34] font-extrabold uppercase tracking-widest block mt-0.5">
                NMS PLATFORM MODAL
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#736C63] hover:text-[#1C1917] hover:bg-[#F4F0E8] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-[#554F47] leading-relaxed border-t border-b border-[#E2DDD1] py-3.5 sm:py-4 max-h-[60vh] overflow-y-auto">
          {message && <p>{message}</p>}
          {children}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-1">
          {onConfirm ? (
            <>
              <button 
                type="button" 
                onClick={onClose}
                disabled={loading}
                className="btn-secondary text-xs w-full sm:w-auto"
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                onClick={onConfirm}
                disabled={loading}
                className={type === 'danger' || type === 'confirm' ? 'btn-danger text-xs px-4 py-2 w-full sm:w-auto' : 'btn-gold text-xs w-full sm:w-auto'}
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={onClose}
              className="btn-primary text-xs w-full sm:w-auto"
            >
              OK, Understood
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
