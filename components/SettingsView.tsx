import React, { useState, useEffect } from 'react';
import type { NotificationSettings, RiskLevel } from '../types';
import { Card } from './Card';

const SETTINGS_KEY = 'mineSafe_notificationSettings';

const defaultSettings: NotificationSettings = {
    email: '',
    phone: '',
    notifyOn: {
        Low: false,
        Medium: false,
        Hard: true,
        Critical: true,
    },
};

export const SettingsView: React.FC = () => {
    const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem(SETTINGS_KEY);
            if (savedSettings) {
                // Ensure new settings structure is merged with old, if necessary
                const loaded = JSON.parse(savedSettings);
                if (loaded.notifyOn.High !== undefined && loaded.notifyOn.Hard === undefined) {
                    loaded.notifyOn.Hard = loaded.notifyOn.High;
                    delete loaded.notifyOn.High;
                }
                setSettings(s => ({...s, ...loaded}));
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage:", error);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
        setIsSaved(false);
    };

    const handleCheckboxChange = (level: RiskLevel) => {
        setSettings(prev => ({
            ...prev,
            notifyOn: {
                ...prev.notifyOn,
                [level]: !prev.notifyOn[level],
            },
        }));
        setIsSaved(false);
    };

    const handleSave = () => {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 3000); // Hide message after 3 seconds
        } catch (error) {
            console.error("Failed to save settings to localStorage:", error);
            alert("Error: Could not save settings.");
        }
    };
    
    const handleTestAlert = () => {
        if (!settings.email && !settings.phone) {
            alert("Please enter an email or phone number to send a test alert.");
            return;
        }
        const destinations = [settings.email, settings.phone].filter(Boolean).join(' and ');
        alert(`This is a test notification.\nIn a real system, an alert for a CRITICAL event would be sent to: ${destinations}`);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card title="Notification Preferences">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleInputChange}
                            placeholder="e.g., manager@mine.com"
                            className="w-full bg-primary p-2 rounded-md border border-border focus:ring-accent focus:border-accent"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1">Phone Number (for SMS Alerts)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={settings.phone}
                            onChange={handleInputChange}
                            placeholder="e.g., +919876543210"
                            className="w-full bg-primary p-2 rounded-md border border-border focus:ring-accent focus:border-accent"
                        />
                    </div>
                </div>
            </Card>

            <Card title="Trigger Levels">
                <p className="text-sm text-text-secondary mb-4">Select the risk levels for which you want to receive notifications.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(Object.keys(settings.notifyOn) as RiskLevel[]).map(level => (
                        <label key={level} className="flex items-center space-x-3 cursor-pointer p-3 bg-primary rounded-md border border-border hover:bg-border transition-colors">
                            <input
                                type="checkbox"
                                checked={settings.notifyOn[level]}
                                onChange={() => handleCheckboxChange(level)}
                                className="h-5 w-5 rounded bg-background border-border text-accent focus:ring-accent"
                            />
                            <span className="font-medium text-text-primary">{level}</span>
                        </label>
                    ))}
                </div>
            </Card>

            <div className="flex justify-end items-center gap-4">
                {isSaved && <p className="text-low transition-opacity duration-300">Settings saved successfully!</p>}
                <button
                    onClick={handleTestAlert}
                    className="px-6 py-2 bg-primary text-text-primary font-semibold rounded-lg hover:bg-opacity-80 transition-colors"
                >
                    Send Test Alert
                </button>
                 <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-accent to-secondary-accent text-white font-semibold rounded-lg hover:from-accent-hover hover:to-accent transition-all"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};