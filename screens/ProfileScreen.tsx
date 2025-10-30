
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { UserProfile } from '../types';
import Loader from '../components/Loader';

const useUserProfile = () => {
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Chamika',
        age: '',
        preferences: '',
        allergies: '',
        healthStatus: '',
        familyMember: '',
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            }
        } catch (error) {
            console.error("Failed to load profile from localStorage", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const saveProfile = (newProfile: UserProfile) => {
        try {
            localStorage.setItem('userProfile', JSON.stringify(newProfile));
            setProfile(newProfile);
        } catch (error) {
            console.error("Failed to save profile to localStorage", error);
        }
    };

    return { profile, saveProfile, isLoaded };
};


const ProfileScreen: React.FC = () => {
    const { profile, saveProfile, isLoaded } = useUserProfile();
    const [formData, setFormData] = useState(profile);
    const [password, setPassword] = useState('Chamika');
    const [confirmPassword, setConfirmPassword] = useState('Chamika');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isLoaded) {
            setFormData(profile);
        }
    }, [profile, isLoaded]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setTimeout(() => setMessage(''), 3000);
            return;
        }
        saveProfile(formData);
        setMessage('Profile saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    const formFields = [
      { label: 'Name', key: 'name', type: 'text' },
      { label: 'Age', key: 'age', type: 'text' },
      { label: 'Preferences', key: 'preferences', type: 'textarea' },
      { label: 'Allergies', key: 'allergies', type: 'textarea' },
      { label: 'Health Status', key: 'healthStatus', type: 'textarea' },
      { label: 'Family Member', key: 'familyMember', type: 'text' },
    ];
    
    const passwordFields = [
         { label: 'Password', key: 'password', value: password, setter: setPassword },
         { label: 'Re-enter the password', key: 'confirmPassword', value: confirmPassword, setter: setConfirmPassword },
    ]

    if (!isLoaded) {
        return <Loader text="Loading Profile..." />;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
                <p className="text-emerald-600 dark:text-emerald-200">Manage your settings and preferences.</p>
            </div>

            <Card>
                <form onSubmit={handleSave} className="space-y-4">
                    {formFields.map(field => (
                       <div key={field.key}>
                            <label htmlFor={field.key} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{field.label}</label>
                            {field.type === 'textarea' ? (
                                 <textarea
                                    id={field.key}
                                    name={field.key}
                                    value={formData[field.key as keyof UserProfile]}
                                    onChange={handleChange}
                                    className="w-full bg-gray-200/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-500 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                                    rows={2}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.key}
                                    name={field.key}
                                    value={formData[field.key as keyof UserProfile]}
                                    onChange={handleChange}
                                    className="w-full bg-gray-200/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-500 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            )}
                       </div>
                    ))}
                    {passwordFields.map(field => (
                         <div key={field.key}>
                            <label htmlFor={field.key} className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{field.label}</label>
                            <input
                                type="password"
                                id={field.key}
                                value={field.value}
                                onChange={(e) => field.setter(e.target.value)}
                                className="w-full bg-gray-200/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-500 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    ))}
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                        Save Profile
                    </button>
                    {message && <p className={`text-center p-2 rounded-md ${message.includes('successfully') ? 'bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300' : 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300'}`}>{message}</p>}
                </form>
            </Card>

             <Card>
                <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4">Activity History</h2>
                <p className="text-center text-gray-500 dark:text-gray-400">Activity history is not yet implemented.</p>
            </Card>
        </div>
    );
};

export default ProfileScreen;
