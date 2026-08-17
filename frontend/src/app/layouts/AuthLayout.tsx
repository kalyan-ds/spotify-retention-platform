import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-spotify-green/10 via-neutral-950 to-neutral-950">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
