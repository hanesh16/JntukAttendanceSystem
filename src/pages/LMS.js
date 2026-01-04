import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentFooter from '../components/StudentFooter';

export default function AttendenceCheck() {
  const navigate = useNavigate();

  const BRAND = {
    green: '#0F9D78',
    greenDark: '#0B7A5E'
  };

  const [regNo, setRegNo] = React.useState('');
  const [program, setProgram] = React.useState('');
  const [year, setYear] = React.useState('');

  const canOpen = regNo.trim().length > 0 && Boolean(program) && Boolean(year);

  const yearOptions = React.useMemo(() => {
    if (program === 'BTECH') return ['I', 'II', 'III', 'IV'];
    if (program === 'MTECH') return ['I', 'II'];
    return [];
  }, [program]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf5]">
      <div className="flex-1">
        <div className="max-w-xl mx-auto">
          <div className="text-center mt-8 mb-8">
            <span className="text-3xl sm:text-4xl font-extrabold uppercase" style={{ color: '#111827', letterSpacing: '0.02em' }}>LMS</span>{' '}
            <span className="text-3xl sm:text-4xl font-extrabold uppercase" style={{ color: BRAND.green, letterSpacing: '0.02em' }}>PORTAL</span>
            <div style={{ fontFamily: 'cursive', fontWeight: 400, fontSize: '0.95rem', color: '#475569', marginTop: 2 }}>
              Learning Management System
            </div>
          </div>

          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Reg No</label>
                <textarea
                  rows={1}
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="Enter registration number"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-transform duration-150 hover:scale-[1.01] focus:scale-[1.01]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Program</label>
                <select
                  value={program}
                  onChange={(e) => {
                    setProgram(e.target.value);
                    setYear('');
                  }}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-transform duration-150 hover:scale-[1.01] focus:scale-[1.01]"
                >
                  <option value="" disabled>
                    Choose
                  </option>
                  <option value="BTECH">B.Tech</option>
                  <option value="MTECH">M.Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  disabled={!program}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-transform duration-150 hover:scale-[1.01] focus:scale-[1.01] disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="" disabled>
                    Choose
                  </option>
                  {yearOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="btn w-full h-12 rounded-xl font-semibold text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND.green, borderColor: BRAND.green }}
                disabled={!canOpen}
                onMouseEnter={(e) => {
                  if (e.currentTarget.disabled) return;
                  e.currentTarget.style.backgroundColor = BRAND.greenDark;
                  e.currentTarget.style.borderColor = BRAND.greenDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.green;
                  e.currentTarget.style.borderColor = BRAND.green;
                }}
                onClick={() => {
                  if (!canOpen) return;
                  navigate('/studlmsfiles', {
                    state: {
                      regNo,
                      program,
                      year
                    }
                  });
                }}
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>
      <StudentFooter />
    </div>
  );
}
