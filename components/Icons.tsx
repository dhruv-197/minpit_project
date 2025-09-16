import React from 'react';

// For Header
export const Refresh: React.FC<{ isLoading?: boolean }> = ({ isLoading }) => (
    <svg className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4L15 9M4 20l5-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9a8 8 0 0113.59-4.51M20 15a8 8 0 01-13.59 4.51" />
    </svg>
);

export const Back: React.FC = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
);

// For Dashboard DataPoint
const SeismicIcon: React.FC = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 8.25h16M4 15.75h16M8.25 4v16.5M15.75 4v16.5"></path></svg>;
const GasIcon: React.FC = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12.75 6.375C12.75 5.54 12.06 4.5 11.25 4.5s-1.5.75-1.5 1.5v5.25c0 .835.69 1.875 1.5 1.875s1.5-1.04 1.5-1.875V6.375z"></path><path d="M9 14.25c0 1.24-.812 2.25-1.875 2.25S5.25 15.49 5.25 14.25v-2.25c0-1.24.812-2.25 1.875-2.25S9 10.76 9 12v2.25z"></path><path d="M15 14.25c0 1.24.812 2.25 1.875 2.25s1.875-1.01 1.875-2.25v-2.25c0-1.24-.812-2.25-1.875-2.25S15 10.76 15 12v2.25z"></path></svg>;
const TempIcon: React.FC = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 18.75V5.25m-3 3.75h6"></path><path d="M9 12.75a3.75 3.75 0 01-3.75-3.75V5.25a3.75 3.75 0 017.5 0v3.75a3.75 3.75 0 01-3.75 3.75z"></path></svg>;
const AirflowIcon: React.FC = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3.75 9.75h16.5m-16.5 4.5h16.5M6 4.5l3.75 3.75M6 19.5l3.75-3.75m8.5 0L21.75 12m-3.5-3.75L21.75 12"></path></svg>;
const WindSpeedIcon: React.FC = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 15.75A2.25 2.25 0 1011.25 18a2.25 2.25 0 00-2.25-2.25z"></path><path d="M12 8.25c-2.074 0-3.75 1.676-3.75 3.75s1.676 3.75 3.75 3.75c2.073 0 3.75-1.676 3.75-3.75S14.073 8.25 12 8.25z"></path><path d="M18.75 6.75A2.25 2.25 0 1016.5 9a2.25 2.25 0 002.25-2.25z"></path></svg>;
const DisplacementIcon: React.FC = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>;
const PorePressureIcon: React.FC = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;


export const DataIcons = {
    'seismic': SeismicIcon,
    'gas': GasIcon,
    'temperature': TempIcon,
    'air-flow': AirflowIcon,
    'wind-speed': WindSpeedIcon,
    'displacement': DisplacementIcon,
    'pore-pressure': PorePressureIcon,
};

// For Sidebar
export const DashboardIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2l-7 7-7-7m14 0v10a1 1 0 01-1 1h-3"></path></svg>;
export const MapIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6"></path></svg>;
export const AlertIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>;
export const AnalysisIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
export const SettingsIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;
export const HistoryIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;


// For AnalysisView
export const LightbulbIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
    </svg>
);

export const ShieldIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.607 11.955 11.955 0 019 2.607 12.02 12.02 0 00-2.382-9.988z"></path>
    </svg>
);

// FIX: Add Csv and Json icons required by HistoryView.
// For HistoryView
export const Csv: React.FC = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"></path></svg>
);

export const Json: React.FC = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
);