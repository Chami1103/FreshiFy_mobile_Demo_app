import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getNotifications } from '../services/apiService';
import { Notification } from '../types';
import { AlertCircleIcon, InfoIcon, FoodIcon } from '../components/icons/Icons';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const getIcon = () => {
        switch (notification.icon) {
            case 'alert': return <AlertCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />;
            case 'info': return <InfoIcon className="w-6 h-6 text-sky-500 dark:text-sky-400" />;
            case 'food': return <FoodIcon className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />;
            default: return null;
        }
    };

    return (
        <div className="flex items-center gap-4 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
            <div>{getIcon()}</div>
            <div className="flex-1">
                <p className="text-gray-800 dark:text-white">{notification.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp}</p>
            </div>
        </div>
    );
};

const NotificationsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchData = async () => {
          try {
              setIsLoading(true);
              const data = await getNotifications();
              setNotifications(data);
          } catch (err) {
              setError('Failed to load notifications.');
              console.error(err);
          } finally {
              setIsLoading(false);
          }
      };
      fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-emerald-600 dark:text-emerald-200">Your latest alerts and updates.</p>
      </div>
      
      <Card>
        {isLoading && <div className="flex justify-center py-8"><Loader text="Loading notifications..." /></div>}
        {error && <p className="text-center text-red-500 py-8">{error}</p>}
        {!isLoading && !error && (
            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map(notif => <NotificationItem key={notif.id} notification={notif} />)
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No new notifications.</p>
                )}
            </div>
        )}
      </Card>
    </div>
  );
};

export default NotificationsScreen;
