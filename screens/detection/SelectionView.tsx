import React from 'react';
import { CameraIcon, RssIcon } from '../../components/icons/Icons';

interface SelectionViewProps {
  setMode: (mode: 'sensor' | 'camera') => void;
}

const SelectionView: React.FC<SelectionViewProps> = React.memo(({ setMode }) => {
  return (
    <div className="space-y-4">
        <div role="button" tabIndex={0} onClick={() => setMode('sensor')} onKeyDown={(e) => e.key === 'Enter' && setMode('sensor')} className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-200/50 dark:border-white/20 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-white cursor-pointer hover:border-emerald-400 transition-all duration-300 transform hover:scale-105" aria-label="Select sensor scan">
          <div className="flex items-center gap-6">
            <RssIcon className="w-12 h-12 text-sky-500 dark:text-sky-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sensor Scan</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Get real-time data from your FreshiFy device.</p>
            </div>
          </div>
        </div>
        <div role="button" tabIndex={0} onClick={() => setMode('camera')} onKeyDown={(e) => e.key === 'Enter' && setMode('camera')} className="bg-white/60 dark:bg-white/10 backdrop-blur-md border border-gray-200/50 dark:border-white/20 rounded-2xl shadow-lg p-6 text-gray-800 dark:text-white cursor-pointer hover:border-emerald-400 transition-all duration-300 transform hover:scale-105" aria-label="Select camera scan">
          <div className="flex items-center gap-6">
            <CameraIcon className="w-12 h-12 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Camera Scan</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Analyze food freshness from an image.</p>
            </div>
          </div>
        </div>
    </div>
  );
});

export default SelectionView;
