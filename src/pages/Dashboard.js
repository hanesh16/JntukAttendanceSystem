import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // Determine user role
  const userRole = profile?.role || 'student';
  const basePath = userRole === 'professor' ? '/professor' : '/student';

  const cards = [
    { title: 'Profile', icon: '👤', path: `${basePath}/profile`, desc: 'View & edit your profile' },
    { title: 'Attendance', icon: '📋', path: `${basePath}/attendance`, desc: 'Check attendance records' },
    { title: 'Syllabus / PDFs', icon: '📚', path: `${basePath}/pdfs`, desc: 'Access course materials' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f8faf5]">
      {/* Header */}
      <div className="bg-emerald-800 text-white p-6 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === 'professor' ? 'Professor Dashboard' : 'Student Dashboard'}
          </h1>
          <p className="text-emerald-100 text-sm mt-1">Welcome, {user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-semibold"
        >
          Logout
        </button>
      </div>

      {/* Main content area */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-6">
        <div className="w-full max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4 text-emerald-800">Welcome</h2>
          <p className="text-center text-emerald-700 mb-12 text-lg">Select an option below to continue</p>

          {/* Cards container: responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {cards.map((card, idx) => (
              <Link
                key={idx}
                to={card.path}
                className="
                  group
                  flex flex-col items-center justify-center
                  bg-emerald-50 hover:bg-emerald-100
                  rounded-xl p-8
                  min-h-48
                  transition-all duration-300 ease-in-out
                  hover:shadow-lg
                  cursor-pointer
                  border-2 border-emerald-200 hover:border-emerald-300
                "
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 text-center mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-emerald-700 text-center">
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
