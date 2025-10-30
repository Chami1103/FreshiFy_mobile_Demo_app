import React, { useState } from 'react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { ArrowLeftIcon } from '../../components/icons/Icons';
import { startSensorScan } from '../../services/apiService';
import { LastSensorData } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 mb-4 transition-colors" aria-label="Go back">
      <ArrowLeftIcon className="w-5 h-5" /> Back
    </button>
);

const SensorScanView: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const { addNotification } = useNotifications();
  const { theme } = useTheme();
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [sensorData, setSensorData] = useState<LastSensorData | null>(null);
  const [sensorError, setSensorError] = useState<string>('');

  const handleSensorScan = async () => {
    setIsScanning(true);
    setSensorData(null);
    setSensorError('');
    try {
      const data = await startSensorScan();
      setSensorData(data);
      addNotification({ type: 'success', title: 'Scan Complete', message: `FreshiFy sensor scan finished successfully.` });
    } catch (err) {
      setSensorError("Failed to connect to the sensor. Please try again.");
      addNotification({ type: 'error', title: 'Scan Failed', message: 'Could not connect to the FreshiFy sensor.' });
    } finally {
      setIsScanning(false);
    }
  };

  const chartData = sensorData ? [
    { name: 'NH₃', value: sensorData.nh3, unit: 'ppm' },
    { name: 'Humidity', value: sensorData.humidity, unit: '%' },
    { name: 'Temp', value: sensorData.temperature, unit: '°C' },
  ] : [];

  const chartColors = ['#38BDF8', '#A78BFA', '#FBBF24'];

  return (
    <div className="space-y-6">
      <BackButton onClick={goBack} />
      <Card className="text-center flex flex-col items-center justify-center min-h-[300px]">
        {!isScanning && !sensorData && <button onClick={handleSensorScan} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">Start Scan</button>}
        {isScanning && <Loader text="Scanning for device..." />}
        {sensorError && <p className="text-red-500 dark:text-red-400 text-center bg-red-200 dark:bg-red-900/50 p-3 rounded-lg">{sensorError}</p>}
        {sensorData && (
          <div className="animate-fade-in w-full">
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4">Scan Complete</h2>
            <div className="h-48 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="name" stroke={theme === 'light' ? "#374151" : "#A0AEC0"} />
                      <YAxis stroke={theme === 'light' ? "#374151" : "#A0AEC0"} />
                      <Tooltip 
                          contentStyle={{ 
                              backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.8)', 
                              border: '1px solid rgba(0,0,0,0.1)',
                              color: theme === 'light' ? '#111827' : '#FFFFFF' 
                          }}
                          formatter={(value, name, props) => [`${value} ${props.payload.unit}`, name]}
                      />
                      <Bar dataKey="value" barSize={40}>
                          {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={chartColors[index]} />
                          ))}
                      </Bar>
                  </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Timestamp: {new Date(sensorData.timestamp).toLocaleString()}</p>
            <button onClick={handleSensorScan} className="mt-6 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Scan Again</button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SensorScanView;
