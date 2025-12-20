import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import AttendancePage from './AttendancePage';
import PDFsPage from './PDFsPage';

export default function StudentDashboard() {
  return (
    <div className="w-full min-h-screen bg-[#f8faf5]">
      <div className="flex items-center justify-center min-h-screen p-6">
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
