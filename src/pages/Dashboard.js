import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import jntukLogo from '../jntukimages/jntuk-logo.png';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Determine user role
  const userRole = profile?.role || 'student';
  const basePath = userRole === 'professor' ? '/professor' : '/student';
  const displayName =
    profile?.name ||
    [profile?.firstName, profile?.secondName].filter(Boolean).join(' ') ||
    user?.displayName ||
    '';

  // Student ID should come from saved profile data.
  const studentId = (profile?.id || profile?.userId || '').toString().trim();

  const cards = [
    { title: 'Profile', icon: '👤', path: `${basePath}/profile`, desc: 'View & edit your profile' },
    { title: 'Attendance', icon: '📋', path: `${basePath}/attendance`, desc: 'Check attendance records' },
    { title: 'Syllabus / PDFs', icon: '📚', path: `${basePath}/pdfs`, desc: 'Access course materials' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8faf5]">
      {/* Header */}
      <div className="bg-[#2E8B57] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <img src={jntukLogo} alt="JNTUK" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">JNTUK Dashboard</h1>
            <p className="text-emerald-50/90 text-xs sm:text-sm mt-1">
              {userRole === 'professor' ? 'Professor' : 'Student'}: {displayName || (loading ? 'Loading...' : '-')}
            </p>
            {process.env.NODE_ENV !== 'production' && (
              <p className="text-emerald-50/70 text-[10px] sm:text-xs mt-1">
                Dev: profile={profile?.__source || 'none'}; id={studentId || '-'}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 bg-emerald-800 text-white hover:bg-red-600 rounded-lg transition-colors font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Main content area */}
      <div className="w-full p-6">
        {/* Welcome (left, below header) */}
        <div className="w-full max-w-6xl mx-auto">
          <div className="mt-2">
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 text-left">
              Welcome{studentId ? ` ${studentId},` : ''}
            </h2>
          </div>
        </div>

        {/* Cards (centered) */}
        <div className="w-full flex justify-center mt-10">
          <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full justify-items-center">
              {cards.map((card, idx) => (
                <Link
                  key={idx}
                  to={card.path}
                  className="
                    group
                    flex flex-col items-center justify-center
                    bg-[#C1E1C1] hover:bg-[#009E60]
                    rounded-lg p-8
                    min-h-48
                    w-full max-w-sm
                    transition-all duration-300 ease-in-out
                    shadow-lg hover:shadow-xl
                    cursor-pointer
                    border-0
                  "
                >
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-950 group-hover:text-white text-center mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-emerald-900 group-hover:text-emerald-50 text-center">
                    {card.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
