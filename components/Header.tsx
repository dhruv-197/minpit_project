import React from 'react';
import { Back, Refresh } from './Icons';

interface HeaderProps {
  title: string;
  onRefresh: () => void;
  isLoading: boolean;
  isLive: boolean;
  setIsLive: (isLive: boolean) => void;
  onChangeMine: () => void;
}

const LiveIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
    <span className="relative flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-low opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-low"></span>
    </span>
    <span className="font-semibold text-sm text-low">LIVE</span>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ title, onRefresh, isLoading, isLive, setIsLive, onChangeMine }) => {
  return (
    <header className="bg-sidebar/80 backdrop-blur-sm p-4 border-b border-border flex justify-between items-center z-10 flex-shrink-0">
      <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-4">
          {isLive && <LiveIndicator />}
          <label htmlFor="live-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" id="live-toggle" className="sr-only" checked={isLive} onChange={() => setIsLive(!isLive)} />
              <div className="block bg-primary w-14 h-8 rounded-full"></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isLive ? 'transform translate-x-6 bg-gradient-to-r from-accent to-secondary-accent' : ''}`}></div>
            </div>
          </label>
        </div>

        <button 
          onClick={onRefresh} 
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-primary text-text-primary font-semibold rounded-lg hover:bg-opacity-80 disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors"
          title="Refresh data for the current mine"
        >
          <Refresh isLoading={isLoading} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>

        <button 
          onClick={onChangeMine} 
          className="flex items-center px-4 py-2 bg-gradient-to-r from-accent to-secondary-accent text-white font-semibold rounded-lg hover:from-accent-hover hover:to-accent transition-all"
        >
          <Back />
          Change Mine
        </button>
      </div>
    </header>
  );
};