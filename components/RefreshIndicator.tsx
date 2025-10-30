import React from 'react';
import Loader from './Loader';
import { ArrowDownIcon } from './icons/Icons';

interface RefreshIndicatorProps {
  pullPosition: number;
  isRefreshing: boolean;
}

const RefreshIndicator: React.FC<RefreshIndicatorProps> = ({ pullPosition, isRefreshing }) => {
  const opacity = Math.min(pullPosition / 80, 1);
  const rotation = Math.min(pullPosition, 100) * 1.8; // 0 to 180 degrees

  return (
    <div
      className="absolute top-0 left-0 right-0 h-16 flex justify-center items-center transition-opacity duration-200"
      style={{
        opacity: isRefreshing ? 1 : opacity,
        transform: `translateY(${pullPosition / 2 - 32}px)`, // Move it up and down with pull
      }}
    >
      {isRefreshing ? (
        <Loader size="sm" />
      ) : (
        <div
          className="p-2 bg-white/50 dark:bg-gray-800/50 rounded-full shadow-md"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <ArrowDownIcon className="w-6 h-6 text-emerald-500" />
        </div>
      )}
    </div>
  );
};

export default RefreshIndicator;
