import React from 'react';

export const LoadingFullscreen: React.FC = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-accent/20 animate-pulse rounded ${className ?? 'h-4 w-full'}`} />
);


