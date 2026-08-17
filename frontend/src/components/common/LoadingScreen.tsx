import React from 'react';

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Loading AI Platform Intelligence...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-spotify-green/20" />
        <div className="absolute inset-0 rounded-full border-4 border-spotify-green border-t-transparent animate-spin" />
        <div className="absolute inset-3 rounded-full bg-spotify-green/10 flex items-center justify-center font-bold text-spotify-green text-xs">
          AI
        </div>
      </div>
      <p className="text-sm font-medium text-neutral-300 animate-pulse">{message}</p>
    </div>
  );
};
