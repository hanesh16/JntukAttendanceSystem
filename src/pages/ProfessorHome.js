import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import homepageImage from '../jntukimages/homepage.png';

const BRAND = {
  primary: '#0F9D78',
  primaryDark: '#0B7A5E',
  heading: '#0F172A',
  body: '#475569',
  border: '#E5E7EB'
};

function scrollToHash(hash) {
  const id = String(hash || '').replace('#', '');
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function PrimaryButton({ children, onClick }) {
  return (
    <button
      type="button"
      className="btn inline-flex items-center justify-center gap-2 w-full sm:w-56 h-12 px-4 rounded-xl shadow-sm transition-colors"
      style={{ backgroundColor: BRAND.primary, color: 'white' }}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = BRAND.primaryDark;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = BRAND.primary;
      }}
    >
      {children}
    </button>
  );
}

function ProfessorNavbar() {
  const navigate = useNavigate();
  return (
    <nav className="bg-white border-b" style={{ borderColor: BRAND.border }}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-extrabold" style={{ color: BRAND.primary }}>
          Professor Portal
        </div>
        <div className="flex gap-6 text-base font-semibold">
          <button className="hover:underline" style={{ color: BRAND.heading }} onClick={() => navigate('/professor/home')}>Home</button>
          <button className="hover:underline" style={{ color: BRAND.heading }} onClick={() => navigate('/profile')}>Profile</button>
          <button className="hover:underline" style={{ color: BRAND.heading }} onClick={() => navigate('/professor/dashboard')}>Professor Dashboard</button>
          <button className="hover:underline" style={{ color: BRAND.heading }} onClick={() => navigate('/professor/permissions')}>Permission Management</button>
          <button className="hover:underline" style={{ color: BRAND.heading }} onClick={() => navigate('/professor/materials')}>Academic Materials Upload</button>
        </div>
      </div>
    </nav>
  );
}

function ProfessorHero() {
  return (
    <section id="top" className="bg-gradient-to-b from-[#F3FBF7] via-white to-white">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight" style={{ color: BRAND.heading }}>
              JNTUK <span style={{ color: BRAND.primary }}>PROFESSOR PORTAL</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg" style={{ color: BRAND.body }}>
              Welcome to the JNTUK Professor Portal, a smart campus platform for managing attendance permissions, uploading academic materials, and supporting student learning. Access your dashboard, manage permissions, and upload resources with ease.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <PrimaryButton onClick={() => scrollToHash('#dashboard')}>Professor Dashboard</PrimaryButton>
              <PrimaryButton onClick={() => scrollToHash('#materials')}>Upload Materials</PrimaryButton>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div
              className="w-full max-w-md lg:max-w-lg rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '4 / 3',
                backgroundImage: `url(${homepageImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              role="img"
              aria-label="Professor portal"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfessorFooter() {
  return (
    <footer className="bg-white border-t" style={{ borderColor: BRAND.border }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-sm" style={{ color: BRAND.body }}>
          &copy; {new Date().getFullYear()} JNTUK Professor Portal. For institutional use only.
        </div>
      </div>
    </footer>
  );
}

export default function ProfessorHome() {
  const location = useLocation();
  React.useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => scrollToHash(location.hash));
    }
  }, [location.hash]);
  return (
    <div>
      <ProfessorNavbar />
      <ProfessorHero />
      {/* Add more professor-specific sections here if needed */}
      <ProfessorFooter />
    </div>
  );
}
