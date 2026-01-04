

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfHeaderNav from '../components/ProfHeaderNav';
import Footer from '../components/Footer';


const MATERIALS = [
  { id: 1, title: 'Machine Learning Lab', status: 'Public' },
  { id: 2, title: 'Deep Learning Lab', status: 'Private' },
  { id: 3, title: 'Machine Learning', status: 'Public' },
  { id: 4, title: 'Deep Learning', status: 'Private' },
  { id: 5, title: 'Computer Vision', status: 'Public' },
  { id: 6, title: 'Reinforcement Learning', status: 'Public' },
  { id: 7, title: 'Constitution of India', status: 'Private' }
];

// SVG icon from attachment (with color class to be set dynamically)
const FileIcon = ({ colorClass }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${colorClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" fillOpacity="0.15" />
    <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="9" y="7" width="6" height="2" rx="1" fill="currentColor" />
  </svg>
);

export default function ProfLMSFiles() {
  const [materials, setMaterials] = useState(MATERIALS);
  const [filesBySubject, setFilesBySubject] = useState({}); // { subject: [fileName, ...] }
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    subject: '',
    fileType: '',
    file: null,
    isPublic: true,
  });
  const fileInputRef = useRef();

  // Toggle public/private status
  const toggleStatus = (id) => {
    setMaterials((prev) =>
      prev.map((mat) =>
        mat.id === id
          ? {
              ...mat,
              status: mat.status === 'Public' ? 'Private' : 'Public',
            }
          : mat
      )
    );
  };

  // Delete material
  const deleteMaterial = (id) => {
    setMaterials((prev) => prev.filter((mat) => mat.id !== id));
  };

  // Filter materials based on selected subject
  const subjectMap = {
    all: null,
    ml: ['Machine Learning'],
    dl: ['Deep Learning'],
    rl: ['Reinforcement Learning'],
    'ml-lab': ['Machine Learning Lab'],
    'dl-lab': ['Deep Learning Lab'],
    cv: ['Computer Vision'],
  };
  const filteredMaterials = selectedSubject === 'all'
    ? materials
    : materials.filter(mat => subjectMap[selectedSubject]?.includes(mat.title));

  // Handle upload form submit
  const handleUpload = (e) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.subject || !uploadForm.fileType || !uploadForm.file) return;
    // Add file to filesBySubject
    setFilesBySubject(prev => {
      const subject = uploadForm.subject;
      const fileObj = uploadForm.file;
      return {
        ...prev,
        [subject]: prev[subject] ? [...prev[subject], fileObj] : [fileObj]
      };
    });
    setShowModal(false);
    setUploadForm({ title: '', subject: '', fileType: '', file: null, isPublic: true });
  };

  // Navigate to Files.js with subject files
  const handleCardClick = (subject, title) => {
    const files = filesBySubject[subject] || [];
    navigate('/files', {
      state: {
        folder: {
          name: title,
          files,
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf5]">
      {/* Professor Header Navigation */}
      <ProfHeaderNav />
      {/* Spacer for header */}
      <div className="h-16" />
      <div className="flex-1 max-w-5xl mx-auto w-full px-2 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
          <span style={{ color: '#222', fontFamily: 'inherit' }}>Lecture </span>
          <span style={{ color: '#0F9D78', fontFamily: 'inherit' }}>Materials</span>
        </h1>
        <div className="mb-6" style={{ fontFamily: 'Garamond, serif', color: '#6B7280', fontWeight: 400, fontSize: '1.05rem' }}>
          Upload and manage educational resources for your students
        </div>
        {/* Subject Dropdown */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div className="flex flex-col sm:flex-row w-full gap-3">
            <select
              className="border border-gray-300 px-4 py-2 rounded-none text-base w-full sm:w-64"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              <option value="ml">Machine Learning</option>
              <option value="dl">Deep Learning</option>
              <option value="rl">Reinforcement Learning</option>
              <option value="ml-lab">ML Lab</option>
              <option value="dl-lab">DL Lab</option>
              <option value="cv">Computer Vision</option>
            </select>
            <div className="flex-1" />
            <button
              className="text-white font-bold px-6 py-2 rounded transition-colors w-full sm:w-auto"
              style={{ minWidth: 120, background: '#0F9D78' }}
              onClick={() => setShowModal(true)}
            >
              Upload Material
            </button>
          </div>
        </div>
        {/* Modal Popup for Upload Material */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop with blur */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md transition-opacity"
              onClick={() => setShowModal(false)}
            />
            {/* Modal Container */}
            <div
              className="relative bg-white border border-gray-200 shadow-xl w-full max-w-lg mx-4 p-4 rounded-lg max-h-[90vh] overflow-y-auto z-60 flex flex-col"
              style={{ fontFamily: 'inherit' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close (X) Icon */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={() => setShowModal(false)}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
              {/* Modal Title */}
              <div className="text-xl font-extrabold mb-4">
                <span className="text-gray-900">Upload </span>
                <span style={{ color: '#0F9D78' }}>Lecture Material</span>
              </div>
              {/* Form Fields */}
              <form className="flex flex-col gap-4" onSubmit={handleUpload}>
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Title <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F9D78]"
                    placeholder="Enter material title"
                    value={uploadForm.title}
                    onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                {/* Subject Dropdown */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Subject <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F9D78] text-base"
                    value={uploadForm.subject}
                    onChange={e => setUploadForm(f => ({ ...f, subject: e.target.value }))}
                    required
                  >
                    <option value="" disabled>Select a subject…</option>
                    <option value="ml">Machine Learning</option>
                    <option value="dl">Deep Learning</option>
                    <option value="rl">Reinforcement Learning</option>
                    <option value="ml-lab">ML Lab</option>
                    <option value="dl-lab">DL Lab</option>
                    <option value="cv">Computer Vision</option>
                  </select>
                </div>
                {/* File Type Dropdown */}
                <div>
                  <label className="block text-sm font-semibold mb-1">File Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F9D78] text-base"
                    value={uploadForm.fileType}
                    onChange={e => setUploadForm(f => ({ ...f, fileType: e.target.value }))}
                    required
                  >
                    <option value="" disabled>Select file type…</option>
                    <option value="pdf">PDF Document</option>
                    <option value="ppt">PowerPoint Presentation</option>
                    <option value="doc">Word Document</option>
                  </select>
                </div>
                {/* Drag & Drop Upload Area */}
                <div>
                  <label className="block text-sm font-semibold mb-1">File Upload <span className="text-red-500">*</span></label>
                  <div
                    className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50 cursor-pointer transition hover:border-[#0F9D78]"
                    style={{ minHeight: '120px', height: 'clamp(120px,20vw,180px)' }}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={e => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setUploadForm(f => ({ ...f, file: e.dataTransfer.files[0] }));
                      }
                    }}
                    onDragOver={e => e.preventDefault()}
                  >
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={e => setUploadForm(f => ({ ...f, file: e.target.files[0] }))}
                    />
                    <span className="text-gray-500 text-sm text-center select-none">
                      {uploadForm.file ? uploadForm.file.name : 'Click to upload or drag and drop'}
                    </span>
                  </div>
                </div>
                {/* Checkbox */}
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    className="accent-[#0F9D78] mr-2"
                    checked={uploadForm.isPublic}
                    onChange={e => setUploadForm(f => ({ ...f, isPublic: e.target.checked }))}
                    id="publicCheckbox"
                  />
                  <label htmlFor="publicCheckbox" className="text-sm select-none">Make this file publicly accessible to students</label>
                </div>
                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:justify-between">
                  <button
                    type="submit"
                    className="bg-[#0F9D78] text-white font-bold px-6 py-2 rounded w-full sm:w-full order-1 sm:order-none"
                  >
                    Upload Material
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 font-semibold px-6 py-2 rounded w-full sm:w-full order-2 sm:order-none"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Material Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMaterials.map((material, idx) => {
            // Assign a random pastel color for each icon
            const pastelColors = [
              'text-red-400', 'text-blue-400', 'text-green-400', 'text-yellow-400', 'text-pink-400', 'text-purple-400', 'text-orange-400', 'text-cyan-400'
            ];
            const colorClass = pastelColors[idx % pastelColors.length];
            // Map subject value for navigation
            let subjectKey = '';
            if (material.title === 'Machine Learning') subjectKey = 'ml';
            else if (material.title === 'Deep Learning') subjectKey = 'dl';
            else if (material.title === 'Reinforcement Learning') subjectKey = 'rl';
            else if (material.title === 'Machine Learning Lab') subjectKey = 'ml-lab';
            else if (material.title === 'Deep Learning Lab') subjectKey = 'dl-lab';
            else if (material.title === 'Computer Vision') subjectKey = 'cv';
            else subjectKey = material.title;
            return (
              <div
                key={material.id}
                className="bg-white border border-gray-200 shadow-sm p-4 flex flex-col gap-3 relative transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer"
                style={{ borderRadius: 0 }}
                onClick={() => handleCardClick(subjectKey, material.title)}
              >
                {/* Top Row: Icon and Public/Private button (top-right) */}
                <div className="flex items-center justify-between mb-2">
                  {/* File Icon */}
                  <div className="w-10 h-10 flex items-center justify-center border border-gray-200 bg-gray-50" style={{ borderRadius: 0 }}>
                    <FileIcon colorClass={colorClass} />
                  </div>
                  <button
                    className={`px-2 py-1 text-xs font-semibold border focus:outline-none transition-colors rounded-full absolute right-4 top-4 ${material.status === 'Public' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-200 text-black border-gray-300'}`}
                    style={{ minWidth: 60 }}
                    onClick={e => { e.stopPropagation(); toggleStatus(material.id); }}
                  >
                    {material.status}
                  </button>
                </div>
                {/* Title */}
                <div className="font-bold text-base text-left text-gray-900">
                  {material.title}
                </div>
                {/* Delete Icon (bottom-right) */}
                <button
                  className="absolute right-4 bottom-4 text-gray-400 hover:text-red-600"
                  title="Delete"
                  onClick={e => { e.stopPropagation(); deleteMaterial(material.id); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 8v8m4-8v8m4-8v8M4 6h12M9 2h2a2 2 0 012 2v2H7V4a2 2 0 012-2z" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
