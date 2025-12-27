import React from 'react';
import { Outlet } from 'react-router-dom';
import HomeNavbar from './HomeNavbar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f8faf5]">
      <HomeNavbar />
      <Outlet />
    </div>
  );
}
