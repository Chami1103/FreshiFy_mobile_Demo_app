
import React from 'react';
import { BellIcon } from './icons/Icons';
import { Screen } from '../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  setActiveScreen: (screen: Screen) => void;
  isHeaderVisible: boolean;
}

const Header: React.FC<HeaderProps> = ({ setActiveScreen, isHeaderVisible }) => {
  return (
    <header className={`sticky top-0 z-20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
      <button
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setActiveScreen('home')}
        aria-label="Go to Home screen"
      >
        <span className="text-3xl" role="img" aria-label="leaf">🍃</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider">
          FreshiFy
        </span>
      </button>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => setActiveScreen('notifications')}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="View notifications"
        >
          <BellIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
