import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { getStats, getHistory } from '../services/apiService';
import { useTheme } from '../contexts/ThemeContext';
import { StatsData, HistoryData } from '../types';

const AnalyticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [history, setHistory] = useState<HistoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, historyData] = await Promise.all([getStats(), getHistory()]);
        setStats(statsData);
        setHistory(historyData);
      } catch (err) {
        setError('Failed to load analytics data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader text="Loading Analytics..." /></div>;
  }

  if (error) {
    return <Card><p className="text-center text-red-500">{error}</p></Card>;
  }
  
  if (!stats || !history) return null;

  // Data for Pie Chart
  const pieData = [
    { name: 'Fresh', value: stats.fresh },
    { name: 'Spoiled', value: stats.spoiled },
  ];
  const PIE_COLORS = ['#10B981', '#EF4444'];

  // Data for Bar Chart (Scan Method Usage)
  const totalSensorScans = history.reduce((acc, cur) => acc + cur.sensorScans, 0);
  const totalCameraScans = history.reduce((acc, cur) => acc + cur.cameraScans, 0);
  const scanMethodData = [
    { name: 'Sensor', count: totalSensorScans },
    { name: 'Camera', count: totalCameraScans },
  ];

  // Data for Quick Summary
  const avgNh3 = history.reduce((acc, cur) => acc + cur.nh3_avg, 0) / history.length;
  
  const tooltipStyle = {
    backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.8)',
    border: `1px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.3)'}`,
    color: theme === 'light' ? '#111827' : '#FFFFFF'
  };
  const axisStrokeColor = theme === 'light' ? "#374151" : "#A0AEC0";
  const gridStrokeColor = theme === 'light' ? "rgba(0, 0, 0, 0.1)" : "#4A5568";
  const legendStyle = { color: theme === 'light' ? "#374151" : "#E5E7EB" };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4"><p className="text-2xl lg:text-3xl font-bold">{stats.totalScans}</p><p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Total Scans</p></Card>
        <Card className="text-center p-4"><p className="text-2xl lg:text-3xl font-bold text-green-500">{stats.fresh}</p><p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Fresh Items</p></Card>
        <Card className="text-center p-4"><p className="text-2xl lg:text-3xl font-bold text-red-500">{stats.spoiled}</p><p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Spoiled Items</p></Card>
        <Card className="text-center p-4"><p className="text-2xl lg:text-3xl font-bold text-sky-500 dark:text-sky-400">{avgNh3.toFixed(1)}</p><p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Avg. NH₃</p></Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">Status Distribution</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke={PIE_COLORS[index % PIE_COLORS.length]} />))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={legendStyle}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">Scan Method Usage</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanMethodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                <XAxis type="category" dataKey="name" stroke={axisStrokeColor} />
                <YAxis stroke={axisStrokeColor} />
                <Tooltip contentStyle={tooltipStyle} cursor={{fill: theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)'}} />
                <Bar dataKey="count" barSize={60}><Cell fill="#38BDF8" /><Cell fill="#FBBF24" /></Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card>
        <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">Weekly Freshness Trend</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} /><XAxis dataKey="date" stroke={axisStrokeColor} /><YAxis stroke={axisStrokeColor} /><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={legendStyle}/>
              <Line type="monotone" dataKey="fresh" stroke="#10B981" name="Fresh" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="spoiled" stroke="#EF4444" name="Spoiled" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">Weekly NH₃ Average (ppm)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} /><XAxis dataKey="date" stroke={axisStrokeColor} /><YAxis stroke={axisStrokeColor} /><Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={legendStyle}/>
              <Line type="monotone" dataKey="nh3_avg" stroke="#38B2AC" name="NH₃ Average" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsScreen;