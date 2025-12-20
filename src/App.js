import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import mainImage from './jntukimages/mainimage.jpg';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Login/Signup pages in centered box with background image */}
        <Route path="/" element={
          <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${mainImage})` }}
          >
            <div className="w-full max-w-md mx-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
                <LoginForm />
              </div>
            </div>
          </div>
        } />
        
        <Route path="/forgot" element={
          <div
            className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${mainImage})` }}
          >
            <div className="w-full max-w-md mx-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
                <ForgotPassword />
              </div>
            </div>
          </div>
        } />

        {/* Full-screen pages after login */}
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/student/*" element={<RequireAuth><StudentDashboard /></RequireAuth>} />
        <Route path="/professor/*" element={<RequireAuth><ProfessorDashboard /></RequireAuth>} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
