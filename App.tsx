import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RiskMapView } from './components/RiskMapView';
import { AlertsView } from './components/AlertsView';
import { AnalysisView } from './components/AnalysisView';
import { SettingsView } from './components/SettingsView';
import { LandingPage } from './components/LandingPage';
import { NationwideMapView } from './components/NationwideMapView';
import { getMineData } from './services/geminiService';
import type { Mine, MineData } from './types';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [mineData, setMineData] = useState<MineData | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  const fetchData = useCallback(async (mine: Mine) => {
    if (!mine) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMineData(mine);
      setMineData(data);
      // Removed call to saveMineDataToHistory
    } catch (e) {
      console.error(e);
      setError('Failed to fetch mine data. Please try again.');
      setMineData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedMine) {
      fetchData(selectedMine);
    }
  }, [selectedMine, fetchData]);
  
  useEffect(() => {
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isLive && selectedMine) {
      interval = setInterval(() => {
        if (selectedMine) {
            fetchData(selectedMine);
        }
      }, 3600000); // Refresh every 1 hour
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLive, selectedMine, fetchData]);

  const handleSelectMine = (mine: Mine) => {
    setMineData(null); // Clear old data
    setCurrentView('dashboard');
    setSelectedMine(mine);
  };
  
  const handleChangeMine = () => {
    setSelectedMine(null);
    setMineData(null);
  };

  const handleRefresh = () => {
    if(selectedMine) {
      fetchData(selectedMine);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard data={mineData} />;
      case 'map':
        return <RiskMapView data={mineData} />;
      case 'alerts':
        return <AlertsView data={mineData} />;
      case 'analysis':
        return <AnalysisView mineData={mineData} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard data={mineData} />;
    }
  };
  
  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  if (!selectedMine) {
    return <NationwideMapView onSelectMine={handleSelectMine} />;
  }
  
  return (
    <div className="flex bg-background min-h-screen">
      <Sidebar mine={selectedMine} currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 flex flex-col">
        <Header 
          title={selectedMine.name} 
          onRefresh={handleRefresh}
          isLoading={isLoading}
          isLive={isLive}
          setIsLive={setIsLive}
          onChangeMine={handleChangeMine}
        />
        <div className="p-6 flex-grow overflow-y-auto">
          {error ? <div className="text-center text-critical text-lg p-8">{error}</div> : renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;