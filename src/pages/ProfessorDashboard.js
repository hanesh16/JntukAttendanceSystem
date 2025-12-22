import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HeaderNav from '../components/HeaderNav';
import ProfilePage from './ProfilePage';
import AttendancePage from './AttendancePage';
import PDFsPage from './PDFsPage';

export default function ProfessorDashboard() {
  const location = useLocation();
  const isProfile = location.pathname.endsWith('/profile');
  const isAttendance = location.pathname.endsWith('/attendance');

  return (
    <div className="w-full min-h-screen bg-[#f8faf5]">
      <HeaderNav title={isProfile ? 'Student Profile' : isAttendance ? 'Attendence' : 'JNTUK Dashboard'} />
      <div className="flex items-start justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-2xl">
          <Routes>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/pdfs" element={<PDFsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
