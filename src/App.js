import Files from './pages/Files';
import StudLMSFiles from './pages/StudLMSFiles';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { AuthProvider } from './contexts/AuthContext';
import mainImage from './jntukimages/mainimage.jpg';
import Home from './pages/Home';
import RequireAuth from './components/RequireAuth';
import UploadAttendence from './pages/UploadAttendence';
import AttendenceCheck from './pages/AttendenceCheck';
import AttendanceRegisterDetails from './pages/AttendanceRegisterDetails';
import LMS from './pages/LMS';
import ProfilePage from './pages/ProfilePage';
import AppLayout from './components/AppLayout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProfessorHome from './pages/ProfessorHome';
import RequireProfessor from './components/RequireProfessor';
import AdminSetUserRole from './pages/AdminSetUserRole';
import ProfProfilePage from './pages/ProfProfilePage';
import ProfPermissions from './pages/ProfPermissions';
import ReviewAttendance from './pages/ReviewAttendance';
import ProfLMSFiles from './pages/ProfLMSFiles';
import './App.css';

function App() {
    <Route path="/admin/set-user-role" element={<AdminSetUserRole />} />
  return (
    <AuthProvider>
      <Routes>
        {/* Login/Signup pages in centered box with background image */}
        <Route path="/" element={
          <div
            className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${mainImage})` }}
          >
            <div className="absolute inset-0 bg-[#f8faf5]/80" />
            <div className="relative w-full max-w-md mx-4">
              <LoginForm />
            </div>
          </div>
        } />


        {/* App pages with global Home navbar */}
        <Route element={<AppLayout />}>
          {/* Home page (replaces Dashboard page) */}
          <Route path="/home" element={<Home />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            }
          />
        {/* Files page WITHOUT AppLayout/HomeNavbar */}
        <Route
          path="/files"
          element={
            <RequireAuth>
              <Files />
            </RequireAuth>
          }
        />

          <Route
            path="/lms"
            element={
              <RequireAuth>
                <LMS />
              </RequireAuth>
            }
          />

          {/* Attendance pages from Home navbar */}
          <Route
            path="/attendance/upload"
            element={
              <RequireAuth>
                <UploadAttendence />
              </RequireAuth>
            }
          />
          <Route
            path="/attendance/check"
            element={
              <RequireAuth>
                <AttendenceCheck />
              </RequireAuth>
            }
          />

          <Route
            path="/attendance/register"
            element={
              <RequireAuth>
                <AttendanceRegisterDetails />
              </RequireAuth>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/studlmsfiles"
            element={
              <RequireAuth>
                <StudLMSFiles />
              </RequireAuth>
            }
          />
        </Route>

        {/* ProfessorHome route WITHOUT AppLayout/HomeNavbar */}
        <Route
          path="/professor/home"
          element={
            <RequireProfessor>
              <ProfessorHome />
            </RequireProfessor>
          }
        />
        <Route
          path="/professor/profile"
          element={
            <RequireProfessor>
              <ProfProfilePage />
            </RequireProfessor>
          }
        />
        <Route
          path="/professor/permissions"
          element={
            <RequireProfessor>
              <ProfPermissions />
            </RequireProfessor>
          }
        />
        <Route
          path="/professor/review-attendance"
          element={
            <RequireProfessor>
              <ReviewAttendance />
            </RequireProfessor>
          }
        />

        <Route
          path="/professor/lecture-materials"
          element={
            <RequireProfessor>
              <ProfLMSFiles />
            </RequireProfessor>
          }
        />
        <Route
          path="/professor/proflmsfiles"
          element={
            <RequireProfessor>
              <ProfLMSFiles />
            </RequireProfessor>
          }
        />

        {/* Back-compat */}
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
