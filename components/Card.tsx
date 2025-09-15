import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  fullHeight?: boolean;
}

export const Card: React.FC<CardProps> = ({ title, children, fullHeight = false }) => {
  return (
    <div className={`bg-card rounded-lg shadow-lg p-6 border border-border ${fullHeight ? 'h-full flex flex-col' : ''}`}>
      {title && <h3 className="text-lg font-bold text-text-primary mb-4 border-b border-border pb-3">{title}</h3>}
      <div className={`${fullHeight ? 'flex-grow' : ''}`}>
        {children}
      </div>
    </div>
  );
};