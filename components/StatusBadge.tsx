import React from 'react';

const StatusBadge: React.FC<{ status: 'Fresh' | 'Spoiled' }> = ({ status }) => (
  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'Fresh' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
    {status}
  </div>
);

export default StatusBadge;
