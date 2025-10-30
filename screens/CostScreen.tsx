import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import { CostItem } from '../types';
import { useNotifications } from '../contexts/NotificationContext';
import { DownloadIcon } from '../components/icons/Icons';

const useCostItems = () => {
    const [items, setItems] = useState<CostItem[]>([]);

    useEffect(() => {
        try {
            const savedItems = localStorage.getItem('costItems');
            if (savedItems) {
                setItems(JSON.parse(savedItems));
            }
        } catch (error) {
            console.error("Failed to load cost items from localStorage", error);
        }
    }, []);

    const saveItems = (newItems: CostItem[]) => {
        try {
            localStorage.setItem('costItems', JSON.stringify(newItems));
            setItems(newItems);
        } catch (error) {
            console.error("Failed to save cost items to localStorage", error);
        }
    };
    
    const addItem = (item: Omit<CostItem, 'id'>) => {
        const newItem = { ...item, id: new Date().toISOString() };
        saveItems([...items, newItem]);
    };

    const deleteItem = (id: string) => {
        const updatedItems = items.filter(item => item.id !== id);
        saveItems(updatedItems);
    };
    
    const clearAllItems = () => {
        saveItems([]);
    };

    return { items, addItem, deleteItem, clearAllItems };
};

const CostScreen: React.FC = () => {
    const { items, addItem, deleteItem, clearAllItems } = useCostItems();
    const { addNotification } = useNotifications();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const totalCost = useMemo(() => {
        return items.reduce((total, item) => total + item.amount, 0);
    }, [items]);
    
    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to delete all cost items? This action cannot be undone.')) {
            clearAllItems();
        }
    };
    
    const handleDownload = () => {
        addNotification({
            type: 'info',
            title: 'Report Generating',
            message: 'Your cost report is being generated and will be available shortly.',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!name.trim() || isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid name and positive amount.');
            return;
        }
        addItem({ name: name.trim(), amount: numAmount });
        setName('');
        setAmount('');
        setError('');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4">Add New Cost</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="foodName" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Food Name</label>
                        <input id="foodName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Apples" className="w-full bg-gray-200/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-500 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                     <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Amount (Rs)</label>
                        <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 150.50" className="w-full bg-gray-200/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-500 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500" />
                    </div>
                    {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">Add Item</button>
                </form>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300">Cost History</h2>
                    {items.length > 0 && (
                        <div className="flex items-center gap-4">
                            <button onClick={handleDownload} className="text-sky-500 dark:text-sky-400 hover:text-sky-400 dark:hover:text-sky-300" aria-label="Download Report">
                                <DownloadIcon className="w-6 h-6" />
                            </button>
                            <button onClick={handleClearAll} className="text-sm text-red-500 dark:text-red-400 hover:underline">Clear All</button>
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    {items.length > 0 ? (
                        items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 rounded-lg">
                                <span className="text-gray-800 dark:text-gray-200">{item.name}</span>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold">Rs {item.amount.toFixed(2)}</span>
                                    <button onClick={() => deleteItem(item.id)} className="text-red-500 dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 font-bold text-lg" aria-label={`Delete ${item.name}`}>&times;</button>
                                </div>
                            </div>
                        ))
                    ) : ( <p className="text-center text-gray-600 dark:text-gray-400">No costs added yet.</p> )}
                </div>
                {items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-300 dark:border-white/20 flex justify-between items-center font-bold text-lg">
                      <span className="text-emerald-600 dark:text-emerald-300">Total:</span>
                      <span className="text-emerald-600 dark:text-emerald-300">Rs {totalCost.toFixed(2)}</span>
                  </div>
                )}
            </Card>
             <Card>
                <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4">Reminders & Reports</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => addNotification({type: 'info', title: 'Cost Reminder', message: 'Remember to log your grocery costs for this week.'})} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg">Send Reminder</button>
                    <button onClick={() => addNotification({type: 'success', title: 'Monthly Report Ready', message: 'Your monthly cost summary is now available.'})} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">Get Report</button>
                </div>
            </Card>
        </div>
    );
};

export default CostScreen;