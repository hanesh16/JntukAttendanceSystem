import React from 'react';
import { useLocation } from 'react-router-dom';
import StudentFooter from '../components/StudentFooter';

const BRAND = {
  green: '#0F9D78',
  greenDark: '#0B7A5E',
  border: '#E5E7EB'
};

const SUBJECTS = [
  'Machine Learning',
  'Machine Learning Lab',
  'Deep Learning',
  'Deep Learning Lab',
  'Reinforcement Learning',
  'Computer Vision',
  'Constitution Of India'
];

function getTodayISODate() {
  const now = new Date();
  const tzAdjusted = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return tzAdjusted.toISOString().slice(0, 10);
}

function getMockAttendanceForSubject(subject) {
  const base = subject.length % 5;
  const present = 18 + base;
  const absent = 2 + (4 - base);
  const total = present + absent;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return {
    present,
    absent,
    percentage
  };
}

export default function AttendanceRegisterDetails() {
  const location = useLocation();
  const navState = (location && location.state) || {};

  const registerNumber = String(navState.regNo || '').trim();

  const [selectedDate, setSelectedDate] = React.useState(getTodayISODate());

  const [selectedSubject, setSelectedSubject] = React.useState(SUBJECTS[0]);
  const details = React.useMemo(
    () => getMockAttendanceForSubject(selectedSubject),
    [selectedSubject]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf5]">
      <div className="flex-1">
        <div
          className="w-full max-w-5xl mx-auto bg-white border rounded-2xl shadow-sm overflow-hidden"
          style={{ borderColor: BRAND.border }}
        >
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Subject list */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold mb-3 uppercase">
                  <span style={{ color: BRAND.green }}>ATTENDANCE</span>{' '}
                  <span className="text-gray-900">REGISTER</span>
                </h2>

                <div className="text-base font-bold text-gray-900 mb-3">Subjects</div>
                <div className="flex flex-col gap-2 mb-4">
                  {SUBJECTS.map((subj) => (
                    <button
                      key={subj}
                      className={`text-left px-4 py-2 rounded-lg font-semibold transition border ${selectedSubject === subj ? 'bg-emerald-50 text-emerald-700 border-emerald-400' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}
                      style={{ fontFamily: 'Garamond, serif' }}
                      onClick={() => setSelectedSubject(subj)}
                    >
                      {subj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Details panel */}
              <div>
                <div className="text-sm font-bold text-gray-900 mb-3">Attendance Details</div>

                <div
                  key={selectedSubject}
                  className="border rounded-2xl p-5 bg-white shadow-sm transition-all duration-200"
                  style={{ borderColor: BRAND.border }}
                >
                  <div className="text-lg font-extrabold text-gray-900">{selectedSubject}</div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border p-3" style={{ borderColor: BRAND.border }}>
                      <div className="text-xs text-gray-500">Register Number</div>
                      <div className="text-sm font-semibold text-gray-900">{registerNumber || '—'}</div>
                    </div>

                    <div className="rounded-xl border p-3" style={{ borderColor: BRAND.border }}>
                      <div className="text-xs text-gray-500">Date</div>
                      <div className="mt-1">
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="rounded-xl border p-3" style={{ borderColor: BRAND.border }}>
                        <div className="text-xs text-gray-500">Present Count</div>
                        <div className="text-sm font-semibold" style={{ color: BRAND.green }}>
                          {details.present}
                        </div>
                      </div>

                      <div className="rounded-xl border p-3" style={{ borderColor: BRAND.border }}>
                        <div className="text-xs text-gray-500">Absent Count</div>
                        <div className="text-sm font-semibold text-gray-900">{details.absent}</div>
                      </div>

                      <div className="rounded-xl border p-3" style={{ borderColor: BRAND.border }}>
                        <div className="text-xs text-gray-500">Total No of Classes</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {details.present + details.absent}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border p-3 sm:col-span-2" style={{ borderColor: BRAND.border }}>
                      <div className="text-xs text-gray-500">Attendance Percentage</div>
                      <div className="mt-1 flex items-center justify-between gap-4">
                        <div className="text-sm font-semibold text-gray-900">{details.percentage}%</div>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${details.percentage}%`,
                              backgroundColor: details.percentage >= 75 ? BRAND.green : BRAND.greenDark,
                              transition: 'width 200ms ease'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '48px' }} />
      <StudentFooter />
    </div>
  );
}
