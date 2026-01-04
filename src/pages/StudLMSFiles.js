import StudentFooter from '../components/StudentFooter';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BRAND = {
  green: '#0F9D78',
  greenDark: '#0B7A5E'
};

export default function StudLMSFiles() {
    const [searchTerm, setSearchTerm] = React.useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState('dashboard'); // default to dashboard
  const [activeFolderId, setActiveFolderId] = React.useState(null);

  // Get regNo, program, year from navigation state, fallback to empty string
  const regNo = location.state?.regNo || '';
  const program = location.state?.program || '';
  const year = location.state?.year || '';

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

  const openFolder = (folderId) => {
    const folder = folders.find((f) => f.id === folderId);
    if (folder) {
      navigate('/files', { state: { folder } });
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#f8faf5]">
        <div className="flex-1">
          <div className="max-w-5xl mx-auto mb-16">
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
                {/* Search bar above subject boxes */}
                <div className="w-full max-w-xs mt-2 mb-6">
                  <textarea
                    className="w-full border border-gray-300 p-2 text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-200"
                    style={{ borderRadius: 0, resize: 'none' }}
                    rows={1}
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {folders
                    .filter(folder => {
                      const subjectNames = {
                        'ml': 'Machine Learning',
                        'rl': 'Reinforcement Learning',
                        'dl': 'Deep Learning',
                        'ml-lab': 'Machine Learning Lab',
                        'dl-lab': 'Deep Learning Lab',
                        'coi': 'Constitution of India',
                        'cv': 'Computer Vision'
                      };
                      const subjectName = subjectNames[folder.id] || folder.name;
                      return subjectName.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map((folder, idx) => {
                    // Assign a unique pastel color for each subject
                    const pastelColors = [
                      'bg-orange-100 text-orange-500', // ML Lab
                      'bg-blue-100 text-blue-500',     // DL Lab
                      'bg-green-100 text-green-500',   // Machine Learning
                      'bg-purple-100 text-purple-500', // Deep Learning
                      'bg-yellow-100 text-yellow-500', // Reinforcement Learning
                      'bg-pink-100 text-pink-500',     // Computer Vision
                      'bg-gray-100 text-gray-500'      // COI
                    ];
                    const colorClass = pastelColors[idx % pastelColors.length];
                    // Map folder.id to subject name
                    const subjectNames = {
                      'ml': 'Machine Learning',
                      'rl': 'Reinforcement Learning',
                      'dl': 'Deep Learning',
                      'ml-lab': 'Machine Learning Lab',
                      'dl-lab': 'Deep Learning Lab',
                      'coi': 'Constitution of India',
                      'cv': 'Computer Vision'
                    };
                    const subjectName = subjectNames[folder.id] || folder.name;
                    return (
                      <div
                        key={folder.id}
                        className="bg-white border border-gray-200 shadow-sm p-4 w-full max-w-xs mx-auto flex flex-col gap-3 cursor-pointer transition-transform duration-200 hover:scale-[1.03]"
                        style={{ borderRadius: 0 }}
                        onClick={() => openFolder(folder.id)}
                      >
                        {/* Top Row */}
                        <div className="flex items-center justify-between mb-2">
                          {/* Icon Area */}
                          <div className={`w-8 h-8 flex items-center justify-center border border-gray-200 ${colorClass}`} style={{ borderRadius: 0 }}>
                            {/* Simple document/file icon (SVG) */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 2H12V6H16V18H4V2H8Z" /></svg>
                          </div>
                        </div>
                        {/* Main Content */}
                        <div className="font-bold text-base text-left text-gray-900">
                          {subjectName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StudentFooter />
    </>
  );
}
