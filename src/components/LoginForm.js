import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signupUser,
  loginUser
} from '../firebase';

const BRAND = {
  primary: '#0F9D78',
  primaryDark: '#0B7A5E',
  heading: '#0F172A',
  body: '#475569',
  border: '#E5E7EB'
};

export default function LoginForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', id: '', branch: '', phone: '', email: '', password: '' });

  const handleLoginChange = (e) => {
    setLoginData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupChange = (e) => {
    setSignupData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    console.info('handleLoginSubmit: start', loginData.email);
    try {
      // Pass the selected role to loginUser
      const { user, profile, profileError } = await loginUser(loginData.email, loginData.password, activeTab);
      console.info('handleLoginSubmit: loginUser resolved', user?.uid, profile?.role);
      if (profileError) {
        console.warn('Profile fetch error:', profileError);
        setNotice('Profile could not be loaded (offline or network issue). Proceeding with limited access.');
      }
      setNotice('Login successful.');
      // Debug log for role
      if (profile) {
        console.log('User role after login:', profile.role);
      } else {
        console.warn('No profile found after login');
      }
      if (profile && profile.role === 'professor') {
        navigate('/professor/home');
      } else {
        navigate('/home');
      }
    } catch (err) {
      console.error('handleLoginSubmit error:', err);
      if (err.code === 'email-not-verified') {
        setError('Email not verified. Please check your inbox and verify your email, then log in again.');
      } else if (err.code === 'role-mismatch') {
        setError('You are trying to log in as a ' + activeTab + ', but your account is registered as a ' + (err.profile?.role || 'student') + '. Please use the correct login tab or contact admin.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      console.info('handleLoginSubmit: finished');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    console.info('handleSignupSubmit: start', signupData.email);
    try {
      const res = await signupUser({ ...signupData, role: activeTab });
      console.info('handleSignupSubmit: signupUser resolved', res);
      // After signup, move to login so they can sign in after verifying.
      setMode('login');
      const storage = res?.profileStorage;
      if (res?.profileSaved && storage === 'firestore') {
        setNotice(`Account created. Verification email sent to ${signupData.email}. Please verify before logging in.`);
      } else if (res?.profileSaved && storage === 'rtdb') {
        setNotice(`Account created. Verification email sent to ${signupData.email}. Profile saved to Realtime Database (Firestore blocked by rules). Please verify before logging in.`);
      } else if (res?.profileError) {
        const hint = String(res.profileError).includes('permission-denied')
          ? ' Fix: publish Firestore rules to allow authenticated users to write users/{uid}, or enable RTDB and rules for users/{uid}.'
          : '';
        setNotice(`Account created. Verification email sent to ${signupData.email}. Note: profile details could not be saved (${res.profileError}).${hint} You can log in after verifying and save your profile from the Profile page.`);
      } else {
        setNotice(`Account created. Verification email sent to ${signupData.email}. Please verify before logging in.`);
      }
    } catch (err) {
      console.error('handleSignupSubmit error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.info('handleSignupSubmit: finished');
    }
  };

  return (
    <div
      className="w-full bg-white/90 backdrop-blur-sm border rounded-2xl shadow-sm p-8"
      style={{ borderColor: BRAND.border }}
    >
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold border transition-colors ${activeTab === 'student' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          style={
            activeTab === 'student'
              ? { backgroundColor: BRAND.primary, borderColor: BRAND.primary }
              : { borderColor: BRAND.border }
          }
          onMouseEnter={(e) => {
            if (activeTab !== 'student') return;
            e.currentTarget.style.backgroundColor = BRAND.primaryDark;
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'student') return;
            e.currentTarget.style.backgroundColor = BRAND.primary;
          }}
        >
          Student
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('professor')}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold border transition-colors ${activeTab === 'professor' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          style={
            activeTab === 'professor'
              ? { backgroundColor: BRAND.primary, borderColor: BRAND.primary }
              : { borderColor: BRAND.border }
          }
          onMouseEnter={(e) => {
            if (activeTab !== 'professor') return;
            e.currentTarget.style.backgroundColor = BRAND.primaryDark;
          }}
          onMouseLeave={(e) => {
            if (activeTab !== 'professor') return;
            e.currentTarget.style.backgroundColor = BRAND.primary;
          }}
        >
          Professor
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-300">
        <button
          type="button"
          onClick={() => setMode('login')}
          className={`flex-1 py-2 px-4 font-semibold transition-all duration-300 border-b-2 ${mode === 'login' ? 'text-emerald-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          style={mode === 'login' ? { borderColor: BRAND.primary, color: BRAND.primary } : undefined}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          className={`flex-1 py-2 px-4 font-semibold transition-all duration-300 border-b-2 ${mode === 'signup' ? 'text-emerald-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          style={mode === 'signup' ? { borderColor: BRAND.primary, color: BRAND.primary } : undefined}
        >
          Signup
        </button>
      </div>

      {error && <div className="text-sm text-red-700 bg-red-100 p-3 rounded mb-4">{error}</div>}
      {notice && <div className="text-sm text-gray-800 bg-gray-100 p-3 rounded mb-4">{notice}</div>}

      {mode === 'login' && (
        <>
          <h1 className="text-2xl font-extrabold text-center mb-6" style={{ color: BRAND.heading }}>
            {activeTab === 'student' ? 'Student Login' : 'Professor Login'}
          </h1>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) => {
                  if (e.currentTarget.disabled) return;
                  e.currentTarget.style.backgroundColor = BRAND.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.primary;
                }}
              >
                {loading ? 'Please wait...' : 'Login'}
              </button>
            </div>
          </form>
        </>
      )}

      {mode === 'signup' && (
        <>
          <h1 className="text-2xl font-extrabold text-center mb-6" style={{ color: BRAND.heading }}>
            {activeTab === 'student' ? 'Student Signup' : 'Professor Signup'}
          </h1>
          <form onSubmit={handleSignupSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                required
                placeholder="Full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{activeTab === 'student' ? 'Student ID' : 'Faculty ID'}</label>
              <input
                type="text"
                name="id"
                value={signupData.id}
                onChange={handleSignupChange}
                required
                placeholder="ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Branch / Department</label>
              <input
                type="text"
                name="branch"
                value={signupData.branch}
                onChange={handleSignupChange}
                required
                placeholder="Branch or Dept"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={signupData.phone}
                onChange={handleSignupChange}
                required
                placeholder="Phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email ID</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                required
                placeholder="Email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
                placeholder="Create password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) => {
                  if (e.currentTarget.disabled) return;
                  e.currentTarget.style.backgroundColor = BRAND.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.primary;
                }}
              >
                {loading ? 'Saving...' : 'Create Account'}
              </button>
            </div>
          </form>
        </>
      )}

    </div>
  );
}
