import React from 'react';
import { DashboardIcon, MapIcon, AlertIcon, AnalysisIcon, SettingsIcon, HistoryIcon } from './Icons';
import type { Mine } from '../types';

interface SidebarProps {
    mine: Mine;
    currentView: string;
    onViewChange: (view: string) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-accent text-white shadow-lg'
                : 'text-text-secondary hover:bg-primary hover:text-text-primary'
        }`}
    >
        <span className="mr-4">{icon}</span>
        <span>{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ mine, currentView, onViewChange }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
        { id: 'map', label: 'Risk Map', icon: <MapIcon /> },
        { id: 'alerts', label: 'Active Alerts', icon: <AlertIcon /> },
        { id: 'analysis', label: 'AI Analysis', icon: <AnalysisIcon /> },
        { id: 'history', label: 'Data History', icon: <HistoryIcon /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
        <aside className="bg-sidebar w-64 p-4 flex flex-col flex-shrink-0 border-r border-border h-screen sticky top-0">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-text-primary">MineSafe</h1>
                <p className="text-xs text-text-secondary mt-1">{mine.name}</p>
                <p className="text-xs text-text-secondary">{mine.location}</p>
            </div>
            <nav className="flex flex-col space-y-2">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={currentView === item.id}
                        onClick={() => onViewChange(item.id)}
                    />
                ))}
            </nav>
            <div className="mt-auto text-center text-xs text-text-secondary">
                <p>&copy; {new Date().getFullYear()} MineSafe India</p>
                <p>v1.0.0</p>
            </div>
        </aside>
    );
};