
import React from 'react';
import { Screen, NavItem } from '../types';

interface BottomNavProps {
  items: NavItem[];
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ items, activeScreen, setActiveScreen }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = activeScreen === item.name;
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={() => setActiveScreen(item.name)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
                isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-500 hover:text-emerald-500 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
