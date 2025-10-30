import React, { createContext, useState, useCallback, useContext } from 'react';
import { AppNotification } from '../types';

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback((notification: Omit<AppNotification, 'id'>) => {
    const id = new Date().getTime().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
