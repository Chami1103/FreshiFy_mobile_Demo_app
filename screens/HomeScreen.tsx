import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getStats, getHistory, getLastSensorScan, getLastImageScan, getPredictionHistory } from '../services/apiService';
import { BarChart3Icon, RssIcon, CameraIcon, ThermometerIcon, DropletIcon } from '../components/icons/Icons';
import { useTheme } from '../contexts/ThemeContext';
import { StatsData, HistoryData, LastSensorData, LastImageData, PredictionHistoryItem } from '../types';
import StatusBadge from '../components/StatusBadge';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [lastSensor, setLastSensor] = useState<LastSensorData | null>(null);
  const [lastImage, setLastImage] = useState<LastImageData | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, historyData, lastSensorData, lastImageData, predHistoryData] = await Promise.all([
          getStats(),
          getHistory(),
          getLastSensorScan(),
          getLastImageScan(),
          getPredictionHistory(),
        ]);
        setStats(statsData);
        setHistory(historyData);
        setLastSensor(lastSensorData);
        setLastImage(lastImageData);
        setPredictionHistory(predHistoryData);
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader text="Loading Dashboard..." /></div>;
  }

  if (error) {
    return <Card><p className="text-center text-red-500">{error}</p></Card>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to FreshiFy</h1>
        <p className="text-emerald-600 dark:text-emerald-200">Your intelligent food monitoring dashboard.</p>
      </div>
      
      {stats && (
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4">Overall Stats</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div><p className="text-3xl font-bold">{stats.totalScans}</p><p className="text-sm text-gray-600 dark:text-gray-300">Total Scans</p></div>
            <div><p className="text-3xl font-bold text-green-500 dark:text-green-400">{stats.fresh}</p><p className="text-sm text-gray-600 dark:text-gray-300">Fresh Items</p></div>
            <div><p className="text-3xl font-bold text-red-500 dark:text-red-400">{stats.spoiled}</p><p className="text-sm text-gray-600 dark:text-gray-300">Spoiled Items</p></div>
            <div><p className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">{stats.freshnessPercentage}%</p><p className="text-sm text-gray-600 dark:text-gray-300">Freshness Rate</p></div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lastSensor ? (
          <Card>
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4 flex items-center gap-2"><RssIcon className="w-6 h-6" />Last Sensor Scan</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center"><span className="font-bold text-lg">{lastSensor.foodName}</span><StatusBadge status={lastSensor.status} /></div>
              <p className="flex items-center gap-2"><span className="font-semibold text-gray-600 dark:text-gray-300">NH₃:</span> {lastSensor.nh3} ppm</p>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400"><p className="flex items-center gap-1"><DropletIcon className="w-4 h-4" /> {lastSensor.humidity}%</p><p className="flex items-center gap-1"><ThermometerIcon className="w-4 h-4" /> {lastSensor.temperature}°C</p></div>
            </div>
          </Card>
        ) : (<Card><p>No sensor scans yet.</p></Card>)}
        
        {lastImage ? (
          <Card>
            <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4 flex items-center gap-2"><CameraIcon className="w-6 h-6" />Last Image Scan</h2>
            <div className="flex items-center gap-4">
              <img src={lastImage.imageUrl} alt={lastImage.foodName} className="w-20 h-20 object-cover rounded-md flex-shrink-0"/>
              <div className="flex-grow space-y-1"><p className="font-bold text-lg">{lastImage.foodName}</p><StatusBadge status={lastImage.status} /></div>
            </div>
          </Card>
        ) : (<Card><p>No image scans yet.</p></Card>)}
      </div>

      {history.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4 flex items-center gap-2"><BarChart3Icon className="w-6 h-6" />Weekly NH₃ Average (ppm)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)"} />
                <XAxis dataKey="date" stroke={theme === 'light' ? "#374151" : "#E2E8F0"} />
                <YAxis stroke={theme === 'light' ? "#374151" : "#E2E8F0"} />
                <Tooltip contentStyle={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.8)', border: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`, color: theme === 'light' ? '#111827' : '#FFFFFF' }} />
                <Line type="monotone" dataKey="nh3_avg" stroke="#34D399" strokeWidth={2} activeDot={{ r: 8 }} name="NH₃ Avg" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {predictionHistory.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4">Recent Scans</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {predictionHistory.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                <div className="flex-shrink-0">{item.type === 'camera' ? <CameraIcon className="w-6 h-6 text-yellow-500"/> : <RssIcon className="w-6 h-6 text-sky-500"/>}</div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 dark:text-white">{item.foodName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.timestamp).toLocaleString()}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default HomeScreen;