import React from 'react';

export default function AttendancePage() {
  const [regNo, setRegNo] = React.useState('');
  const [branch, setBranch] = React.useState('');
  const [year, setYear] = React.useState('');
  const [error, setError] = React.useState('');

  const onOpen = () => {
    setError('');
    if (!String(regNo).trim() || !String(branch).trim() || !String(year).trim()) {
      setError('Please select Reg No, Branch, and Year.');
      return;
    }
    // Hook for future behavior.
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#C1E1C1]/75 rounded-none p-8 shadow-lg border-0 mt-10">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-2">Reg No</label>
            <input
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="Enter Reg No"
              className="w-full rounded-lg px-4 py-3 bg-white/90 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-2">Branch</label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-lg px-4 py-3 bg-white/90 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="" disabled>Choose Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-emerald-900 mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-lg px-4 py-3 bg-white/90 border border-emerald-700/30 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="" disabled>Choose Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={onOpen}
        className="mt-6 px-8 py-3 rounded-lg bg-[#2E8B57] text-white font-semibold hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Open
      </button>

      {error ? (
        <p className="mt-3 text-sm text-red-700 font-semibold">{error}</p>
      ) : null}
    </div>
  );
}
