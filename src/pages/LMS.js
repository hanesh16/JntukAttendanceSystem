import React from 'react';

export default function LMS() {
  const BRAND = {
    green: '#0F9D78',
    greenDark: '#0B7A5E'
  };

  const [mode, setMode] = React.useState('form'); // 'form' | 'dashboard' | 'folder'
  const [activeFolderId, setActiveFolderId] = React.useState(null);

  const [regNo, setRegNo] = React.useState('');
  const [program, setProgram] = React.useState('');
  const [year, setYear] = React.useState('');

  const canOpen = regNo.trim().length > 0 && Boolean(program) && Boolean(year);

  const yearOptions = React.useMemo(() => {
    if (program === 'BTECH') return ['I', 'II', 'III', 'IV'];
    if (program === 'MTECH') return ['I', 'II'];
    return [];
  }, [program]);

  // No colors: plain folders
  const folders = React.useMemo(
    () => [
      {
        id: 'ml-lab',
        name: 'ML Lab',
        files: ['Experiment 1', 'Experiment 2', 'Lab Manual PDF'],
        grad: 'linear-gradient(90deg, #ff7eb3, #ff758c)', // pink
      },
      {
        id: 'dl-lab',
        name: 'DL Lab',
        files: ['Experiment 1', 'Experiment 2', 'Lab Manual PDF'],
        grad: 'linear-gradient(90deg, #43cea2, #185a9d)', // blue
      },
      {
        id: 'ml',
        name: 'Machine Learning',
        files: ['Notes', 'Assignments'],
        grad: 'linear-gradient(90deg, #a2836e, #6e4b1e)', // brown
      },
      {
        id: 'dl',
        name: 'Deep Learning',
        files: ['Notes', 'Assignments'],
        grad: 'linear-gradient(90deg, #ffe259, #ffa751)', // yellow
      },
      {
        id: 'rl',
        name: 'Reinforcement Learning',
        files: ['Notes', 'Assignments'],
        grad: 'linear-gradient(90deg, #a770ef, #f6d365)', // purple
      },
      {
        id: 'cv',
        name: 'Computer Vision',
        files: ['Notes', 'Assignments'],
        grad: 'linear-gradient(90deg, #bdc3c7, #2c3e50)', // gray
      },
      {
        id: 'coi',
        name: 'COI',
        files: ['Notes', 'Assignments'],
        grad: 'linear-gradient(90deg, #e96443, #904e95)', // beige red
      }
    ],
    []
  );

  const activeFolder = React.useMemo(
    () => folders.find((f) => f.id === activeFolderId) || null,
    [folders, activeFolderId]
  );

  const openDashboard = () => {
    if (!canOpen) return;
    setMode('dashboard');
    setActiveFolderId(null);
  };

  const openFolder = (folderId) => {
    setActiveFolderId(folderId);
    setMode('folder');
  };

  const goBackToFolders = () => {
    setMode('dashboard');
    setActiveFolderId(null);
  };

  return (
    <div className="min-h-screen bg-[#f8faf5] px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {mode === 'form' ? (
          <>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-center uppercase">
              <span style={{ color: BRAND.green }}>LMS</span>{' '}
              <span className="text-gray-900">PORTAL</span>
            </h1>

            <div className="mt-6 max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
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
                  onClick={openDashboard}
                >
                  Open
                </button>
              </div>
            </div>
          </>
        ) : null}

        {mode === 'dashboard' ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold">
                <span style={{ color: BRAND.green }}>Welcome</span>{' '}
                <span className="text-gray-900">{regNo.trim()}</span>
              </h1>
              <div className="text-sm text-gray-600">
                {program ? program : '-'} {year ? `• ${year} Year` : ''}
              </div>
            </div>

            <div className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => openFolder(folder.id)}
                    className="w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden cursor-pointer flex flex-col transform transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg"
                    style={{ minWidth: '140px', minHeight: '140px', border: '1px solid #e5e7eb', background: 'white' }}
                  >
                    {/* Solid colored upper section */}
                    <div
                      className="flex-1 w-full flex items-end"
                      style={{
                        background: folder.grad,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                        borderTopLeftRadius: '1rem',
                        borderTopRightRadius: '1rem',
                        minHeight: 0,
                      }}
                    />
                    {/* Bottom label with icon and name, always white */}
                    <div
                      className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold tracking-wide bg-white text-black"
                      style={{
                        borderTopLeftRadius: 0,
                        borderTopRightRadius: 0,
                        borderBottomLeftRadius: '1rem',
                        borderBottomRightRadius: '1rem',
                      }}
                    >
                      <span className="text-xl" aria-hidden="true">📁</span>
                      {folder.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {mode === 'folder' && activeFolder ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-200">
            <div className="flex items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold" style={{ color: BRAND.green }}>LMS</span> /{' '}
                  <span className="text-gray-900 font-semibold">{activeFolder.name}</span>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {activeFolder.name}
                </h1>
              </div>

              <button
                type="button"
                onClick={goBackToFolders}
                className="px-4 py-2 rounded-xl border bg-white font-semibold transition-colors"
                style={{ borderColor: '#E5E7EB', color: BRAND.green }}
              >
                Back
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeFolder.files.map((fileName) => (
                <div
                  key={fileName}
                  className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-md"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold"
                    style={{ background: `linear-gradient(135deg, ${BRAND.green}, ${BRAND.greenDark})` }}
                    aria-hidden="true"
                  >
                    📄
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{fileName}</div>
                    <div className="text-xs text-gray-600">Click to open (placeholder)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
