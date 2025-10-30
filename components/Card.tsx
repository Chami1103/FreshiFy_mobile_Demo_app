
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-200/50 dark:border-white/20 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-white ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
