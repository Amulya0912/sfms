import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false, isLoading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col items-center text-center pb-6">
        {isDestructive && (
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
        )}
        <p className="text-text-muted">{message}</p>
      </div>
      
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-auto">
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="btn btn-secondary"
        >
          {cancelText}
        </button>
        <button 
          onClick={onConfirm}
          disabled={isLoading}
          className={`btn ${isDestructive ? 'btn-danger' : 'btn-primary'}`}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
