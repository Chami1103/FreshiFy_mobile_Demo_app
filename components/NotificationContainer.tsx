import React, { useEffect, useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { AppNotification } from '../types';
import { InfoIcon, AlertCircleIcon, XIcon, CheckCircleIcon } from './icons/Icons';

const NOTIFICATION_TIMEOUT = 5000;

const NotificationToast: React.FC<{ notification: AppNotification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onDismiss, 500); // Wait for animation to finish
    }, NOTIFICATION_TIMEOUT);

    return () => clearTimeout(timer);
  }, [onDismiss]);
  
  const handleDismiss = () => {
      setIsExiting(true);
      setTimeout(onDismiss, 500);
  };
  
  const typeStyles = {
    success: {
      icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
      bg: 'bg-green-50 dark:bg-green-900/50',
      border: 'border-green-400 dark:border-green-600',
    },
    error: {
      icon: <AlertCircleIcon className="w-6 h-6 text-red-500" />,
      bg: 'bg-red-50 dark:bg-red-900/50',
      border: 'border-red-400 dark:border-red-600',
    },
    info: {
      icon: <InfoIcon className="w-6 h-6 text-sky-500" />,
      bg: 'bg-sky-50 dark:bg-sky-900/50',
      border: 'border-sky-400 dark:border-sky-600',
    },
    alert: {
      icon: <AlertCircleIcon className="w-6 h-6 text-yellow-500" />,
      bg: 'bg-yellow-50 dark:bg-yellow-900/50',
      border: 'border-yellow-400 dark:border-yellow-600',
    },
  };

  const styles = typeStyles[notification.type];

  return (
    <div className={`w-full max-w-sm rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden my-2 border-l-4 ${styles.border} ${styles.bg} ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{notification.title}</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button onClick={handleDismiss} className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 z-50">
      <div className="w-full max-w-sm">
        {notifications.map(n => (
          <NotificationToast key={n.id} notification={n} onDismiss={() => removeNotification(n.id)} />
        ))}
      </div>
    </div>
  );
};

export default NotificationContainer;
