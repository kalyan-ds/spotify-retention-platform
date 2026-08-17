import React from 'react';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
