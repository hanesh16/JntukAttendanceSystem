import React from 'react';

export default function FolderFiles({ folder, onBack }) {
  if (!folder) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 transition-all duration-200">
      <div className="flex items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-emerald-700">LMS</span> /{' '}
            <span className="text-gray-900 font-semibold">{folder.name}</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900">
            {folder.name}
          </h1>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border bg-white font-semibold transition-colors"
          style={{ borderColor: '#E5E7EB', color: '#0F9D78' }}
        >
          Back
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {folder.files.map((fileName) => (
          <div
            key={fileName}
            className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01] hover:shadow-md"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-extrabold"
              style={{ background: 'linear-gradient(135deg, #0F9D78, #0B7A5E)' }}
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
  );
}
