import React, { useState, lazy, Suspense } from 'react';
import Loader from '../../components/Loader';

const SelectionView = lazy(() => import('./SelectionView'));
const SensorScanView = lazy(() => import('./SensorScanView'));
const CameraScanView = lazy(() => import('./CameraScanView'));

const DetectView: React.FC = () => {
  const [mode, setMode] = useState<'selection' | 'camera' | 'sensor'>('selection');

  const goBack = () => setMode('selection');

  const renderCurrentView = () => {
    switch(mode) {
      case 'sensor':
        return <SensorScanView goBack={goBack} />;
      case 'camera':
        return <CameraScanView goBack={goBack} />;
      case 'selection':
      default:
        return <SelectionView setMode={setMode} />;
    }
  }

  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader /></div>}>
      {renderCurrentView()}
    </Suspense>
  )
};

export default DetectView;
