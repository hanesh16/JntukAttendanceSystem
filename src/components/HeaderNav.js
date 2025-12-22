import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import jntukLogo from '../jntukimages/jntuk-logo.png';

export default function HeaderNav({ title = 'JNTUK Dashboard', subTitle = '', hideLinks = [] }) {
  const navigate = useNavigate();
  const { profile, signOut } = useContext(AuthContext);

  const userRole = profile?.role || 'student';
  const basePath = userRole === 'professor' ? '/professor' : '/student';

  const linkClassName = ({ isActive }) =>
    isActive
      ? 'text-red-500 font-semibold pointer-events-none cursor-default'
      : 'text-white font-semibold hover:text-red-500 transition-colors';

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut();
    navigate('/');
  };

  return (
    <div className="bg-[#2E8B57] text-white px-6 h-20 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        <img src={jntukLogo} alt="JNTUK" className="h-12 w-12 object-contain" />
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate">{title}</h1>
          {subTitle ? (
            <p className="text-emerald-50/90 text-xs sm:text-sm leading-tight truncate">
              {subTitle}
            </p>
          ) : null}
        </div>
      </div>

      <nav className="flex items-center gap-5">
        {!hideLinks.includes('home') && (
          <NavLink to="/dashboard" end className={linkClassName}>Home</NavLink>
        )}
        {!hideLinks.includes('profile') && (
          <NavLink to={`${basePath}/profile`} end className={linkClassName}>Profile</NavLink>
        )}
        {!hideLinks.includes('attendance') && (
          <NavLink to={`${basePath}/attendance`} end className={linkClassName}>Attendence</NavLink>
        )}
        {!hideLinks.includes('pdfs') && (
          <NavLink to={`${basePath}/pdfs`} end className={linkClassName}>Pdfs</NavLink>
        )}
        <a href="/" onClick={handleLogout} className="text-white font-semibold hover:text-red-500 transition-colors">Logout</a>
      </nav>
    </div>
  );
}
