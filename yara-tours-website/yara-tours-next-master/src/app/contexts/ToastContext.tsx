'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
    setTimeout(() => {
      setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, 5000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            padding: '10px 20px',
            marginBottom: '10px',
            borderRadius: '5px',
            color: 'white',
            backgroundColor: toast.type === 'success' ? 'green' : 'red',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
