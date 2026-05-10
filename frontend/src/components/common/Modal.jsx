import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './LoadingSpinner';

const Modal = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={cn(
          "relative w-full max-w-lg rounded-xl bg-surface p-6 shadow-2xl ring-1 ring-border animate-slide-up overflow-hidden flex flex-col max-h-[90vh]",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
