import React, { useState, useRef, useEffect, lazy, Suspense } from 'react';
import { ZapIcon, BarChart3Icon, DollarSignIcon } from '../components/icons/Icons';
import Loader from '../components/Loader';

const AnalyticsScreen = lazy(() => import('./AnalyticsScreen'));
const CostScreen = lazy(() => import('./CostScreen'));
const DetectView = lazy(() => import('./detection/DetectView'));

interface DetectionScreenProps {
  scrollTop: number;
}

const DetectionScreen: React.FC<DetectionScreenProps> = ({ scrollTop }) => {
  const [activeTab, setActiveTab] = useState<'detect' | 'analytics' | 'cost'>('detect');
  const [isSubHeaderVisible, setIsSubHeaderVisible] = useState(true);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const scrollDelta = scrollTop - lastScrollTop.current;

    if (scrollDelta > 10 && scrollTop > 50) {
      setIsSubHeaderVisible(false);
    } else if (scrollDelta < -10 || scrollTop <= 50) {
      setIsSubHeaderVisible(true);
    }
    
    lastScrollTop.current = scrollTop <= 0 ? 0 : scrollTop;
  }, [scrollTop]);
  
  const tabs = [
    { name: 'detect', label: 'Detect', icon: ZapIcon, color: 'yellow' },
    { name: 'analytics', label: 'Analytics', icon: BarChart3Icon, color: 'blue' },
    { name: 'cost', label: 'Cost', icon: DollarSignIcon, color: 'emerald' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'detect':
        return <DetectView />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'cost':
        return <CostScreen />;
      default:
        return null;
    }
  };
  
  const getTabColors = (color: string, isActive: boolean) => {
    const colorVariants = {
      yellow: {
        bg: 'bg-yellow-500',
        shadow: 'shadow-yellow-500/40',
        text: 'text-yellow-500',
        darkText: 'dark:text-yellow-400',
      },
      blue: {
        bg: 'bg-sky-500',
        shadow: 'shadow-sky-500/40',
        text: 'text-sky-500',
        darkText: 'dark:text-sky-400',
      },
      emerald: {
        bg: 'bg-emerald-600',
        shadow: 'shadow-emerald-500/40',
        text: 'text-emerald-600',
        darkText: 'dark:text-emerald-400',
      },
    };
    const c = colorVariants[color as keyof typeof colorVariants];

    if (isActive) {
      return `${c.bg} text-white shadow-lg ${c.shadow} scale-105`;
    }
    return `${c.text} ${c.darkText} hover:bg-black/5 dark:hover:bg-white/10`;
  };

  return (
    <div className="relative">
      <div className={`sticky top-0 z-10 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm -mx-4 px-4 pt-2 mb-4 transition-all duration-300 ease-in-out ${isSubHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
        <div className="flex justify-around items-center p-2 bg-gray-200/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            const Icon = tab.icon;
            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name as any)}
                className={`flex-1 flex flex-col items-center justify-center space-y-1.5 p-2 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800 ${
                  getTabColors(tab.color, isActive)
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-bold tracking-wide">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="animate-fade-in">
        <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader /></div>}>
          {renderContent()}
        </Suspense>
      </div>
    </div>
  );
};

export default DetectionScreen;