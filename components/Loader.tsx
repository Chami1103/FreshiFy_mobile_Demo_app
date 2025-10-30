import React from 'react';

interface LoaderProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ text, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-b-2 border-emerald-400 ${sizeClasses[size]}`}></div>
      {text && <p className="text-emerald-400">{text}</p>}
    </div>
  );
};

export default Loader;